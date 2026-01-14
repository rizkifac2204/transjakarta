import React from "react";
import { getSession } from "@/libs/auth-public";
import { redirect } from "next/navigation";
import {
  getPermohonanPublikCountByIdAndEmail,
  getKeberatanPublikCountByIdAndEmail,
  getPenelitianPublikCountByIdAndEmail,
  getJawabanPublikCountByIdAndEmail,
  getJawabanPenelitianPublikCountByIdAndEmail,
  getTestimoniPublikCountByEmail,
} from "@/libs/publik/dashboard";
import HeadCount from "./_HeadCount";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard",
};

async function DashboardPublikPage() {
  const session = await getSession();
  if (!session) redirect("/");
  const isUsernameAndPasswordNotSet = !session?.username || !session?.username;

  const [
    countPermohonan,
    countKeberatan,
    countPenelitian,
    countJawaban,
    countJawabanPenelitian,
    countTestimoni,
  ] = await Promise.all([
    getPermohonanPublikCountByIdAndEmail(session.id, session.email),
    getKeberatanPublikCountByIdAndEmail(session.id, session.email),
    getPenelitianPublikCountByIdAndEmail(session.id, session.email),
    getJawabanPublikCountByIdAndEmail(session.id, session.email),
    getJawabanPenelitianPublikCountByIdAndEmail(session.id, session.email),
    getTestimoniPublikCountByEmail(session.email),
  ]);

  const dashboardDataHead = [
    {
      title: "Permohonan",
      count: countPermohonan,
      icon: "solar:database-broken",
      jawaban: countJawaban,
      link: "/dashboard/permohonan",
      bg: "bg-light-success",
    },
    {
      title: "Keberatan",
      count: countKeberatan,
      icon: "solar:palette-broken",
      link: "/dashboard/keberatan",
      bg: "bg-light-danger",
    },
    {
      title: "Penelitian",
      count: countPenelitian,
      icon: "solar:square-academic-cap-2-broken",
      jawaban: countJawabanPenelitian,
      link: "/dashboard/penelitian",
      bg: "bg-light-info",
    },
    {
      title: "Testimoni",
      count: countTestimoni,
      icon: "solar:star-fall-2-broken",
      link: "/dashboard/testimoni",
      bg: "bg-light-warning",
    },
  ];

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 pt-lg-0 pt-5">
        <h2 className="fw-medium mb-0">Hallo, {session.nama}</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {isUsernameAndPasswordNotSet ? (
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="alert alert-danger" role="alert">
              Mohon Atur <strong>Username</strong> Pada Formulir Edit Profile
              dan <strong>Password</strong> Pada Formulir Password di Halaman
              Profile demi keamanan
            </div>
          </div>
        ) : null}

        <HeadCount data={dashboardDataHead} />
      </div>
    </div>
  );
}

export default DashboardPublikPage;
