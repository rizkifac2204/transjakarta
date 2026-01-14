import React from "react";
import { publicGetPermohonan } from "@/libs/publik/permohonan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatedDate } from "@/utils/formatDate";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Riwayat Permohonan Informasi",
};

function getJenisColor(jenis) {
  switch (jenis) {
    case "Proses":
      return "bg-info";
    case "Diberikan":
      return "bg-success";
    case "Diberikan Sebagian":
      return "bg-warning";
    default:
      return "bg-danger";
  }
}

function hitungRataRata(array) {
  if (!Array.isArray(array) || array.length === 0)
    return <span className="text-sm">Tidak ada testimoni/rating</span>;

  const total = array.reduce((acc, curr) => acc + (curr.rating || 0), 0);
  const avg = total / array.length;

  const maxStars = 5;
  const filledStars = Math.floor(avg);
  const halfStar = avg - filledStars >= 0.5;
  const emptyStars = maxStars - filledStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="text-warning">
        {Array(filledStars)
          .fill()
          .map((_, i) => (
            <span key={`full-${i}`}>&#9733;</span> // ★
          ))}
        {halfStar && <span key="half">&#189;</span>} {/* ½ */}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={`empty-${i}`}>&#9734;</span> // ☆
          ))}
      </div>
    </div>
  );
}

async function DashboardPublikPermohonanPage() {
  const data = await publicGetPermohonan();

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Riwayat Permohonan Informasi</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header px-4 py-3">
                <h4 className="m-0">List Permohonan</h4>
              </div>
              <div className="card-body p-0">
                {data?.length === 0 ? (
                  <div className="text-center text-muted m-4">
                    <i>Data Tidak Ditemukan</i>
                  </div>
                ) : null}

                <ul className="dashboardListgroup">
                  {data?.length !== 0 &&
                    data.map((item) => (
                      <li key={item.id}>
                        <div className="mngListings">
                          <div className="d-flex justify-content-start gap-5 flex-wrap">
                            <div>
                              <span
                                className={`badge badge-xs ${getJenisColor(
                                  item?.status
                                )}`}
                              >
                                {item?.status}
                              </span>
                              <h5 className="text-wrap mb-0">
                                {item?.no_regis || <i>Belum Diregistrasi</i>}
                              </h5>
                              <span>{item?.tiket}</span>
                              <div className="text-md mt-2">
                                {item?._count?.jawaban} Jawaban
                              </div>
                              {hitungRataRata(item.testimoni)}
                              <div className="text-md mt-2">
                                {formatedDate(item?.tanggal, true)}
                              </div>
                            </div>

                            <div className="mngListinfirst">
                              <div className="d-flex align-items-center justify-content-start flex-wrap">
                                <div className="">
                                  <div>
                                    <strong>Rincian</strong> : <br />
                                    <span className="text-sm">
                                      {item?.rincian}
                                    </span>
                                  </div>
                                  <div>
                                    <strong>Tujuan</strong> : <br />
                                    <span className="text-sm">
                                      {item?.tujuan}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Link
                                href={`/form/result?tiket=${item?.tiket}&email=${item?.email}`}
                                className="btn btn-sm btn-light-success fw-medium rounded-pill"
                              >
                                Rincian
                                <Icon
                                  icon="solar:alt-arrow-right-bold-duotone"
                                  width="24"
                                  height="24"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPublikPermohonanPage;
