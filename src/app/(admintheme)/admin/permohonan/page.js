import React, { Suspense } from "react";
import { getPermohonanDynamic } from "@/libs/permohonan";
import TablePermohonan from "./_TablePermohonan";
import BannerInfoKondisiData from "./_BannerInfoKondisiData";
import { decodeId } from "@/libs/hash/hashId";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Permohonan Informasi",
};

async function PermohonanPage({ searchParams }) {
  const q = (await searchParams).q;
  const unregister = (await searchParams).unregister;
  const decodedAdminId = q ? decodeId(q) : null;

  const where = {
    ...(decodedAdminId && { admin_id: decodedAdminId }),
    ...(unregister && { no_regis: null }),
  };

  const data = await getPermohonanDynamic({
    where,
    include: {
      admin: { select: { id: true, nama: true } },
      _count: { select: { jawaban: true } },
    },
  });
  return (
    <>
      <Suspense fallback="Memuat Info Kondisi...">
        <BannerInfoKondisiData
          section="Permohonan Informasi"
          admin_id={decodedAdminId}
          unregister={unregister}
        />
      </Suspense>
      <TablePermohonan data={Array.isArray(data) ? data : []} />
    </>
  );
}

export default PermohonanPage;
