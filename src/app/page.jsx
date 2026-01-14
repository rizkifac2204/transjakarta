import { redirect } from "next/navigation";

function Page() {
  redirect("/login");
  return null;
}

export default Page;
