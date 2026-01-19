import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getShelterSurveyById } from "@/libs/shelter-survey";
import { notFound } from "next/navigation";
import { getQuestionsByShelterType } from "@/libs/shelter-question";

import ShelterProvider from "@/providers/shelter-provider";
import ShelterDetails from "./_Detail";
import SectionQuestions from "./_SectionQuestions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Detail Survey Halte",
};

async function ShelterDetail({ params }) {
  const { id } = params;
  const decodedId = decodeOrNotFound(id);
  const [auth, shelter] = await Promise.all([
    verifyAuth(),
    getShelterSurveyById(decodedId),
  ]);

  if (!shelter) {
    notFound();
  }

  const questions = await getQuestionsByShelterType(shelter.shelter_type_id);

  const modifiedShelter = {
    ...shelter,
    isManage: auth.level < 4 || auth.id === shelter.surveyor_id,
  };

  return (
    <div className="space-y-5">
      <ShelterProvider initialValue={modifiedShelter}>
        <ShelterDetails />
        <SectionQuestions questions={questions} />
      </ShelterProvider>
    </div>
  );
}

export default ShelterDetail;
