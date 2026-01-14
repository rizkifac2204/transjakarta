import React from "react";
import { getAdminDetailByIdOnly } from "@/libs/admin";
import Alert from "@/components/ui/Alert";
import Link from "next/link";
import { encodeId } from "@/libs/hash/hashId";

async function BannerInfoKondisiData({ admin_id, unregister, section }) {
  let admin = null;
  if (admin_id) {
    admin = await getAdminDetailByIdOnly(admin_id);
  }
  if (!admin_id && !unregister) return null;
  return (
    <>
      <Alert
        dismissible
        replaceWhenDismis
        icon="heroicons-outline:information-circle"
        className="alert-outline-warning mb-3"
      >
        {admin ? (
          <>
            List Data {section} yang di tangani oleh{" "}
            <Link href={`/admin/pengguna/${encodeId(admin?.id)}`}>
              <strong>{admin?.nama}</strong>
            </Link>
          </>
        ) : null}
        {unregister ? "Data Belum Diregistrasi" : null}
      </Alert>
    </>
  );
}

export default BannerInfoKondisiData;
