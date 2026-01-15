import { verifyAuth } from "@/libs/jwt";
import { getAllFleetType, getAllServicesType } from "@/libs/armada-services";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

import QuestionSetForm from "./_Form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tambah Set Pertanyaan",
};

const QuestionSetAddPage = async () => {
  const auth = await verifyAuth();
  if (auth.level > 3) notFound();

  const [serviceTypes, fleetTypes] = await Promise.all([
    getAllServicesType(),
    getAllFleetType(),
  ]);

  return (
    <Card
      title={`FORMULIR TAMBAH SET PERTANYAAN`}
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/armada/question-set`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <QuestionSetForm serviceTypes={serviceTypes} fleetTypes={fleetTypes} />
    </Card>
  );
};

export default QuestionSetAddPage;
