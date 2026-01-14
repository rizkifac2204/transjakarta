import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getPeraturanHeader, createPeraturanHeader } from "@/libs/peraturan";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getPeraturanHeader();
    return Response.json(data);
  } catch (error) {
    getLogs("peraturan").error(error);
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
    const { label } = body;
    if (!label) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const inserted = await createPeraturanHeader({
      label,
    });

    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    getLogs("peraturan").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
