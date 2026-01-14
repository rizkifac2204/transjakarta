import React from "react";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import { getSliders } from "@/libs/slider";
import TableSlider from "./_TableSlider";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Slider Home",
};

async function SliderPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const data = await getSliders();

  return <TableSlider data={Array.isArray(data) ? data : []} />;
}

export default SliderPage;
