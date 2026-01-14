import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getAllHalaman, createHalaman } from "@/libs/halaman";
import { revalidatePath } from "next/cache";
import { sanitizeHTML } from "@/utils/sanitizeHTML";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getSession();
    const data = await getAllHalaman();
    return Response.json(data);
  } catch (error) {
    getLogs("halaman").error(error);
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
    const { slug, judul, isi } = body;

    if (!slug || !isi || !judul) {
      return Response.json(
        { message: "Lengkapi semua field yang harus diisi", error: "Required" },
        { status: 400 }
      );
    }

    const safeIsi = sanitizeHTML(isi);

    const newHalaman = await createHalaman({
      slug,
      judul: judul ? judul : null,
      isi: safeIsi,
    });

    revalidatePath(`/${slug}`);
    return Response.json(
      {
        message: "Berhasil Menambah Data",
        data: newHalaman,
      },
      { status: 201 }
    );
  } catch (error) {
    getLogs("halaman").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
