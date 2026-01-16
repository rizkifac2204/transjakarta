import { verifyAuth } from "@/libs/jwt";
import { parseJsonBody } from "@/utils/parseJsonBody";
import { getArmadaById, updateArmada, deleteArmada } from "@/libs/armada";
import getLogs from "@/libs/getLogs";

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const armada = await getArmadaById(parsedId);

    if (!armada) {
      return Response.json({ error: "Data not found" }, { status: 404 });
    }

    return Response.json(armada);
  } catch (error) {
    getLogs("armada").error(error);
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
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["service_type_id", "fleet_type_id"],
      dateFields: ["tanggal", "jam_mulai", "jam_selesai"],
    });

    const {
      service_type_id,
      fleet_type_id,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
      no_body,
      kode_trayek,
      asal_tujuan,
    } = parsedBody;

    if (
      !service_type_id ||
      !fleet_type_id ||
      !tanggal ||
      !periode ||
      !jam_mulai ||
      !jam_selesai ||
      !no_body ||
      !kode_trayek ||
      !asal_tujuan
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const armada = await getArmadaById(parsedId);
    if (!armada) {
      return Response.json({ error: "Data not found" }, { status: 404 });
    }
    if (auth.level >= 4 && armada.surveyor_id !== auth.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await updateArmada(parsedId, {
      service_type_id,
      fleet_type_id,
      tanggal,
      periode,
      jam_mulai,
      jam_selesai,
      no_body,
      kode_trayek,
      asal_tujuan,
    });

    return Response.json(updated);
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth();

    const { id } = params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const armada = await getArmadaById(parsedId);
    if (!armada) {
      return Response.json({ error: "Data not found" }, { status: 404 });
    }
    if (auth.level >= 4 && armada.surveyor_id !== auth.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await deleteArmada(parsedId);

    return Response.json({
      message: "Berhasil menghapus data",
      payload: deleted,
    });
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 }
    );
  }
}
