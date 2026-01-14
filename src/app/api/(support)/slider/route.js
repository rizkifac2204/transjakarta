import { getSession } from "@/libs/auth";
import { parseFormData } from "@/utils/parseFormData";
import getLogs from "@/libs/getLogs";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { PATH_UPLOAD, MAX_FOTO_SIZE } from "@/configs/appConfig";
import { createSlider } from "@/libs/slider";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let uploadedFiles = [];
  try {
    const session = await getSession();
    const isMaster = session.level_id < 3;
    if (!isMaster) {
      return Response.json(
        { message: "Tidak Cukup Akses", error: "InvalidAcccess" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      integerFields: ["urutan"],
    });
    const { judul, deskripsi, file: uploadedFile, urutan, link } = parsed;

    if (!judul || !deskripsi || !urutan) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    let resultFile = { files: [] };
    const isFileUploadExist = isValidFile(uploadedFile);
    if (!isFileUploadExist) {
      return Response.json(
        {
          message: "Harus Upload",
          error: "Required",
        },
        { status: 400 }
      );
    }

    resultFile = await uploadServices(uploadedFile, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD.slider,
    });

    if (!resultFile.success) {
      return Response.json(
        { message: resultFile.message, error: "UploadError" },
        { status: 400 }
      );
    }

    uploadedFiles = [resultFile];

    const inserted = await createSlider({
      judul,
      deskripsi,
      urutan,
      file: isFileUploadExist ? resultFile.files[0].filename : null,
      link,
      is_active: true,
    });

    revalidatePath(`/`);
    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("slider").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
