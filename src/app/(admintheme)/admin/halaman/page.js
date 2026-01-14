import { getAllHalaman } from "@/libs/halaman";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import TableHalaman from "./_TableHalaman";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Display Website",
};

async function TampilanPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const data = await getAllHalaman();

  return <TableHalaman data={Array.isArray(data) ? data : []} />;
}

export default TampilanPage;
