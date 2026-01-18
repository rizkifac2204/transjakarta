import { getAllFleetType, getAllServicesType } from "@/libs/armada-services";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";

import ArmadaFormAdd from "@/app/admin/armada/add/_Form";

export const dynamic = "force-dynamic";

const ArmadaAddModal = async () => {
  const [serviceTypes, fleetTypes] = await Promise.all([
    getAllServicesType(),
    getAllFleetType(),
  ]);

  return (
    <Modal>
      <Card title={`SURVEY ARMADA`}>
        <ArmadaFormAdd serviceTypes={serviceTypes} fleetTypes={fleetTypes} />
      </Card>
    </Modal>
  );
};

export default ArmadaAddModal;
