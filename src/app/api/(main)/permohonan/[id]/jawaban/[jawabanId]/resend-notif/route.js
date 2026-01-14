import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getJawabanDetailById, updateJawaban } from "@/libs/jawaban";
import { getPermohonanDetailById } from "@/libs/permohonan";
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
    const parsedPermohonanId = parseInt(id);

    if (!parsedJawabanId || !parsedPermohonanId) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const permohonan = await getPermohonanDetailById(parsedPermohonanId);
    const jawaban = await getJawabanDetailById(parsedJawabanId);

    if (!permohonan || !jawaban) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    const status = permohonan?.status || "";
    const no_regis = permohonan?.no_regis || "";
    const tiket = permohonan?.tiket || "";
    const telp = permohonan?.pemohon?.telp || "";
    const email = permohonan?.pemohon?.email || "";
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
        pesan
      );

      const sending = await prepareAndSendMessage(true, true, telp, value, 0);
      // update
      await updateJawaban(parsedJawabanId, { whatsapped: sending });

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

      const value = EmailPerubahanStatus(tiket, email, status, no_regis, pesan);

      const sending = await sendEmail({
        to: email,
        subject: "Perubahan Status Permohonan",
        html: value,
      });
      // update
      await updateJawaban(parsedJawabanId, { mailed: sending });

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
    getLogs("jawaban").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
