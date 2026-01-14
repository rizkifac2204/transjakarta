import React from "react";
import { getPeraturan, getPeraturanHeader } from "@/libs/peraturan";
import TablePeraturan from "./_TablePeraturan";
import HeaderPeraturan from "./_HeaderPeraturan";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Peraturan",
};

async function PeraturanPage() {
  const data = await getPeraturan();
  const headers = await getPeraturanHeader();

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:w-9/12">
        <TablePeraturan data={Array.isArray(data) ? data : []} />
      </div>
      <div className="w-full md:w-3/12">
        <HeaderPeraturan data={Array.isArray(headers) ? headers : []} />
      </div>
    </div>
  );
}

export default PeraturanPage;
