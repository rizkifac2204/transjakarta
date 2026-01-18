import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditPassword from "../../password/_FormEditPassword";

function ProfilePasswordModal() {
  return (
    <Modal>
      <Card title="FORMULIR EDIT PASSWORD PROFILE">
        <FormEditPassword />
      </Card>
    </Modal>
  );
}

export default ProfilePasswordModal;
