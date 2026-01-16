import { verifyAuth } from "@/libs/jwt";
import { createArmadaQuestion } from "@/libs/armada-question";
import getLogs from "@/libs/getLogs";

export async function POST(request, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.level > 3)
      return Response.json({ message: "Forbidden" }, { status: 403 });

    const { questionSetId } = params;
    const parsedId = parseInt(questionSetId);
    if (!questionSetId || isNaN(parsedId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const { section, basic, indicator, spm_criteria, spm_reference, order } =
      await request.json();

    if (!section || !basic || !indicator || !spm_criteria || !order) {
      return Response.json({ error: "Lengkapi Data" }, { status: 400 });
    }

    const newQuestion = await createArmadaQuestion({
      set_id: parsedId,
      section,
      basic,
      indicator,
      spm_criteria,
      spm_reference,
      order,
    });

    return Response.json(newQuestion, { status: 201 });
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
