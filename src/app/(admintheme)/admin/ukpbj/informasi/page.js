import React from "react";
import {
  getUIHeaderPlusData,
  getUISubByHeaderId,
  getUISubSubByHeaderId,
} from "@/libs/ukpbj-informasi-withsub";
import { decodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import Link from "next/link";
import ListHeader from "./_ListHeader";
import ListSub from "./_ListSub";
import ListSubSub from "./_ListSubSub";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Informasi PBJ",
};

async function UkpbjInformasiPage({ searchParams }) {
  const headerId = decodeId(searchParams.headerId) ?? undefined;
  const subId = decodeId(searchParams.subId) ?? undefined;
  const subSubId = decodeId(searchParams.subSubId) ?? undefined;

  const headers = await getUIHeaderPlusData();

  const selectedHeader = headerId
    ? headers.find((item) => String(item.id) === String(headerId))
    : headers[0];

  const subs = selectedHeader
    ? await getUISubByHeaderId(Number(selectedHeader.id))
    : [];

  const subsubs = subId ? await getUISubSubByHeaderId(Number(subId)) : [];

  return (
    <div className="grid gap-5 grid-cols-12">
      <div className="xl:col-span-4 col-span-12 card-auto-height">
        <Card
          title="HEADER"
          headerslot={
            <Link
              href="/admin/ukpbj/informasi/head/add?section=header"
              className="btn-outline-dark px-4 py-1 flex items-center justify-center rounded-md text-sm"
              scroll={false}
            >
              Tambah Header
            </Link>
          }
        >
          <div className="flex flex-col space-y-1 text-start items-start">
            <ListHeader headers={headers} />
          </div>
        </Card>

        <div className="border border-slate-500 p-2 rounded-lg my-4">
          <div className="my-4">
            <h5>List Sub Header {selectedHeader?.label}</h5>
          </div>
          <ListSub subs={subs} />
        </div>
      </div>
      <div className="xl:col-span-8 col-span-12">
        <ListSubSub subsubs={subsubs} headerId={headerId} />
      </div>
    </div>
  );
}

export default UkpbjInformasiPage;
