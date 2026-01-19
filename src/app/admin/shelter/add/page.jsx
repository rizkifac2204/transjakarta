import { getAllShelterTypes } from "@/libs/shelter-type";
import Card from "@/components/ui/Card";
import ShelterFormAdd from "./_Form";

export const metadata = {
  title: "Halte Survey - Tambah Data",
};

async function ShelterAddPage() {
  const shelterTypes = await getAllShelterTypes();

  return (
    <Card title={`SURVEY HALTE`}>
      <ShelterFormAdd shelterTypes={shelterTypes} />
    </Card>
  );
}

export default ShelterAddPage;
