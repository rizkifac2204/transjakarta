import Card from "@/components/ui/Card";
import FormEditPassword from "./_FormEditPassword";

export const metadata = {
  title: "Edit Password",
};

function ProfilePassword() {
  return (
    <Card title="FORMULIR EDIT PASSWORD PROFILE" noborder={false}>
      <FormEditPassword />
    </Card>
  );
}

export default ProfilePassword;
