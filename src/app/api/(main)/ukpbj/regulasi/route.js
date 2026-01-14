import { getSession } from "@/libs/auth";
import { revalidatePath } from "next/cache";
import getLogs from "@/libs/getLogs";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import { createUkpbjRegulasi } from "@/libs/ukpbj-regulasi";
import uploadServices, {
  hapusFileYangSudahTerupload,
} from "@/services/uploadservices";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let uploadedFiles = [];
  try {
    await getSession();

    const formData = await request.formData();
    const header_id = formData.get("header_id");
    const label = formData.get("label");
    const link = formData.get("link");
    const file = formData.get("file");

    if (!label) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }
    if (!link && (!file || file.size === 0 || !file.name)) {
      return Response.json(
        {
          message: "Harus input minimal satu sumber file, Link atau Upload",
          error: "Required",
        },
        { status: 400 }
      );
    }

    let resultFile = { files: [] };
    const isFileUploadExist = isValidFile(file);

    // Upload file pendukung tetap diproses terpisah
    if (isFileUploadExist) {
      resultFile = await uploadServices(file, {
        allowedTypes: [...MIME_PRESETS.allSafe],
        maxSize: MAX_FILE_SIZE,
        folder: PATH_UPLOAD.ukpbj.regulasi,
      });

      if (!resultFile.success) {
        return Response.json(
          { message: resultFile.message, error: "UploadError" },
          { status: 400 }
        );
      }
    }

    uploadedFiles = [resultFile];

    const inserted = await createUkpbjRegulasi({
      header_id: header_id ? parseInt(header_id) : null,
      label,
      link: link ? link : null,
      file: isFileUploadExist ? resultFile.files[0].filename : null,
    });

    revalidatePath("/ukpbj/regulasi");

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    await hapusFileYangSudahTerupload(uploadedFiles);
    getLogs("ukpbj").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
