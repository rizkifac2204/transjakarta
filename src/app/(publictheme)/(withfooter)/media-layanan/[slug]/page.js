import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { MEDIA_LAYANAN } from "@/components/front/data/data";
import { getHalamanBySlug } from "@/libs/halaman";
import Banner from "@/components/front/Banner";
import ContentSlug from "@/components/front/ContentSlug";
export const revalidate = 86400;

async function MediaLayananPage({ params }) {
  if (!params?.slug) notFound();

  const fullSlug = `/media-layanan/${params.slug}`;

  const isValid = MEDIA_LAYANAN.filter((item) => !item.static).some(
    (item) => item.link === fullSlug
  );
  if (!isValid) notFound();

  const data = await getHalamanBySlug(fullSlug);
  if (!data || !data.isi) notFound();

  const title = data.judul;

  return (
    <>
      <Banner
        label={title}
        maplink={[
          { label: "Home", href: "/" },
          { label: "Media Layanan", href: "/media-layanan" },
          { label: title },
        ]}
      />

      <section>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="secHeading-wrap text-center">
                <h3 className="sectionHeading">{title}</h3>
              </div>
            </div>
          </div>

          <div className="row justify-content-between align-items-center">
            <div className="col-sm-12">
              <Suspense
                fallback={
                  <div className="text-center text-muted">Memuat konten...</div>
                }
              >
                <ContentSlug slug={fullSlug} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MediaLayananPage;
