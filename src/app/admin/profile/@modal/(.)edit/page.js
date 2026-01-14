import { getProfile } from "@/libs/profile";
import { notFound } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import FormEditProfile from "../../edit/_FormEditProfile";

export const dynamic = "force-dynamic";

async function ProfileEditModal() {
  const profile = await getProfile();
  if (!profile) notFound();

  return (
    <Modal>
      <Card title="FORMULIR EDIT DATA PROFILE">
        <FormEditProfile profile={profile} />
      </Card>
    </Modal>
  );
}

export default ProfileEditModal;
