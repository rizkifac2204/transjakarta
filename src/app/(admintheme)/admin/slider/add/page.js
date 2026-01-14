import React from "react";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FormAddSlider from "./_FormAddSlider";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tambah Slider",
};

async function SliderAddPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  return (
    <Card
      title="FORMULIR TAMBAH TAMPILAN SLIDER"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/slider`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddSlider />
    </Card>
  );
}

export default SliderAddPage;
