import { getSession } from "@/libs/auth-public";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFile,
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import { updatePemohon } from "@/libs/pemohon";
import { withCorsHeaders, handleOptionsCors } from "@/utils/cors";

export const dynamic = "force-dynamic";
export async function OPTIONS() {
  return handleOptionsCors();
}

export async function POST(request) {
  let uploadedFiles = [];
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized", error: "auth" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData, {});
    const { section, path, file } = parsed;
    const isUploadExist = isValidFile(file);
    if (!section || !isUploadExist || !path) {
      return Response.json(
        { message: "Tidak Lengkap", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    let resultUpload = await uploadServices(file, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD[path],
    });

    if (!resultUpload.success) {
      return Response.json(
        { message: resultUpload.message, error: "UploadError" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    uploadedFiles = [resultUpload];

    const updateData = {
      updated_at: new Date(),
      [section]: resultUpload.files[0].filename,
    };
    await updatePemohon(parseInt(session.id), updateData);

    if (session?.[section])
      await hapusFile(session?.[session], PATH_UPLOAD[path]);

    return Response.json(
      { message: "Berhasil Update" },
      { status: 200, headers: withCorsHeaders() }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        { message: "Unauthorized", error: "auth" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const path = searchParams.get("path");
    if (!section || !path) {
      return Response.json(
        { message: "Tidak Lengkap", error: "Required" },
        { status: 400, headers: withCorsHeaders() }
      );
    }

    const updateData = {
      updated_at: new Date(),
      [section]: null,
    };
    await updatePemohon(parseInt(session.id), updateData);
    if (session?.[section])
      await hapusFile(session?.[session], PATH_UPLOAD[path]);

    return Response.json(
      { message: "Berhasil Hapus" },
      { status: 200, headers: withCorsHeaders() }
    );
  } catch (error) {
    getLogs("publik").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500, headers: withCorsHeaders() }
    );
  }
}
