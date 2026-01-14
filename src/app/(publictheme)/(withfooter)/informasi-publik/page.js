import Banner from "@/components/front/Banner";
import DipList from "@/components/front/DipList";
import { countDipGroupedByKategori } from "@/libs/dip";
import { INFORMASI_PUBLIK } from "@/components/front/data/data";

async function InformasiPublikPage() {
  const data = await countDipGroupedByKategori();

  const countMap = data.reduce((acc, item) => {
    acc[item.kategori] = item._count._all;
    return acc;
  }, {});

  const blocks = INFORMASI_PUBLIK.map((item) => {
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
        label="Daftar Informasi Publik"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Daftar Informasi Publik",
            href: "/informasi-publik",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Daftar Informasi <span className="text-primary">Publik</span>
                </h3>
              </div>
            </div>
          </div>
          <DipList blocks={blocks} />
        </div>
      </section>
    </>
  );
}

export default InformasiPublikPage;
