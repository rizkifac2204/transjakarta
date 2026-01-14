import Banner from "@/components/front/Banner";
import DipList from "@/components/front/DipList";
import { UKPBJ } from "@/components/front/data/data";

async function UkpbjPublikPage() {
  const blocks = UKPBJ.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <>
      <Banner
        label="Unit Kerja Pengadaan Barang/Jasa"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Unit Kerja Pengadaan Barang/Jasa",
            href: "/ukpbj",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Unit Kerja Pengadaan{" "}
                  <span className="text-primary">Barang/Jasa</span>
                </h3>
              </div>
            </div>
          </div>
          <DipList blocks={blocks} noCount={true} />
        </div>
      </section>
    </>
  );
}

export default UkpbjPublikPage;
