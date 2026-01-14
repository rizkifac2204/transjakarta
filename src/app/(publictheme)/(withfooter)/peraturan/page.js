import { Suspense } from "react";
import BannerLeft from "@/components/front/BannerLeft";
import ContentPangaturan from "./_Content";
import LoadingPublik from "@/components/front/Loading";
export const revalidate = 86400;

function PublikPeraturan() {
  return (
    <>
      <BannerLeft
        label="Regulasi"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Peraturan",
            href: "/peraturan",
          },
        ]}
      />

      <section className="pt-1">
        <div className="container">
          <Suspense fallback={<LoadingPublik />}>
            <ContentPangaturan />
          </Suspense>
        </div>
      </section>
    </>
  );
}

export default PublikPeraturan;
