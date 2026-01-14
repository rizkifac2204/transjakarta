import React, { Suspense } from "react";
import { getPenelitianDynamic } from "@/libs/penelitian";
import { decodeId } from "@/libs/hash/hashId";
import TablePenelitian from "./_TablePenelitian";
import BannerInfoKondisiData from "../permohonan/_BannerInfoKondisiData";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Penelitian",
};

async function PenelitianPage({ searchParams }) {
  const q = (await searchParams).q;
  const unregister = (await searchParams).unregister;
  const decodedAdminId = q ? decodeId(q) : null;

  const where = {
    ...(decodedAdminId && { admin_id: decodedAdminId }),
    ...(unregister && { no_regis: null }),
  };

  const data = await getPenelitianDynamic({
    where,
    include: {
      admin: { select: { id: true, nama: true } },
      _count: { select: { jawaban_penelitian: true } },
    },
  });
  return (
    <>
      <Suspense fallback="Memuat Info Kondisi...">
        <BannerInfoKondisiData
          section="Penelitian"
          admin_id={decodedAdminId}
          unregister={unregister}
        />
      </Suspense>
      <TablePenelitian data={Array.isArray(data) ? data : []} />
    </>
  );
}

export default PenelitianPage;
