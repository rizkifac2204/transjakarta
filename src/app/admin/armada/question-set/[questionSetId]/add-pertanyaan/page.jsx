import { verifyAuth } from "@/libs/jwt";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { getArmadaQuestionSetById } from "@/libs/armada-question-set";
import { notFound } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

import QuestionForm from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tambah Pertanyaan",
};

const QuestionSetAddPage = async ({ params }) => {
  const auth = await verifyAuth();
  if (auth.level > 3) notFound();

  const id = decodeOrNotFound(params.questionSetId);
  const set = await getArmadaQuestionSetById(id);

  return (
    <Card
      title={`FORMULIR TAMBAH PERTANYAAN`}
      subtitle={
        <>
          <span>{set.service_types.map((st) => st.name).join(", ")}</span>
          <br />
          <span>{set.fleet_types.map((st) => st.name).join(", ")}</span>
        </>
      }
      noborder={false}
      headerslot={
        <Link
          className="action-btn"
          href={`/admin/armada/question-set/${encodeId(set.id)}`}
        >
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <QuestionForm set={set} />
    </Card>
  );
};

export default QuestionSetAddPage;
