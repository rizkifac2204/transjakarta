import { Suspense } from "react";
import BannerLeft from "@/components/front/BannerLeft";
import Content from "./_Content";
import LoadingPublik from "@/components/front/Loading";
export const revalidate = 86400;

function PublikUkpbjRegulasi() {
  return (
    <>
      <BannerLeft
        label="Regulasi UKPBJ"
        maplink={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "UKPBJ",
            href: "/ukpbj",
          },
          {
            label: "Regulasi",
            href: "/ukpbj/regulasi",
          },
        ]}
      />

      <section className="pt-1">
        <div className="container">
          <Suspense fallback={<LoadingPublik />}>
            <Content />
          </Suspense>
        </div>
      </section>
    </>
  );
}

export default PublikUkpbjRegulasi;
