import React from "react";
import { verifyAuth } from "@/libs/jwt";
import { getAllUser } from "@/libs/user";
import ContenUser from "./_Content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengguna Aplikasi",
};

async function UserPage() {
  const auth = await verifyAuth();
  const users = await getAllUser();
  const modifiedData = users?.map((user) => {
    return {
      ...user,
      isManage: auth.level < user.level_id,
    };
  });

  return <ContenUser data={modifiedData} />;
}

export default UserPage;
