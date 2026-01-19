import { verifyAuth } from "@/libs/jwt";
import { getAllShelterSurvey } from "@/libs/shelter-survey";

import ShelterTable from "./_Table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Survey Halte",
};

async function ShelterPage() {
  const auth = await verifyAuth();

  const where = {};
  if (auth.level > 3) {
    where.surveyor_id = auth.id;
  }

  const shelters = await getAllShelterSurvey({ where: where });
  const modifiedShelters = shelters.map((item) => ({
    ...item,
    isManage: auth.level < 3 || auth.id === item.surveyor_id,
  }));

  return <ShelterTable initialData={modifiedShelters} />;
}

export default ShelterPage;
