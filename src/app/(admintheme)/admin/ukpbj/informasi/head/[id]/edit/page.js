import React from "react";
import {
  getUIHeaderDetailById,
  getUISubDetailById,
  getUISubSubDetailById,
} from "@/libs/ukpbj-informasi-withsub";
import { notFound } from "next/navigation";
import { decodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormEditUkpbjRegulasiHeader from "./_FormEditUkpbjRegulasiHeader";
import Alert from "@/components/ui/Alert";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Header Informasi PBJ",
};

async function UkpbjInformasiHeaderEditPage({ params, searchParams }) {
  const id = decodeId(params.id);
  const section = (await searchParams).section;
  if (["header", "sub", "subsub"].includes(section) === false) {
    notFound();
  }

  // set title based on section
  let title = "";
  let parent = "";
  let url = "";
  let data = null;
  if (section === "header") {
    title = "FORMULIR EDIT HEADER INFORMASI PBJ";
    url = `/api/ukpbj/informasi/header/${id}`;
    data = await getUIHeaderDetailById(id);
  } else if (section === "sub") {
    title = "FORMULIR EDIT SUB HEADER INFORMASI PBJ";
    url = `/api/ukpbj/informasi/sub/${id}`;
    data = await getUISubDetailById(id);
    parent = data?.ukpbj_informasi_header?.label || "";
  } else if (section === "subsub") {
    title = "FORMULIR EDIT SUB SUBHEADER INFORMASI PBJ";
    url = `/api/ukpbj/informasi/sub-sub/${id}`;
    data = await getUISubSubDetailById(id);
    parent = data?.ukpbj_informasi_header_sub?.label || "";
  }

  if (!data) notFound();

  return (
    <Card title={title} noborder={false} headerslot={<BackButton />}>
      <Alert type="info" className="mb-4">
        <p className="font-semibold">Keterangan:</p>
        <ul className="list-disc list-inside">
          {section === "header" && (
            <li>Formulir ini digunakan untuk mengedit Header.</li>
          )}
          {section === "sub" && (
            <li>
              Formulir ini digunakan untuk mengedit Sub Header {`(${parent})`}
            </li>
          )}
          {section === "subsub" && (
            <li>
              Formulir ini digunakan untuk mengedit Sub Sub Header{" "}
              {`(${parent})`}
            </li>
          )}
        </ul>
      </Alert>

      <FormEditUkpbjRegulasiHeader data={data} url={url} />
    </Card>
  );
}

export default UkpbjInformasiHeaderEditPage;
