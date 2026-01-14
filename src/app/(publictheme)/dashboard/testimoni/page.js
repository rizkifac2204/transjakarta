import React from "react";
import { publicGetTestimoni } from "@/libs/publik/testimoni";
import TestimoniContent from "./_Content";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Testimoni",
};

async function DashboardPublikTestimoniPage() {
  const data = await publicGetTestimoni();

  // console.log(data);

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Semua Rating/Testimoni</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header px-4 py-3">
                <h4 className="m-0">Reviews</h4>
              </div>
              <div className="card-body p-0">
                {data?.length === 0 ? (
                  <div className="text-center text-muted m-4">
                    <i>Data Tidak Ditemukan</i>
                  </div>
                ) : (
                  <TestimoniContent data={data} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPublikTestimoniPage;
