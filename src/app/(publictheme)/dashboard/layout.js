import React from "react";
import DashboardSidebar from "@/components/front/dashboard/DashboardSidebar";
import appConfig from "@/configs/appConfig";

async function DashboardLayoutPublik({ children }) {
  return (
    <section className="p-0">
      <div className="container-fluid p-0">
        <div className="row g-0 min-vh-100">
          <div className="col-xl-2 col-lg-3 col-md-12">
            <DashboardSidebar />
          </div>

          <div
            className="col-xl-10 col-lg-9 col-md-12 pt-lg-0 pt-5"
            style={{ minHeight: "110vh" }}
          >
            {children}

            <div className="row align-items-start g-4">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <p className="text-muted m-0">
                  © {new Date().getFullYear()} {appConfig.app.name}.{" "}
                  <a href="https://bp2mi.go.id" target="_blank">
                    {appConfig.app.description}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardLayoutPublik;
