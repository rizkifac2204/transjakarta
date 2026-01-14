import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { hapusFile } from "@/services/uploadservices";
import { updatePermohonan, deletePermohonan } from "@/libs/permohonan";
import { updateKeberatan, deleteKeberatan } from "@/libs/keberatan";
import { updatePenelitian, deletePenelitian } from "@/libs/penelitian";
import {
  getTrashPermohonanDetailById,
  getTrashKeberatanDetailById,
  getTrashPenelitianDetailById,
} from "@/libs/trash";
import { getJawabanByPermohonanId } from "@/libs/jawaban";
import { getJawabanPenelitianByPenelitianId } from "@/libs/jawaban-penelitian";

export const dynamic = "force-dynamic";

export async function PATCH(_request, { params }) {
  try {
    await getSession();
    const { id, type } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!["keberatan", "permohonan", "penelitian"].includes(type)) {
      return Response.json(
        { message: "TYPE tidak valid", error: "InvalidTYPE" },
        { status: 400 }
      );
    }

    let dataLama = null;
    switch (type) {
      case "permohonan":
        dataLama = await getTrashPermohonanDetailById(parsedId);
        break;
      case "keberatan":
        dataLama = await getTrashKeberatanDetailById(parsedId);
        break;
      case "penelitian":
        dataLama = await getTrashPenelitianDetailById(parsedId);
        break;
    }
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    let updated = null;
    const updateData = { deleted_at: null };
    switch (type) {
      case "permohonan":
        updated = await updatePermohonan(parsedId, updateData);
        break;
      case "keberatan":
        updated = await updateKeberatan(parsedId, updateData);
        break;
      case "penelitian":
        updated = await updatePenelitian(parsedId, updateData);
        break;
    }

    return Response.json({
      message: "Berhasil mengupdate data",
      data: updated,
    });
  } catch (error) {
    getLogs("trash").error(error);
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
    const { id, type } = await params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    if (!["keberatan", "permohonan", "penelitian"].includes(type)) {
      return Response.json(
        { message: "TYPE tidak valid", error: "InvalidTYPE" },
        { status: 400 }
      );
    }
    const isPermohonan = type === "permohonan";
    const PATHFOLDER = isPermohonan
      ? PATH_UPLOAD.permohonan
      : PATH_UPLOAD.keberatan;

    let dataLama = null;
    switch (type) {
      case "permohonan":
        dataLama = await getTrashPermohonanDetailById(parsedId);
        break;
      case "keberatan":
        dataLama = await getTrashKeberatanDetailById(parsedId);
        break;
      case "penelitian":
        dataLama = await getTrashPenelitianDetailById(parsedId);
        break;
    }
    if (!dataLama) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (type === "permohonan") {
      const daftarJawaban = await getJawabanByPermohonanId(parsedId);
      if (Array.isArray(daftarJawaban)) {
        for (const jawaban of daftarJawaban) {
          await hapusFile(
            jawaban.file_surat_pemberitahuan,
            PATH_UPLOAD.jawaban.pemberitahuan
          );
          await hapusFile(
            jawaban.file_informasi,
            PATH_UPLOAD.jawaban.informasi
          );
        }
      }
      if (dataLama?.file_pendukung) {
        await hapusFile(dataLama?.file_pendukung, PATH_UPLOAD.permohonan);
      }
    }
    if (type === "penelitian") {
      const daftarJawaban = await getJawabanPenelitianByPenelitianId(parsedId);
      if (Array.isArray(daftarJawaban)) {
        for (const jawaban of daftarJawaban) {
          await hapusFile(
            jawaban.file_surat_pemberitahuan,
            PATH_UPLOAD.jawabanpenelitian.pemberitahuan
          );
          await hapusFile(
            jawaban.file_informasi,
            PATH_UPLOAD.jawabanpenelitian.informasi
          );
        }
      }
      if (dataLama?.file_permohonan) {
        await hapusFile(
          dataLama?.file_permohonan,
          PATH_UPLOAD.penelitian.permohonan
        );
      }
      if (dataLama?.file_proposal) {
        await hapusFile(
          dataLama?.file_proposal,
          PATH_UPLOAD.penelitian.proposal
        );
      }
      if (dataLama?.file_pertanyaan) {
        await hapusFile(
          dataLama?.file_pertanyaan,
          PATH_UPLOAD.penelitian.pertanyaan
        );
      }
    }
    if (type === "keberatan") {
      if (dataLama?.file_pendukung) {
        await hapusFile(dataLama?.file_pendukung, PATH_UPLOAD.keberatan);
      }
    }

    let deleted = null;
    switch (type) {
      case "permohonan":
        dataLama = await deletePermohonan(parsedId);
        break;
      case "keberatan":
        dataLama = await deleteKeberatan(parsedId);
        break;
      case "penelitian":
        dataLama = await deletePenelitian(parsedId);
        break;
    }

    return Response.json({
      message: "Berhasil menghapus data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("trash").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
