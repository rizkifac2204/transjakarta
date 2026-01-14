import { Suspense } from "react";
import BannerLeft from "@/components/front/BannerLeft";
import Content from "./_Content";
import LoadingPublik from "@/components/front/Loading";
export const revalidate = 86400;

function PublikUkpbjInformasi() {
  return (
    <>
      <BannerLeft
        label="Informasi PBJ"
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
            label: "Informasi PBJ",
            href: "/ukpbj/informasi-pbj",
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

export default PublikUkpbjInformasi;
