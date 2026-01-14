import React, { Suspense } from "react";
import { getKeberatanDynamic } from "@/libs/keberatan";
import { decodeId } from "@/libs/hash/hashId";
import TableKeberatan from "./_TableKeberatan";
import BannerInfoKondisiData from "../permohonan/_BannerInfoKondisiData";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Keberatan",
};

async function KeberatanPage({ searchParams }) {
  const q = (await searchParams).q;
  const decodedAdminId = q ? decodeId(q) : null;
  const data = await getKeberatanDynamic({
    where: decodedAdminId ? { admin_id: decodedAdminId } : {},
    include: {
      admin: { select: { id: true, nama: true } },
    },
  });
  return (
    <>
      <Suspense fallback="Memuat Info Kondisi...">
        <BannerInfoKondisiData section="Keberatan" admin_id={decodedAdminId} />
      </Suspense>
      <TableKeberatan data={Array.isArray(data) ? data : []} />
    </>
  );
}

export default KeberatanPage;
