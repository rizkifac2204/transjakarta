import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaById } from "@/libs/armada";
import { notFound } from "next/navigation";
import { getQuestionsBySurvey } from "@/libs/armada-question";

import ArmadaDetails from "../_Detail";
import ArmadaForm from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Survey Armada",
};

async function ArmadaDetail({ params }) {
  const { id } = params;
  const decodedId = decodeOrNotFound(id);
  const [auth, armada] = await Promise.all([
    verifyAuth(),
    getArmadaById(decodedId),
  ]);

  if (!armada) {
    notFound();
  }

  const questions = await getQuestionsBySurvey(
    armada.service_type_id,
    armada.fleet_type_id,
  );

  const modifiedArmada = {
    ...armada,
    isManage: auth.level < 4 || auth.id === armada.surveyor_id,
  };

  return (
    <div className="space-y-5">
      <ArmadaDetails initialData={modifiedArmada} />
      <ArmadaForm initialData={modifiedArmada} questions={questions} />
    </div>
  );
}

export default ArmadaDetail;
