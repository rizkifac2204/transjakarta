import { verifyAuth } from "@/libs/jwt";
import {
  getAllArmadaQuestionSet,
  createArmadaQuestionSet,
} from "@/libs/armada-question-set";
import getLogs from "@/libs/getLogs";

export async function GET() {
  try {
    const questionSets = await getAllArmadaQuestionSet();
    return Response.json(questionSets);
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

export async function POST(request) {
  try {
    const auth = await verifyAuth();
    if (auth.level > 3)
      return Response.json({ message: "Forbidden" }, { status: 403 });

    const { description, service_types, fleet_types } = await request.json();
    if (!description || !service_types || !fleet_types) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // console.log({ description, service_types, fleet_types });
    // return Response.json({ error: "KEDAP" }, { status: 400 });

    const newQuestionSet = await createArmadaQuestionSet({
      description,
      service_types: {
        connect: service_types,
      },
      fleet_types: {
        connect: fleet_types,
      },
    });

    return Response.json(newQuestionSet, { status: 201 });
  } catch (error) {
    console.log(error);
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
