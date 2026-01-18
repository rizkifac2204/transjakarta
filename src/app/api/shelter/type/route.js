import { getAllShelterTypes } from "@/libs/shelter-type";
import getLogs from "@/libs/getLogs";

export async function GET(request) {
  try {
    const shelterTypes = await getAllShelterTypes();
    return Response.json(shelterTypes);
  } catch (error) {
    getLogs("shelter-type").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
