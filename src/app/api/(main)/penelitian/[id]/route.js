import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseFormData } from "@/utils/parseFormData";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { MAX_FILE_SIZE, MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";
import { isValidFile } from "@/utils/existAndValidFile";
import validateEmail from "@/utils/validateEmail";
import {
  getPenelitianDetailById,
  getPenelitianDetailByNoRegis,
  updatePenelitian,
} from "@/libs/penelitian";
import { getPemohonDetailByEmail, createPemohon } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    await getSession();
    const { id } = await params;
    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const data = await getPenelitianDetailById(parseInt(id));
    return Response.json(data);
  } catch (error) {
    getLogs("penelitian").error(error);
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
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsed = parseFormData(formData, {
      dateFields: ["tanggal"],
      integerFields: ["admin_id"],
      booleanFields: [],
    });

    const {
      no_regis,
      admin_id,
      tanggal,
      tipe,
      email,
      judul,
      tujuan,
      nomor_identitas,
      nama,
      nim,
      universitas,
      jurusan,
      identitas,
      file_permohonan,
      file_proposal,
      file_pertanyaan,
      status_file_permohonan,
      status_file_proposal,
      status_file_pertanyaan,
      status,
    } = parsed;
    let pemohonId = null;

    // Ambil data lama untuk cek file pendukung lama & email lama
    const dataLama = await getPenelitianDetailById(parseInt(id));
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }
    pemohonId = dataLama.pemohon_id;

    // Cek validasi input minimal, bisa disesuaikan
    if (!no_regis || !admin_id || !tanggal || !judul || !tujuan || !status) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    // cek jika nomor regis sama dengan data lain
    if (dataLama.no_regis !== no_regis) {
      const isRegisExist = await getPenelitianDetailByNoRegis(
        no_regis,
        parseInt(id)
      );
      if (isRegisExist) {
        return Response.json(
          {
            message: "Nomor Registrasi Sudah Digunakan. Mohon Ganti",
            error: "RegisExist",
          },
          { status: 400 }
        );
      }
    }

    // Proses email pemohon
    let resultIdentitas = { files: [] };
    if (email) {
      if (!validateEmail(email)) {
        return Response.json(
          { message: "Format email tidak valid", error: "InvalidEmail" },
          { status: 400 }
        );
      }

      // Kalau email berubah
      if (email !== dataLama.email) {
        // cek apakah pemohon baru sudah ada
        let pemohon = await getPemohonDetailByEmail(String(email));
        if (!pemohon) {
          // upload identitas jika ada file
          if (isValidFile(identitas)) {
            resultIdentitas = await uploadServices(identitas, {
              allowedTypes: [...MIME_PRESETS.image],
              maxSize: MAX_FOTO_SIZE,
              folder: PATH_UPLOAD.identitas,
            });
            if (!resultIdentitas.success) {
              return Response.json(
                { message: resultIdentitas.message, error: "UploadError" },
                { status: 400 }
              );
            }
          }
          // buat pemohon baru
          pemohon = await createPemohon({
            email,
            nim,
            universitas,
            jurusan,
            nomor_identitas,
            nama: nama || "Noname",
            identitas:
              resultIdentitas.files.length > 0
                ? resultIdentitas.files[0].filename
                : null,
          });
        }
        // kalau sudah ada, lewati update pemohon dan upload identitas
        pemohonId = pemohon.id;
      }
    }

    // jika request delete
    if (status_file_permohonan === "delete") {
      await hapusFile(
        dataLama.file_permohonan,
        PATH_UPLOAD.penelitian.permohonan
      );
    }
    if (status_file_proposal === "delete") {
      await hapusFile(dataLama.file_proposal, PATH_UPLOAD.penelitian.proposal);
    }
    if (status_file_pertanyaan === "delete") {
      await hapusFile(
        dataLama.file_pertanyaan,
        PATH_UPLOAD.penelitian.pertanyaan
      );
    }

    // prepare file upload
    let filenamePermohonanBaru = null;
    let filenameProposalBaru = null;
    let filenamePertanyaanBaru = null;

    // jika request change
    if (status_file_permohonan === "change") {
      if (isValidFile(file_permohonan)) {
        // hapus file lama jika ada
        if (dataLama.file_permohonan) {
          await hapusFile(
            dataLama.file_permohonan,
            PATH_UPLOAD.penelitian.permohonan
          );
        }

        // upload file baru
        const resultPermohonan = await uploadServices(file_permohonan, {
          allowedTypes: [...MIME_PRESETS.allSafe],
          maxSize: MAX_FILE_SIZE,
          folder: PATH_UPLOAD.penelitian.permohonan,
        });

        if (!resultPermohonan.success) {
          return Response.json(
            { message: resultPermohonan.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(resultPermohonan);
        filenamePermohonanBaru =
          resultPermohonan.files.length > 0
            ? resultPermohonan.files[0].filename
            : null;
      }
    }
    if (status_file_proposal === "change") {
      if (isValidFile(file_proposal)) {
        // hapus file lama jika ada
        if (dataLama.file_proposal) {
          await hapusFile(
            dataLama.file_proposal,
            PATH_UPLOAD.penelitian.proposal
          );
        }

        // upload file baru
        const resultProposal = await uploadServices(file_proposal, {
          allowedTypes: [...MIME_PRESETS.allSafe],
          maxSize: MAX_FILE_SIZE,
          folder: PATH_UPLOAD.penelitian.proposal,
        });

        if (!resultProposal.success) {
          return Response.json(
            { message: resultProposal.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(resultProposal);
        filenameProposalBaru =
          resultProposal.files.length > 0
            ? resultProposal.files[0].filename
            : null;
      }
    }
    if (status_file_pertanyaan === "change") {
      if (isValidFile(file_pertanyaan)) {
        // hapus file lama jika ada
        if (dataLama.file_pertanyaan) {
          await hapusFile(
            dataLama.file_pertanyaan,
            PATH_UPLOAD.penelitian.pertanyaan
          );
        }

        // upload file baru
        const resultPertanyaan = await uploadServices(file_pertanyaan, {
          allowedTypes: [...MIME_PRESETS.allSafe],
          maxSize: MAX_FILE_SIZE,
          folder: PATH_UPLOAD.penelitian.pertanyaan,
        });

        if (!resultPertanyaan.success) {
          return Response.json(
            { message: resultPertanyaan.message, error: "UploadError" },
            { status: 400 }
          );
        }

        uploadedFiles.push(resultPertanyaan);
        filenamePertanyaanBaru =
          resultPertanyaan.files.length > 0
            ? resultPertanyaan.files[0].filename
            : null;
      }
    }

    // Siapkan objek update permohonan
    const updateData = {
      no_regis,
      admin_id,
      tipe,
      tanggal,
      judul,
      tujuan,
      status,
      updated_at: new Date(),
    };
    if (email) {
      updateData.pemohon_id = pemohonId;
      updateData.email = email;
    } else {
      updateData.pemohon_id = null;
      updateData.email = null;
    }
    if (status_file_permohonan === "delete") {
      updateData.file_permohonan = null;
    } else if (filenamePermohonanBaru !== null) {
      updateData.file_permohonan = filenamePermohonanBaru;
    }
    if (status_file_proposal === "delete") {
      updateData.file_proposal = null;
    } else if (filenameProposalBaru !== null) {
      updateData.file_proposal = filenameProposalBaru;
    }
    if (status_file_pertanyaan === "delete") {
      updateData.file_pertanyaan = null;
    } else if (filenamePertanyaanBaru !== null) {
      updateData.file_pertanyaan = filenamePertanyaanBaru;
    }

    const updated = await updatePenelitian(parseInt(id), updateData);

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("penelitian").error(error);
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

    const id = params.id;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    // Ambil data permohonan lama untuk cek file pendukung lama & email lama
    const dataLama = await getPenelitianDetailById(parsedId);
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const prosess = await updatePenelitian(parseInt(id), {
      deleted_at: new Date(),
    });

    return Response.json({
      message: "Dipindahkan Ke Sampah",
      deleted: prosess,
    });
  } catch (error) {
    getLogs("penelitian").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
