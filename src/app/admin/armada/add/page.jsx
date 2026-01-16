import { getAllFleetType, getAllServicesType } from "@/libs/armada-services";
import Card from "@/components/ui/Card";
import ArmadaFormAdd from "./_Form";

export const metadata = {
  title: "Armada Survey - Tambah Data",
};

async function ArmadaAddPage() {
  const [serviceTypes, fleetTypes] = await Promise.all([
    getAllServicesType(),
    getAllFleetType(),
  ]);

  return (
    <Card title="Survey Armada">
      <ArmadaFormAdd serviceTypes={serviceTypes} fleetTypes={fleetTypes} />
    </Card>
  );
}

export default ArmadaAddPage;
