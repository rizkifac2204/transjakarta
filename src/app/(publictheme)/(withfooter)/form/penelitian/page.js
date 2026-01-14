import BannerLeft from "@/components/front/BannerLeft";
import FormPenelitianPublik from "./_FormPenelitianPublik";
import { getSession } from "@/libs/auth-public";
import Image from "next/image";

async function PublikFormPermohonanInformasi() {
  const session = await getSession();

  return (
    <>
      <BannerLeft
        label="Formulir"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Permohonan Penelitian",
          },
        ]}
      />

      <section className="pt-3">
        <div className="container">
          <div className="row justify-content-between g-4">
            <div className="col-lg-7 col-md-12">
              <div className="contactForm pe-xl-5 pe-lg-4">
                <FormPenelitianPublik session={session} />
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <Image
                src="/front/alur-wawancara.jpeg"
                className="img-fluid"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt="logo"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PublikFormPermohonanInformasi;
