import Card from "@/components/ui/Card";
import ContentPermohonanTerbaru from "./_ContentPermohonanTerbaru";
import { getPermohonanTerbaru } from "@/libs/dashboard/getPermohonanTerbaru";

async function PermohonanTerbaru() {
  const data = await getPermohonanTerbaru();

  return (
    <Card title="Permohonan Terbaru">
      <ContentPermohonanTerbaru data={data} />
    </Card>
  );
}

export default PermohonanTerbaru;
