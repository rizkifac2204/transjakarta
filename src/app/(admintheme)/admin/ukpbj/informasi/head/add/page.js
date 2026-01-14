import React from "react";
import { notFound } from "next/navigation";
import {
  getUIHeaderDetailById,
  getUISubDetailById,
} from "@/libs/ukpbj-informasi-withsub";
import { decodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import FormAddUkpbjInformasiHeader from "./_FormAddUkpbjInformasiHeader";
import Alert from "@/components/ui/Alert";
import BackButton from "@/components/ui/BackButton";

export const metadata = {
  title: "Tambah Header UKPBJ - Informasi PBJ",
};

async function UkpbjInformasiHeaderAdd({ searchParams }) {
  const section = (await searchParams).section;
  if (["header", "sub", "subsub"].includes(section) === false) {
    notFound();
  }
  let header = null;

  // headerId bisa berasal dari header atau sub
  const headerId = decodeId((await searchParams).headerId);

  // set title based on section
  let title = "";
  let url = "";
  if (section === "header") {
    url = "/api/ukpbj/informasi/header";
    title = "FORMULIR TAMBAH HEADER INFORMASI PBJ";
  } else if (section === "sub") {
    url = "/api/ukpbj/informasi/sub";
    header = await getUIHeaderDetailById(headerId);
    if (!header) notFound();
    title = `FORMULIR TAMBAH SUB HEADER INFORMASI PBJ`;
  } else if (section === "subsub") {
    url = "/api/ukpbj/informasi/sub-sub";
    header = await getUISubDetailById(headerId);
    if (!header) notFound();
    title = `FORMULIR TAMBAH SUB SUBHEADER INFORMASI PBJ`;
  }

  return (
    <Card title={title} noborder={false} headerslot={<BackButton />}>
      <Alert type="info" className="mb-4">
        <p className="font-semibold">Informasi:</p>
        <ul className="list-disc list-inside">
          {section === "header" && (
            <li>Formulir ini digunakan untuk menambahkan Header baru.</li>
          )}
          {section === "sub" && (
            <li>
              Formulir ini digunakan untuk menambahkan Sub Header baru pada
              Header: <strong>{header.label}</strong>.
            </li>
          )}
          {section === "subsub" && (
            <li>
              Formulir ini digunakan untuk menambahkan Sub Sub Header baru pada
              Sub Header: <strong>{header.label}</strong>.
            </li>
          )}
          <li>Pastikan semua data yang dimasukkan sudah benar.</li>
        </ul>
      </Alert>
      <FormAddUkpbjInformasiHeader url={url} header={header} />
    </Card>
  );
}

export default UkpbjInformasiHeaderAdd;
