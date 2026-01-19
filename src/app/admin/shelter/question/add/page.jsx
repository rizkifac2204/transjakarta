import { verifyAuth } from "@/libs/jwt";
import { getAllShelterTypes } from "@/libs/shelter-type";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

import QuestionForm from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tambah Pertanyaan",
};

const QuestionShelterAddPage = async () => {
  const [auth, types] = await Promise.all([verifyAuth(), getAllShelterTypes()]);
  if (auth.level > 3) notFound();

  return (
    <Card
      title={`FORMULIR TAMBAH PERTANYAAN`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/shelter/question`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <QuestionForm types={types} />
    </Card>
  );
};

export default QuestionShelterAddPage;
