import { getPermohonanDanKeberatanPerbulan } from "@/libs/dashboard/getPermohonanPerbulan";
import Card from "@/components/ui/Card";
import ContentDataPerbulan from "./_ContentDataPerbulan";

async function DataPerbulan() {
  const data = await getPermohonanDanKeberatanPerbulan();

  return (
    <Card>
      <ContentDataPerbulan data={data} />
    </Card>
  );
}

export default DataPerbulan;
