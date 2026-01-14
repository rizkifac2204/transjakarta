import Banner from "@/components/front/Banner";
import DipList from "@/components/front/DipList";
import { LINK_FORM } from "@/components/front/data/data";

async function FormPublikPage() {
  const blocks = LINK_FORM.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <>
      <Banner
        label="Formulir"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Formulir",
            href: "/form",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Formulir{" "}
                  <span className="text-primary">Permohonan dan Pengajuan</span>
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

export default FormPublikPage;
