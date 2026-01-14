import React from "react";
import Link from "next/link";
import { getUIAllFromHeader } from "@/libs/ukpbj-informasi-withsub";
import { PATH_UPLOAD } from "@/configs/appConfig";

async function ContentUkpbjInformasi() {
  const headers = await getUIAllFromHeader();

  return (
    <div className="elementWrap mt-3">
      <div className="row align-items-start">
        <div className="col-xl-12 col-lg-12 col-md-12">
          <div className="d-flex align-items-start flex-column gap-xl-5 gap-4">
            <div className="faqsWraps w-100">
              {/* start  */}
              <div className="faqsCaps">
                <div
                  className="accordion accordion-flush"
                  id="accordionHeaders"
                >
                  {headers.map((header) => (
                    <div className="accordion-item" key={header.id}>
                      <h2 className="accordion-header rounded-2">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-header-${header.id}`}
                          aria-expanded="false"
                          aria-controls={`flush-header-${header.id}`}
                        >
                          {header.label}
                        </button>
                      </h2>

                      <div
                        id={`flush-header-${header.id}`}
                        className="accordion-collapse collapse"
                        // data-bs-parent="#accordionHeaders"
                      >
                        <div className="accordion-body">
                          {/* SUB HEADER */}
                          {header.ukpbj_informasi_header_sub.length ===
                          0 ? null : (
                            <div
                              className="accordion"
                              id={`accordionSub-${header.id}`}
                            >
                              {header.ukpbj_informasi_header_sub.map((sub) => (
                                <div className="accordion-item" key={sub.id}>
                                  <h2 className="accordion-header">
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#flush-sub-${sub.id}`}
                                      aria-expanded="false"
                                      aria-controls={`flush-sub-${sub.id}`}
                                    >
                                      {sub.label}
                                    </button>
                                  </h2>

                                  <div
                                    id={`flush-sub-${sub.id}`}
                                    className="accordion-collapse collapse"
                                    // data-bs-parent={`#accordionSub-${header.id}`}
                                  >
                                    <div className="accordion-body">
                                      {/* SUB SUB */}
                                      {sub.ukpbj_informasi_header_sub_sub
                                        .length === 0 ? null : (
                                        <ol className="list-decimal pl-4 space-y-3">
                                          {sub.ukpbj_informasi_header_sub_sub.map(
                                            (subsub, idx) => (
                                              <li key={subsub.id}>
                                                <div className="font-semibold my-3">
                                                  {subsub.label}
                                                </div>

                                                {/* INFORMASI */}
                                                {subsub.ukpbj_informasi
                                                  .length === 0 ? null : (
                                                  <ul>
                                                    {subsub.ukpbj_informasi.map(
                                                      (info, idx) => (
                                                        <li
                                                          key={info.id}
                                                          className={`d-flex justify-content-between align-items-center py-2 px-2 ${
                                                            idx % 2 === 0
                                                              ? "bg-light"
                                                              : "bg-white"
                                                          }`}
                                                          style={{
                                                            borderRadius: "4px",
                                                          }}
                                                        >
                                                          <span>
                                                            {info.label}{" "}
                                                          </span>
                                                          <span>
                                                            {info?.link ? (
                                                              <Link
                                                                href={
                                                                  info?.link
                                                                }
                                                                target="_blank"
                                                                className="btn btn-sm btn-outline-primary rounded-pill"
                                                              >
                                                                Link
                                                              </Link>
                                                            ) : null}
                                                            {info?.file ? (
                                                              <Link
                                                                href={`/api/services/file/uploads/${PATH_UPLOAD.ukpbj.informasi}/${info?.file}`}
                                                                target="_blank"
                                                                className="btn btn-sm btn-outline-info rounded-pill"
                                                              >
                                                                Download
                                                              </Link>
                                                            ) : null}
                                                          </span>
                                                        </li>
                                                      )
                                                    )}
                                                  </ul>
                                                )}
                                              </li>
                                            )
                                          )}
                                        </ol>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* end  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentUkpbjInformasi;
