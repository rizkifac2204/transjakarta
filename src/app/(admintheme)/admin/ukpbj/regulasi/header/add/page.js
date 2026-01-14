import React from "react";
import Card from "@/components/ui/Card";
import FormAddUkpbjRegulasiHeader from "./_FormAddUkpbjRegulasiHeader";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Header UKPBJ - Regulasi",
};

function UkpbjRegulasiHeaderAdd() {
  return (
    <Card
      title="FORMULIR TAMBAH HEADER REGULASI UKPBJ"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/ukpbj/regulasi`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddUkpbjRegulasiHeader />
    </Card>
  );
}

export default UkpbjRegulasiHeaderAdd;
