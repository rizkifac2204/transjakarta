import React from "react";
import Card from "@/components/ui/Card";
import { getUkpbjRegulasiHeader } from "@/libs/ukpbj-regulasi";
import FormAddUkpbjRegulasi from "./_FormAddUkpbjRegulasi";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "Tambah Regulasi UKPBJ",
};

async function UkpbjRegulasiAddPage() {
  const headers = await getUkpbjRegulasiHeader();

  return (
    <Card
      title="FORMULIR TAMBAH DATA REGULASI UKPBJ"
      noborder={false}
      headerslot={
        <Link className="action-btn" href={`/admin/ukpbj/regulasi`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <FormAddUkpbjRegulasi headers={headers} />
    </Card>
  );
}

export default UkpbjRegulasiAddPage;
