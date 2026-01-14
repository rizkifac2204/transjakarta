import Banner from "@/components/front/Banner";
import DipList from "@/components/front/DipList";
import { SEPUTAR_PPID } from "@/components/front/data/data";

async function SeputarPPIDPublikPage() {
  const blocks = SEPUTAR_PPID.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <>
      <Banner
        label="Seputar PPID"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Seputar PPID",
            href: "/seputar-ppid",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Seputar <span className="text-primary">PPID</span>
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

export default SeputarPPIDPublikPage;
