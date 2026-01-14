import React from "react";
import Card from "@/components/ui/Card";
import FormAddPeraturanHeader from "./_FormAddPeraturanHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Header Peraturan",
};

function PeraturanHeaderAdd() {
  return (
    <Card
      title="FORMULIR TAMBAH HEADER PERATURAN"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/peraturan`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddPeraturanHeader />
    </Card>
  );
}

export default PeraturanHeaderAdd;
