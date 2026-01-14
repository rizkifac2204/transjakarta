import { getProfile } from "@/libs/profile";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FormEditProfile from "./_FormEditProfile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Profile",
};

async function ProfileEdit() {
  const profile = await getProfile();
  if (!profile) notFound();

  return (
    <Card title="FORMULIR EDIT DATA PROFILE" noborder={false}>
      <FormEditProfile profile={profile} />
    </Card>
  );
}

export default ProfileEdit;
