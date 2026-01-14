import React from "react";
import {
  getUkpbjRegulasi,
  getUkpbjRegulasiHeader,
} from "@/libs/ukpbj-regulasi";
import TableUkpbjRegulasi from "./_TableUkpbjRegulasi";
import HeaderUkpbjRegulasi from "./_HeaderUkpbjRegulasi";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UKPBJ - Regulasi",
};

async function UkpbjRegulasiPage() {
  const data = await getUkpbjRegulasi();
  const headers = await getUkpbjRegulasiHeader();

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-9/12">
        <TableUkpbjRegulasi data={Array.isArray(data) ? data : []} />
      </div>
      <div className="w-full md:w-3/12">
        <HeaderUkpbjRegulasi data={Array.isArray(headers) ? headers : []} />
      </div>
    </div>
  );
}

export default UkpbjRegulasiPage;
