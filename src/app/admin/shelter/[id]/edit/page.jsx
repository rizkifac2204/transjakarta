import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getShelterSurveyById } from "@/libs/shelter-survey";
import { getAllShelterTypes } from "@/libs/shelter-type";
import { notFound } from "next/navigation";

import Icons from "@/components/ui/Icon";
import Link from "next/link";
import Card from "@/components/ui/Card";
import ShelterFormEdit from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit Survey Halte",
};

async function ShelterEditPage({ params }) {
  const { id } = params;
  const decodedId = decodeOrNotFound(id);
  const [auth, shelter, shelterTypes] = await Promise.all([
    verifyAuth(),
    getShelterSurveyById(decodedId),
    getAllShelterTypes(),
  ]);

  if (!shelter) {
    notFound();
  }

  if (auth.level >= 4 && auth.id !== shelter.surveyor_id) {
    notFound();
  }

  return (
    <Card
      title="Edit Survey Halte"
      headerslot={
        <Link className="action-btn" href={`/admin/shelter/${id}`}>
          <Icons icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <ShelterFormEdit initialData={shelter} shelterTypes={shelterTypes} />
    </Card>
  );
}

export default ShelterEditPage;
