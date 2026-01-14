import { getSession } from "@/libs/auth";
import { revalidatePath } from "next/cache";
import getLogs from "@/libs/getLogs";
import { isValidFile } from "@/utils/existAndValidFile";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipDetailById, updateDip, deleteDip } from "@/libs/dip";
import validateFileAndLink from "@/utils/validateFileAndLink";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400 }
      );
    }

    const data = await getDipDetailById(String(kategori), parsedId);
    return Response.json(data);
  } catch (error) {
    getLogs("dip").error(error);
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

    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const header_id = formData.get("header_id");
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

    const curDip = await getDipDetailById(String(kategori), parsedId);
    if (!curDip) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const validasi = validateFileAndLink({
      status_file,
      link,
      file,
      curFile: curDip.file,
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
      await hapusFile(curDip.file, PATH_UPLOAD.dip[kategori]);
      filenameBaru = null; // set file baru menjadi null
    }
    // jika request change
    if (status_file === "change") {
      if (isValidFile(file)) {
        // hapus file pendukung lama jika ada
        if (curDip.file) {
          await hapusFile(curDip.file, PATH_UPLOAD.dip[kategori]);
        }

        // upload file pendukung baru
        const resultFile = await uploadServices(file, {
          allowedTypes: [...MIME_PRESETS.allSafe],
          maxSize: MAX_FILE_SIZE,
          folder: PATH_UPLOAD.dip[kategori],
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
      header_id: header_id ? parseInt(header_id) : null,
      kategori,
      label,
      link: link ? link : null,
    };
    if (status_file === "delete") {
      updateData.file = null;
    } else if (filenameBaru !== null) {
      updateData.file = filenameBaru;
    }

    const updated = await updateDip(parsedId, updateData);

    revalidatePath(`/informasi-pubik/${kategori}`);
    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    getLogs("dip").error(error);
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

    const { id, kategori } = await params;

    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!kategori || !DIP_KATEGORI.includes(kategori)) {
      return Response.json(
        { message: "Kategori tidak valid", error: "InvalidKategori" },
        { status: 400 }
      );
    }
    const curDip = await getDipDetailById(String(kategori), parsedId);
    if (!curDip) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (curDip?.file) {
      await hapusFile(curDip?.file, PATH_UPLOAD.dip[kategori]);
    }
    const deleted = await deleteDip(parsedId);

    revalidatePath(`/informasi-pubik/${kategori}`);
    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("dip").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
