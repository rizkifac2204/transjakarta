import React, { Fragment } from "react";
import Link from "next/link";
import { getPeraturanHeaderPlusData } from "@/libs/peraturan";
import { PATH_UPLOAD } from "@/configs/appConfig";

async function ContentPangaturan() {
  const data = await getPeraturanHeaderPlusData();
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
                  {item?.peraturan?.length ? (
                    item?.peraturan?.map((peraturan, i) => (
                      <tr key={i}>
                        <td>{peraturan?.label || "-"}</td>

                        <td>
                          {peraturan?.link ? (
                            <Link
                              href={peraturan?.link}
                              target="_blank"
                              className="btn btn-sm btn-outline-primary rounded-pill"
                            >
                              Lihat
                            </Link>
                          ) : null}
                          {peraturan?.file ? (
                            <Link
                              href={`/api/services/file/uploads/${PATH_UPLOAD.peraturan}/${peraturan?.file}`}
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
        <div className="alert alert-info">Data Peraturan Belum Tersedia</div>
      )}
    </div>
  );
}

export default ContentPangaturan;
