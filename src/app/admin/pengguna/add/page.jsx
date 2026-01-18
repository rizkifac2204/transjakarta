import Card from "@/components/ui/Card";
import { getLevel } from "@/libs/level";
import { verifyAuth } from "@/libs/jwt";
import { notFound } from "next/navigation";
import FormAddPengguna from "./_FormAddPengguna";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tambah Pengguna",
};

async function UserAddPage() {
  const auth = await verifyAuth();
  if (auth?.level > 3) notFound();
  const level = await getLevel();
  const filteredLevel = level?.filter((item) => item.id > auth.level);

  return (
    <Card title="FORMULIR TAMBAH DATA PENGGUNA" noborder={false}>
      <FormAddPengguna level={filteredLevel} />
    </Card>
  );
}

export default UserAddPage;
