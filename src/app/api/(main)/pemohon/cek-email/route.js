import getLogs from "@/libs/getLogs";
import { getSession } from "@/libs/auth";
import { getPemohonDetailByEmail } from "@/libs/pemohon";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await getSession();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    let result = null;

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Parameter email wajib diisi" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await getPemohonDetailByEmail(email);
    if (data) {
      result = {
        nama: data?.nama,
        nomor_identitas: data?.nomor_identitas,
        telp: data?.telp,
        alamat: data?.alamat,
        identitas: data?.identitas,
      };
    }

    return Response.json(result);
  } catch (error) {
    getLogs("pemohon").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
