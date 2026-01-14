import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import {
  getJawabanPenelitianDetailById,
  updateJawabanPenelitian,
} from "@/libs/jawaban-penelitian";
import { getPenelitianDetailById } from "@/libs/penelitian";
import { prepareAndSendMessage } from "@/services/whatsappServices";
import { sendEmail } from "@/services/emailServices";
import { MessagePerubahanStatus, EmailPerubahanStatus } from "@/utils/messages";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");
    if (!["whatsapp", "email"].includes(type)) {
      return Response.json(
        { message: "Type tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }
    await getSession();
    const { jawabanId, id } = params;
    const parsedJawabanId = parseInt(jawabanId);
    const parsedPenelitianId = parseInt(id);

    if (!parsedJawabanId || !parsedPenelitianId) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const penelitian = await getPenelitianDetailById(parsedPenelitianId);
    const jawaban = await getJawabanPenelitianDetailById(parsedJawabanId);

    if (!penelitian || !jawaban) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const status = penelitian?.status || "";
    const no_regis = penelitian?.no_regis || "";
    const tiket = penelitian?.tiket || "";
    const telp = penelitian?.pemohon?.telp || "";
    const email = penelitian?.pemohon?.email || "";
    const pesan = jawaban?.pesan || "";

    if (type == "whatsapp") {
      if (!telp) {
        return Response.json(
          { message: `Nomor Telp Tidak Terdeteksi`, error: "UnSend" },
          { status: 404 }
        );
      }

      const value = MessagePerubahanStatus(
        tiket,
        email,
        status,
        no_regis,
        pesan,
        true
      );

      const sending = await prepareAndSendMessage(true, true, telp, value, 0);
      // update
      await updateJawabanPenelitian(parsedJawabanId, { whatsapped: sending });

      if (!sending) {
        return Response.json(
          { message: `Gagal mengirim ulang ${type}`, error: "UnSend" },
          { status: 404 }
        );
      }
    } else {
      if (!email) {
        return Response.json(
          { message: `Email Pemohon Tidak Terdeteksi`, error: "UnSend" },
          { status: 404 }
        );
      }

      const value = EmailPerubahanStatus(
        tiket,
        email,
        status,
        no_regis,
        pesan,
        true
      );

      const sending = await sendEmail({
        to: email,
        subject: "Perubahan Status Permohonan Penelitian",
        html: value,
      });
      // update
      await updateJawabanPenelitian(parsedJawabanId, { mailed: sending });

      if (!sending) {
        return Response.json(
          { message: `Gagal mengirim ulang ${type}`, error: "UnSend" },
          { status: 404 }
        );
      }
    }

    return Response.json({
      message: `Berhasil mengirim ulang ${type}`,
    });
  } catch (error) {
    getLogs("jawaban-penelitian").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
