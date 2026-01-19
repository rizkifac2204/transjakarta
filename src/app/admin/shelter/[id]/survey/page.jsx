import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getShelterSurveyById } from "@/libs/shelter-survey";
import { getQuestionsByShelterType } from "@/libs/shelter-question";
import { notFound } from "next/navigation";

import ShelterProvider from "@/providers/shelter-provider";
import ShelterDetails from "../_Detail";
import ShelterForm from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Survey Halte",
};

async function ShelterSurveyPage({ params }) {
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
        <ShelterForm questions={questions} />
      </ShelterProvider>
    </div>
  );
}

export default ShelterSurveyPage;
