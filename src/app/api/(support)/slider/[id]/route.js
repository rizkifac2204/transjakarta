import { getSession } from "@/libs/auth";
import getLogs from "@/libs/getLogs";
import { getSliderById, deleteSlider } from "@/libs/slider";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { hapusFile } from "@/services/uploadservices";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function DELETE(_request, { params }) {
  try {
    const session = await getSession();
    const isMaster = session.level_id < 3;
    if (!isMaster) {
      return Response.json(
        { message: "Tidak Cukup Akses", error: "InvalidAccess" },
        { status: 400 }
      );
    }

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json(
        { message: "ID tidak valid", error: "InvalidID" },
        { status: 400 }
      );
    }

    const currentData = await getSliderById(parsedId);
    if (!currentData) {
      return Response.json(
        { message: "Data tidak ditemukan", error: "NotFound" },
        { status: 404 }
      );
    }

    if (currentData.file) {
      await hapusFile(currentData.file, PATH_UPLOAD.slider);
    }

    const deleted = await deleteSlider(parsedId);

    revalidatePath(`/`);
    return Response.json({
      message: "Berhasil menghapus data",
      deleted,
    });
  } catch (error) {
    getLogs("slider").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
