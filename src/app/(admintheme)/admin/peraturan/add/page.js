import React from "react";
import Card from "@/components/ui/Card";
import { getPeraturanHeader } from "@/libs/peraturan";
import FormAddPeraturan from "./_FormAddPeraturan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Peraturan",
};

async function PeraturanAddPage() {
  const headers = await getPeraturanHeader();

  return (
    <Card
      title="FORMULIR TAMBAH DATA PERATURAN"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/peraturan`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddPeraturan headers={headers} />
    </Card>
  );
}

export default PeraturanAddPage;
