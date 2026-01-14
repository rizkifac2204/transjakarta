import React, { Suspense } from "react";
import { decodeId } from "@/libs/hash/hashId";
import { getTestimoni } from "@/libs/testimoni";
import TableTestimoni from "./_TableTestimoni";
import BannerInfoKondisiData from "./_BannerInfoKondisiData";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Testimoni Pemohon",
};

async function TestimoniPage({ searchParams }) {
  const permohonan = decodeId((await searchParams).permohonan);
  const penelitian = decodeId((await searchParams).penelitian);

  const data = await getTestimoni(null, permohonan, penelitian);

  return (
    <>
      <Suspense fallback="Memuat Info Kondisi...">
        <BannerInfoKondisiData
          permohonan={permohonan}
          penelitian={penelitian}
        />
      </Suspense>
      <TableTestimoni data={Array.isArray(data) ? data : []} />
    </>
  );
}

export default TestimoniPage;
