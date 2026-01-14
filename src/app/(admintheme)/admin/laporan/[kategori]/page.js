import { notFound } from "next/navigation";
import { LAPORAN_KATEGORI } from "@/configs/appConfig";
import { getLaporan, getLaporanHeader } from "@/libs/laporan";
import TableLaporan from "./_TableLaporan";
import HeaderLaporan from "./_HeaderLaporan";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Laporan",
};

async function LaporanPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!LAPORAN_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getLaporan(String(kategori));
  const headers = await getLaporanHeader(String(kategori));

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-9/12">
        <TableLaporan
          data={Array.isArray(data) ? data : []}
          kategori={kategori}
        />
      </div>
      <div className="w-full md:w-3/12">
        <HeaderLaporan
          data={Array.isArray(headers) ? headers : []}
          kategori={kategori}
        />
      </div>
    </div>
  );
}

export default LaporanPage;
