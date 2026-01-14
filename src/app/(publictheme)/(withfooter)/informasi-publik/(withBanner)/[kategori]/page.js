import { PATH_UPLOAD } from "@/configs/appConfig";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DIP_KATEGORI } from "@/configs/appConfig";
import { getDipHeaderPlusData } from "@/libs/dip";
export const revalidate = 86400;

async function PublikDip({ params }) {
  const { kategori } = await params;
  if (!kategori) {
    notFound();
  }
  if (!DIP_KATEGORI.includes(kategori)) {
    notFound();
  }

  const data = await getDipHeaderPlusData(kategori);

  return (
    <section className="pt-3">
      <div className="container">
        <div className="elementWrap">
          <div className="elementWrap">
            {data?.length ? (
              data?.map((item, index) => (
                <div key={index} className="mb-5">
                  <div className="elementTitle mb-6">
                    <h4 className="fw-medium mb-1">{item?.label}</h4>
                  </div>
                  <div className="elementContent">
                    {item.dip?.length ? (
                      <div className="row px-4">
                        {item.dip.map((item, i) => (
                          <div
                            key={i}
                            className="col-12 border-bottom border-top d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2"
                          >
                            <div>
                              {i + 1}. {item?.label}
                            </div>
                            <div className="d-flex flex-wrap gap-2 p-2">
                              {item?.link && (
                                <Link
                                  href={item.link}
                                  target="_blank"
                                  className="btn btn-sm btn-outline-primary rounded-pill"
                                >
                                  Lihat
                                </Link>
                              )}
                              {item?.file && (
                                <Link
                                  href={`/api/services/file/uploads/${PATH_UPLOAD.dip[kategori]}/${item.file}`}
                                  target="_blank"
                                  className="btn btn-sm btn-outline-info rounded-pill"
                                >
                                  File
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted fst-italic">
                        Belum Tersedia
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info">Data Belum Tersedia</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublikDip;
