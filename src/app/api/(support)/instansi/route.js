import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";
import {
  getInstansi,
  createInstansi,
  updateInstansi,
  deleteInstansi,
} from "@/libs/instansi";
import { revalidatePath } from "next/cache";
import { prepareAndSendMessage } from "@/services/whatsappServices";
import { MessageWelcomeAdmin } from "@/utils/messages";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();

    const data = await getInstansi();
    return Response.json(data);
  } catch (error) {
    getLogs("instansi").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getSession();
    const isMaster = session.level_id < 3;
    if (!isMaster) {
      return Response.json(
        { message: "Tidak Cukup Akses", error: "InvalidAcccess" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = parseJsonBody(body, {});
    const {
      nama,
      kode,
      telp_1,
      telp_2,
      email,
      alamat,
      website,
      facebook,
      twitter,
      instagram,
      youtube,
      tiktok,
      notif_wa,
      notif_email,
    } = parsed;

    const data = await getInstansi();
    const isExist = Object.keys(data).length !== 0;
    let processed;
    if (isExist) {
      // proses update
      if (notif_wa && data?.notif_wa !== notif_wa) {
        const sendwa = await prepareAndSendMessage(
          false,
          true,
          notif_wa,
          MessageWelcomeAdmin()
        );
        // if (!sendwa) {
        //   return Response.json(
        //     {
        //       message:
        //         "Tolong selesaikan dulu settingan pada halaman whatsapp kemudian input ulang nomor notifikasi",
        //       error: "InvalidAcccess",
        //     },
        //     { status: 400 }
        //   );
        // }
      }
      processed = await updateInstansi({
        nama,
        kode,
        telp_1,
        telp_2,
        email,
        alamat,
        website,
        facebook,
        twitter,
        instagram,
        youtube,
        tiktok,
        notif_wa,
        notif_email,
      });
    } else {
      // proses insert
      if (notif_wa) {
        await prepareAndSendMessage(
          false,
          true,
          notif_wa,
          MessageWelcomeAdmin()
        );
        // if (!sendwa) {
        //   return Response.json(
        //     {
        //       message:
        //         "Tolong selesaikan dulu settingan pada halaman whatsapp kemudian input ulang nomor notifikasi",
        //       error: "InvalidAcccess",
        //     },
        //     { status: 400 }
        //   );
        // }
      }
      processed = await createInstansi({
        nama,
        kode,
        telp_1,
        telp_2,
        email,
        alamat,
        website,
        facebook,
        twitter,
        instagram,
        youtube,
        tiktok,
        notif_wa,
        notif_email,
      });
    }

    revalidatePath("/seputar-ppid/lokasi-kontak");
    return Response.json({
      message: "Berhasil mengupdate data",
      data: processed,
    });
  } catch (error) {
    console.log(error);
    getLogs("instansi").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    const isMaster = session.level_id < 3;
    if (!isMaster) {
      return Response.json(
        { message: "Tidak Cukup Akses", error: "InvalidAcccess" },
        { status: 400 }
      );
    }

    const deleted = await deleteInstansi();

    revalidatePath("/seputar-ppid/lokasi-kontak");
    return Response.json({
      message: "Berhasil mereset data",
      deleted: deleted,
    });
  } catch (error) {
    getLogs("instansi").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
