import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import {
  getUISub,
  createUIHeaderDynamic,
} from "@/libs/ukpbj-informasi-withsub";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getUISub();
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

export async function POST(request) {
  try {
    await getSession();
    const body = await request.json();
    const { label, headerId } = body;
    if (!label) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const inserted = await createUIHeaderDynamic("ukpbj_informasi_header_sub", {
      header_id: headerId || null,
      label: label,
    });

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
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
