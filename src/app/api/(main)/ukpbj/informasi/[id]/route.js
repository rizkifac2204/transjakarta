import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { revalidatePath } from "next/cache";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import {
  getUIDetailById,
  updateUI,
  deleteUI,
} from "@/libs/ukpbj-informasi-withsub";
import validateFileAndLink from "@/utils/validateFileAndLink";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getUIDetailById(parsedId);
    return Response.json(data);
  } catch (error) {
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

export async function PATCH(request, { params }) {
  let uploadedFiles = [];
  try {
    await getSession();

    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const label = formData.get("label");
    const link = formData.get("link");
    const file = formData.get("file");
    const status_file = formData.get("status_file");

    if (!label) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const curData = await getUIDetailById(parsedId);
    if (!curData) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }
    const validasi = validateFileAndLink({
      status_file,
      link,
      file,
      curFile: curData.file,
    });
    if (!validasi.valid) {
      return Response.json(
        { message: validasi.message, error: "Required" },
        { status: 400 }
      );
    }

    // prepare file pendukung upload
    let filenameBaru = null;

    // jika request delete
    if (status_file === "delete") {
      await hapusFile(curData.file, PATH_UPLOAD.ukpbj.informasi);
      filenameBaru = null; // set file baru menjadi null
    }
    // jika request change
    if (status_file === "change") {
      if (isValidFile(file)) {
        // hapus file pendukung lama jika ada
        if (curData.file) {
          await hapusFile(curData.file, PATH_UPLOAD.ukpbj.informasi);
        }

        // upload file pendukung baru
        const resultFile = await uploadServices(file, {
          allowedTypes: [...MIME_PRESETS.allSafe],
          maxSize: MAX_FILE_SIZE,
          folder: PATH_UPLOAD.ukpbj.informasi,
        });

        if (!resultFile.success) {
          return Response.json(
            { message: resultFile.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(resultFile);
        filenameBaru =
          resultFile.files.length > 0 ? resultFile.files[0].filename : null;
      }
    }

    // Siapkan objek update
    const updateData = {
      label,
      link: link ? link : null,
    };
    if (status_file === "delete") {
      updateData.file = null;
    } else if (filenameBaru !== null) {
      updateData.file = filenameBaru;
    }

    const updated = await updateUI(parsedId, updateData);
    revalidatePath("/ukpbj/informasi-pbj");

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("ukpbj").error(error);
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
    await getSession();

    const { id } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    // Ambil data lama untuk cek file pendukung lama & email lama
    const curData = await getUIDetailById(parsedId);
    if (!curData) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (curData?.file) {
      await hapusFile(curData?.file, PATH_UPLOAD.ukpbj.informasi);
    }
    const deleted = await deleteUI(parsedId);

    revalidatePath("/ukpbj/informasi-pbj");

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
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
