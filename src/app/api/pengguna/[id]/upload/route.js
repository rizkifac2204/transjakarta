import { verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";
import { getUserById, updateUser } from "@/libs/user";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { isValidFile } from "@/utils/existAndValidFile";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  let uploadedFiles = [];
  try {
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const pengguna = await getUserById(parsedId);
    if (!pengguna) {
      return Response.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    if (pengguna.level_id < auth.level) {
      return Response.json({ message: "Keterbatasan Akses" }, { status: 403 });
    }

    const formData = await request.formData();
    const foto = formData.get("file");
    const isUploadExist = isValidFile(foto);

    if (!isUploadExist) {
      return Response.json(
        { message: "File Tidak Valid.", error: "Required" },
        { status: 400 }
      );
    }

    let resultUpload = await uploadServices(foto, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD.user,
    });

    if (!resultUpload.success) {
      return Response.json(
        { message: resultUpload.message, error: "UploadError" },
        { status: 400 }
      );
    }

    uploadedFiles = [resultUpload];

    const updateData = {
      updated_at: new Date(),
      foto: resultUpload.files[0].filename,
    };
    await updateUser(parsedId, updateData);
    if (pengguna?.foto) await hapusFile(pengguna?.foto, PATH_UPLOAD.user);

    return Response.json({ message: "Berhasil memproses foto" });
  } catch (error) {
    getLogs("pengguna").error(error);
    await hapusFileYangSudahTerupload(uploadedFiles);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await verifyAuth();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const pengguna = await getUserById(parsedId);
    if (!pengguna) {
      return Response.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const isManage = canManage(pengguna.level_id, auth.level);
    if (pengguna.level_id < auth.level) {
      return Response.json({ message: "Keterbatasan Akses" }, { status: 403 });
    }

    const updateData = {
      updated_at: new Date(),
      foto: null,
    };
    await hapusFile(pengguna?.foto, PATH_UPLOAD.user);
    await updateUser(parsedId, updateData);

    return Response.json({ message: "Berhasil menghapus foto" });
  } catch (error) {
    getLogs("pengguna").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
