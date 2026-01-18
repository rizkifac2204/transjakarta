import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaById } from "@/libs/armada";
import { notFound } from "next/navigation";

import ArmadaProvider from "@/providers/armada-provider";
import ArmadaDetails from "./_Detail";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Detail Survey Armada",
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

  const modifiedArmada = {
    ...armada,
    isManage: auth.level < 4 || auth.id === armada.surveyor_id,
  };

  return (
    <div className="space-y-5">
      <ArmadaProvider initialValue={modifiedArmada}>
        <ArmadaDetails />
      </ArmadaProvider>
    </div>
  );
}

export default ArmadaDetail;
