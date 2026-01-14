import React from "react";
import { getPemohon } from "@/libs/pemohon";
import TablePemohon from "./_TablePemohon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pemohon",
};

async function PemohonPage() {
  const data = await getPemohon();

  return <TablePemohon data={Array.isArray(data) ? data : []} />;
}

export default PemohonPage;
