import Banner from "@/components/front/Banner";
import DipList from "@/components/front/DipList";
import { MEDIA_LAYANAN } from "@/components/front/data/data";

async function MediaLayananPublikPage() {
  const blocks = MEDIA_LAYANAN.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <>
      <Banner
        label="Media Layanan"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Media Layanan",
            href: "/media-layanan",
          },
        ]}
      />

      <section className="pt-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">
                  Media <span className="text-primary">Layanan</span>
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

export default MediaLayananPublikPage;
