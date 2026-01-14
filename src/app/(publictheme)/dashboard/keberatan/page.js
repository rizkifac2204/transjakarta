import React from "react";
import { publicGetKeberatan } from "@/libs/publik/keberatan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatedDate } from "@/utils/formatDate";
import { encodeId } from "@/libs/hash/hashId";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Riwayat Keberatan",
};

async function DashboardPublikKeberatanPage() {
  const data = await publicGetKeberatan();

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Riwayat Keberatan</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="card rounded-3 shadow-sm">
          <div className="card-header px-4 py-3">
            <h4 className="m-0">List Keberatan</h4>
          </div>
          <div className="card-body p-0">
            <div className="card-body p-3">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">No. Registrasi</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Alasan</th>
                    <th scope="col">Tujuan</th>
                    <th scope="col"></th>
                  </tr>
                </thead>

                <tbody>
                  {data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted">
                        <i>Data Tidak Ditemukan</i>
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id}>
                        <td data-label="Registrasi">
                          {item?.no_regis || (
                            <i className="text-muted">Belum Diregistrasi</i>
                          )}
                        </td>
                        <td data-label="Tanggal">
                          {formatedDate(item?.tanggal, true)}
                        </td>
                        <td data-label="Alasan">{item?.alasan || "-"}</td>
                        <td data-label="Tujuan">{item?.tujuan || "-"}</td>
                        <td data-label="">
                          <Link
                            href={`/dashboard/keberatan/${encodeId(item?.id)}`}
                            className="btn btn-sm btn-light-success fw-medium rounded-pill"
                          >
                            Rincian
                            <Icon
                              icon="solar:alt-arrow-right-bold-duotone"
                              width="24"
                              height="24"
                            />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPublikKeberatanPage;
