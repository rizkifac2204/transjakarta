import { notFound } from "next/navigation";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDip, getDipHeader } from "@/libs/dip";
import TableDip from "./_TableDip";
import HeaderDip from "./_HeaderDip";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "DIP",
};

async function DipPage({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }
  const data = await getDip(String(kategori));
  const headers = await getDipHeader(String(kategori));

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-9/12">
        <TableDip data={Array.isArray(data) ? data : []} kategori={kategori} />
      </div>
      <div className="w-full md:w-3/12">
        <HeaderDip
          data={Array.isArray(headers) ? headers : []}
          kategori={kategori}
        />
      </div>
    </div>
  );
}

export default DipPage;
