import React from "react";
import { verifyAuth } from "@/libs/jwt";
import { canManage } from "@/utils/manage";
import { getAdmin } from "@/libs/user";
import ContenUser from "./_Content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengguna Aplikasi",
};

async function UserPage() {
  const auth = await verifyAuth();
  const admins = await getAdmin();
  const modifiedData = admins?.map((admin) => {
    return {
      ...admin,
      isManage: canManage(admin.level_id, auth.level),
    };
  });

  return <ContenUser data={modifiedData} />;
}

export default UserPage;
