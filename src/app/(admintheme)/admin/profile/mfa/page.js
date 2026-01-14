import { getProfile } from "@/libs/profile";
import { notFound } from "next/navigation";
import { getOrCreateMfaSecret } from "@/libs/mfa";
import { redirect } from "next/navigation";
import appConfig from "@/configs/appConfig";

import Card from "@/components/ui/Card";
import ProfileMfaContent from "./_Content";

export const metadata = {
  title: "Profile MFA",
};
export const dynamic = "force-dynamic";

async function ProfileMfaPage() {
  const profile = await getProfile();
  if (!profile) notFound();

  if (profile.mfa_enabled) {
    redirect("/admin/profile");
  }

  const secret = await getOrCreateMfaSecret(profile, appConfig.app.name);

  return (
    <Card title="AKTIVASI Multi-Factor Authentication (MFA)">
      <ProfileMfaContent secret={secret} />
    </Card>
  );
}

export default ProfileMfaPage;
