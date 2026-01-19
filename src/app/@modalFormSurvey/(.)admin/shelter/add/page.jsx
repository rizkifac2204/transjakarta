import { getAllShelterTypes } from "@/libs/shelter-type";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";

import ShelterFormAdd from "@/app/admin/shelter/add/_Form";

export const dynamic = "force-dynamic";

const ShelterAddModal = async () => {
  const shelterTypes = await getAllShelterTypes();

  return (
    <Modal>
      <Card title={`SURVEY HALTE`}>
        <ShelterFormAdd shelterTypes={shelterTypes} />
      </Card>
    </Modal>
  );
};

export default ShelterAddModal;
