import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { isValidFile } from "@/utils/existAndValidFile";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { updateProfile } from "@/libs/profile";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let uploadedFiles = [];
  try {
    const session = await getSession();
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
      folder: PATH_UPLOAD.admin,
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
    await updateProfile(parseInt(session.id), updateData);
    if (session?.foto) await hapusFile(session?.foto, PATH_UPLOAD.admin);

    return Response.json({ message: "Berhasil memproses foto" });
  } catch (error) {
    getLogs("profile-upload").error(error);
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

export async function DELETE(_request) {
  try {
    const session = await getSession();
    const updateData = {
      updated_at: new Date(),
      foto: null,
    };
    await hapusFile(session?.foto, PATH_UPLOAD.admin);
    await updateProfile(parseInt(session.id), updateData);

    return Response.json({ message: "Berhasil menghapus foto" });
  } catch (error) {
    getLogs("profile-upload").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
