import { verifyAuth } from "@/libs/jwt";
import { getAllArmada } from "@/libs/armada";

import ArmadaTable from "./_Table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Survey Armada",
};

async function ArmadaPage() {
  const auth = await verifyAuth();

  const where = {};
  if (auth.level > 3) {
    where.surveyor_id = auth.id;
  }

  const armadas = await getAllArmada({ where: where });
  const modifuedArmadas = armadas.map((item) => ({
    ...item,
    isManage: auth.level < 3 || auth.id === item.surveyor_id,
  }));

  return <ArmadaTable initialData={modifuedArmadas} />;
}

export default ArmadaPage;
