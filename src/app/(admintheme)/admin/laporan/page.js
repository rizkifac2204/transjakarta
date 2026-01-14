import { redirect } from "next/navigation";

function LaporanPage() {
  redirect(`/admin/laporan/akses-informasi-publik`);

  return null;
}

export default LaporanPage;
