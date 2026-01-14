import Banner from "@/components/front/Banner";
import LaporanList from "@/components/front/LaporanList";
import { countLaporanGroupedByKategori } from "@/libs/laporan";
import { LAPORAN } from "@/components/front/data/data";

async function LaporanPublikPage() {
  const data = await countLaporanGroupedByKategori();

  const countMap = data.reduce((acc, item) => {
    acc[item.kategori] = item._count._all;
    return acc;
  }, {});

  const blocks = LAPORAN.map((item) => {
    if (item.kategori) {
      return {
        ...item,
        count: countMap[item.kategori] || 0,
      };
    }
    return item;
  });

  return (
    <>
      <Banner
        label="Laporan"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Laporan",
            href: "/laporan",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Daftar <span className="text-primary">Laporan</span>
                </h3>
              </div>
            </div>
          </div>
          <LaporanList blocks={blocks} />
        </div>
      </section>
    </>
  );
}

export default LaporanPublikPage;
