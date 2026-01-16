import { verifyAuth } from "@/libs/jwt";
import { getAllArmada } from "@/libs/armada";

import ArmadaTable from "./_Table";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Survey Armada",
};

async function ArmadaPage() {
  const [auth, armadas] = await Promise.all([verifyAuth(), getAllArmada()]);

  const modifuedArmadas = armadas.map((item) => ({
    ...item,
    isManage: auth.level < 3 || auth.id === item.surveyor_id,
  }));

  return (
    <div>
      <ArmadaTable initialData={modifuedArmadas} />
    </div>
  );
}

export default ArmadaPage;
