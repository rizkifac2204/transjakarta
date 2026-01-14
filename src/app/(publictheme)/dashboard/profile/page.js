import React from "react";
import { getSession } from "@/libs/auth-public";
import { redirect } from "next/navigation";
import FormProfilePublik from "./_FormProfile";
import FormPasswordPublik from "./_FormPasswordPublik";
import ActionFotoPemohon from "./_ActionFotoPemohon";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Profile",
};

async function DashboardPublikProfilePage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 py-lg-0 py-5">
        <h2 className="fw-medium mb-0">Profile</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-xl-8 col-lg-8 col-md-7">
            <FormProfilePublik data={session} />
            <FormPasswordPublik data={session} />
          </div>

          <div className="col-xl-4 col-lg-4 col-md-5">
            <div className="card rounded-3 shadow-sm mb-3">
              <div className="card-body py-5 p-4 ">
                <ActionFotoPemohon
                  data={session}
                  section="foto"
                  path="pemohon"
                />
              </div>
            </div>
            <div className="card rounded-3 shadow-sm">
              <div className="card-body py-5 p-4">
                <ActionFotoPemohon
                  data={session}
                  section="identitas"
                  path="identitas"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPublikProfilePage;
