import React, { Fragment } from "react";
import Link from "next/link";
import { getUkpbjRegulasiHeaderPlusData } from "@/libs/ukpbj-regulasi";
import { PATH_UPLOAD } from "@/configs/appConfig";

async function ContentUkpbjRegulasi() {
  const data = await getUkpbjRegulasiHeaderPlusData();
  return (
    <div className="elementWrap mt-3">
      {data?.length ? (
        data?.map((item, index) => (
          <div className="mb-5 shadow-sm" key={index}>
            <div className="elementTitle">
              <h4 className="fw-medium">{item?.label}</h4>
            </div>
            <div className="elementContent">
              <table className="table table-striped">
                <tbody>
                  {item?.ukpbj_regulasi?.length ? (
                    item?.ukpbj_regulasi?.map((regulasi, i) => (
                      <tr key={i}>
                        <td>{regulasi?.label || "-"}</td>

                        <td>
                          {regulasi?.link ? (
                            <Link
                              href={regulasi?.link}
                              target="_blank"
                              className="btn btn-sm btn-outline-primary rounded-pill"
                            >
                              Lihat
                            </Link>
                          ) : null}
                          {regulasi?.file ? (
                            <Link
                              href={`/api/services/file/uploads/${PATH_UPLOAD.ukpbj.regulasi}/${regulasi?.file}`}
                              target="_blank"
                              className="btn btn-sm btn-outline-info rounded-pill"
                            >
                              File
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>
                        <div className="alert alert-info">Belum Tersedia</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-info">Data Regulasi Belum Tersedia</div>
      )}
    </div>
  );
}

export default ContentUkpbjRegulasi;
