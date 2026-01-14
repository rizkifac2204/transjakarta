import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { isValidFile } from "@/utils/existAndValidFile";
import { getPemohonDetailById, updatePemohon } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  let uploadedFiles = [];
  try {
    await getSession();
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
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

    const curPemohon = await getPemohonDetailById(parseInt(id));
    if (!curPemohon) {
      return Response.json(
        { message: "Pemohon tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    let resultUpload = await uploadServices(foto, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD.identitas,
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
      identitas: resultUpload.files[0].filename,
    };
    await updatePemohon(parseInt(id), updateData);
    if (curPemohon?.identitas)
      await hapusFile(curPemohon?.identitas, PATH_UPLOAD.identitas);

    return Response.json({ message: "Berhasil memproses foto" });
  } catch (error) {
    getLogs("pemohon").error(error);
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

export async function DELETE(request, { params }) {
  try {
    await getSession();

    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const curPemohon = await getPemohonDetailById(parseInt(id));
    if (!curPemohon) {
      return Response.json(
        { message: "Pemohon tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const updateData = {
      updated_at: new Date(),
      identitas: null,
    };
    await updatePemohon(parseInt(id), updateData);
    if (curPemohon?.identitas)
      await hapusFile(curPemohon?.identitas, PATH_UPLOAD.identitas);

    return Response.json({ message: "Berhasil menghapus foto" });
  } catch (error) {
    getLogs("pemohon").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
