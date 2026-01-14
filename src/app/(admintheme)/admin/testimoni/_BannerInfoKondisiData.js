import React from "react";
import Alert from "@/components/ui/Alert";
import { getPenelitianDetailById } from "@/libs/penelitian";
import { getPermohonanDetailById } from "@/libs/permohonan";
import { encodeId } from "@/libs/hash/hashId";
import Link from "next/link";

async function BannerInfoKondisiData({ permohonan, penelitian }) {
  let data = null;
  const label = permohonan
    ? "Permohonan Informasi"
    : penelitian
    ? "Penelitian"
    : null;

  if (permohonan) {
    data = await getPermohonanDetailById(permohonan);
  } else if (penelitian) {
    data = await getPenelitianDetailById(penelitian);
  }

  const link = permohonan
    ? `/admin/permohonan/${encodeId(data?.id)}`
    : penelitian
    ? `/admin/penelitian/${encodeId(data?.id)}`
    : null;

  if (!permohonan && !penelitian) return null;

  return (
    <>
      <Alert
        dismissible
        replaceWhenDismis
        icon="heroicons-outline:information-circle"
        className="alert-outline-warning mb-3"
      >
        {data ? (
          <>
            List Testimoni {label}{" "}
            <Link href={link}>
              <strong>{data?.tiket}</strong>
            </Link>
          </>
        ) : (
          "Data tidak ditemukan"
        )}
      </Alert>
    </>
  );
}

export default BannerInfoKondisiData;
