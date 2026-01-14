import BannerLeft from "@/components/front/BannerLeft";
import FormPermohonanPublik from "./_FormPermohonanPublik";
import { getSession } from "@/libs/auth-public";

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
            label: "Permohonan Informasi",
          },
        ]}
      />

      <section className="pt-3">
        <div className="container">
          <div className="row justify-content-between g-4">
            <div className="col-lg-7 col-md-12">
              <div className="contactForm pe-xl-5 pe-lg-4">
                <FormPermohonanPublik session={session} />
              </div>
            </div>
            <div className="col-lg-5 col-md-12">
              <iframe
                className="full-width ht-100 grayscale rounded"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1483542941514!2d106.84448107499053!3d-6.244171593744165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3955399e635%3A0x6089e0108679bc67!2sKEMENTERIAN%20PELINDUNGAN%20PEKERJA%20MIGRAN%20INDONESIA%20%2F%20BP2MI!5e0!3m2!1sid!2sid!4v1751126184945!5m2!1sid!2sid"
                height="500"
                style={{ border: "0" }}
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PublikFormPermohonanInformasi;
