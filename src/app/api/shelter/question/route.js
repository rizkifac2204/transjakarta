import { verifyAuth } from "@/libs/jwt";
import {
  createShelterQuestion,
  getAllShelterQuestion,
  getQuestionsByShelterType,
} from "@/libs/shelter-question";
import getLogs from "@/libs/getLogs";
import { parseJsonBody } from "@/utils/parseJsonBody";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shelterTypeId = searchParams.get("shelter_type_id");

    if (shelterTypeId) {
      const parsedShelterTypeId = parseInt(shelterTypeId);
      if (isNaN(parsedShelterTypeId)) {
        return Response.json(
          { message: "shelter_type_id tidak valid" },
          { status: 400 },
        );
      }
      const questions = await getQuestionsByShelterType(parsedShelterTypeId);
      return Response.json(questions);
    }

    const questions = await getAllShelterQuestion();
    return Response.json(questions);
  } catch (error) {
    getLogs("shelter-question").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request) {
  try {
    await verifyAuth();

    const body = await request.json();
    const parsedBody = parseJsonBody(body, {
      integerFields: ["shelter_type_id"],
    });

    const {
      shelter_type_id,
      section,
      basic,
      indicator,
      spm_criteria,
      spm_reference,
      order,
    } = parsedBody;

    if (!section || !indicator || !spm_criteria) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newData = await createShelterQuestion({
      shelter_type_id,
      section,
      basic,
      indicator,
      spm_criteria,
      spm_reference,
      order,
    });

    return Response.json(newData, { status: 201 });
  } catch (error) {
    getLogs("shelter-question").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
