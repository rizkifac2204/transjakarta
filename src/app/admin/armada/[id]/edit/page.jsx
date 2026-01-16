import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaById } from "@/libs/armada";
import { getAllFleetType, getAllServicesType } from "@/libs/armada-services";
import { notFound } from "next/navigation";

import Icons from "@/components/ui/Icon";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ArmadaFormEdit from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Survey Armada",
};

async function ArmadaEdit({ params }) {
  const { id } = params;
  const decodedId = decodeOrNotFound(id);
  const [auth, armada, serviceTypes, fleetTypes] = await Promise.all([
    verifyAuth(),
    getArmadaById(decodedId),
    getAllServicesType(),
    getAllFleetType(),
  ]);

  if (!armada) {
    notFound();
  }

  if (auth.level >= 4 && auth.id !== armada.surveyor_id) {
    notFound();
  }

  return (
    <Card
      title="Edit Survey Armada"
      headerslot={
        <Link className="action-btn" href={`/admin/armada/${id}`}>
          <Icons icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <ArmadaFormEdit
        initialData={armada}
        serviceTypes={serviceTypes}
        fleetTypes={fleetTypes}
      />
    </Card>
  );
}

export default ArmadaEdit;
