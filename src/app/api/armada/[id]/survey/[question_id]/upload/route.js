import { verifyAuth } from "@/libs/jwt";
import getLogs from "@/libs/getLogs";
import prisma from "@/libs/prisma";
import { MIME_PRESETS } from "@/utils/mimePresets";
import { isValidFile } from "@/utils/existAndValidFile";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";
import uploadServices, {
  hapusFileYangSudahTerupload,
  hapusFile,
} from "@/services/uploadservices";

export async function POST(request, { params }) {
  let uploadedFiles = [];
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id, question_id } = params;
    if (!id || !question_id) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const parsedSurveyId = parseInt(id);
    const parsedQuestionId = parseInt(question_id);
    if (isNaN(parsedSurveyId) || isNaN(parsedQuestionId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const formData = await request.formData();
    const foto = formData.get("photo");
    const isUploadExist = isValidFile(foto);

    if (!isUploadExist) {
      return Response.json({ message: "File Tidak Valid." }, { status: 400 });
    }

    const answerRecord = await prisma.armada_survey_answer.findUnique({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });

    if (!answerRecord) {
      return Response.json(
        { error: "Jawaban tidak ditemukan" },
        { status: 404 },
      );
    }

    let resultUpload = await uploadServices(foto, {
      allowedTypes: [...MIME_PRESETS.image],
      maxSize: MAX_FOTO_SIZE,
      folder: PATH_UPLOAD.armada,
    });

    if (!resultUpload.success) {
      return Response.json(
        { message: resultUpload.message, error: "UploadError" },
        { status: 400 },
      );
    }

    uploadedFiles = [resultUpload];

    const updatedAnswer = await prisma.armada_survey_answer.update({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
      data: { photo_url: resultUpload.files[0].filename },
    });

    if (answerRecord?.photo_url)
      await hapusFile(answerRecord?.photo_url, PATH_UPLOAD.armada);

    return Response.json({
      message: "Berhasil mengunggah foto",
      payload: updatedAnswer,
    });
  } catch (error) {
    getLogs("armada").error(error);
    await hapusFileYangSudahTerupload(uploadedFiles);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const auth = await verifyAuth();
    // belum ada blokir authorisasi

    const { id, question_id } = params;
    if (!id || !question_id) {
      return Response.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const parsedSurveyId = parseInt(id);
    const parsedQuestionId = parseInt(question_id);
    if (isNaN(parsedSurveyId) || isNaN(parsedQuestionId)) {
      return Response.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const answerRecord = await prisma.armada_survey_answer.findUnique({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
    });
    if (!answerRecord) {
      return Response.json(
        { error: "Jawaban tidak ditemukan" },
        { status: 404 },
      );
    }

    const updatedAnswer = await prisma.armada_survey_answer.update({
      where: {
        armada_survey_id_question_id: {
          armada_survey_id: parsedSurveyId,
          question_id: parsedQuestionId,
        },
      },
      data: { photo_url: null },
    });

    if (answerRecord?.photo_url)
      await hapusFile(answerRecord?.photo_url, PATH_UPLOAD.armada);

    return Response.json({
      message: "Berhasil menghapus foto",
      payload: updatedAnswer,
    });
  } catch (error) {
    getLogs("armada").error(error);
    return Response.json(
      {
        message: "Terjadi Kesalahan",
        error: error instanceof Error ? error.message : error,
      },
      { status: error.status || 500 },
    );
  }
}
