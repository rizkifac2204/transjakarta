import React from "react";
import Link from "next/link";
import { getKeberatanDetailById } from "@/libs/keberatan";
import { notFound } from "next/navigation";
import { verifyAuth } from "@/libs/auth";
import { getAdminOnly } from "@/libs/admin";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import DetailRow from "@/components/ui/DetailRow";
import { formatedDate } from "@/utils/formatDate";
import CardPemohon from "../../permohonan/[id]/_CardPemohon";
import { PATH_UPLOAD } from "@/configs/appConfig";
import FilePreview from "@/components/ui/FilePreview";
import ActionKeberatanDetail from "./_Action";
import FormNoRegis from "../../permohonan/[id]/_FormNoRegis";
import FormPenanggungJawab from "../../permohonan/[id]/_FormPenanggungJawab";
import Alert from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Keberatan",
};

async function KeberatanDetailPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getKeberatanDetailById(parseInt(id));
  if (!data) notFound();
  const auth = await verifyAuth();
  let admins = [];
  const isEditPenanggungJawab = auth.level < 3;
  if (isEditPenanggungJawab) {
    admins = await getAdminOnly();
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-x-2">
      <div className="md:w-1/4 w-full order-2 md:order-1 mt-4 md:mt-0 flex flex-col gap-y-2">
        <CardPemohon pemohon={data?.pemohon} />
        <FilePreview
          fileUrl={
            data?.file_pendukung
              ? `/api/services/file/uploads/${PATH_UPLOAD.keberatan}/${data?.file_pendukung}`
              : null
          }
          filename={data?.file_pendukung || "Lampiran"}
          label="LAMPIRAN FILE PENDUKUNG"
        />
      </div>

      <div className="md:w-3/4 w-full order-1 md:order-2">
        <Card
          title={`DETAIL KEBERATAN`}
          headerslot={<ActionKeberatanDetail id={id} />}
          noborder={false}
        >
          <div className="space-y-2">
            {data?.no_regis ? null : (
              <Alert
                dismissible
                label="Permohonan Belum Diregisrasi"
                className="alert-outline-primary"
              />
            )}

            <FormNoRegis data={data} section="keberatan" />
            <DetailRow
              label="Tanggal"
              value={formatedDate(data?.tanggal, true)}
            />
            <DetailRow label="Nama Lengkap" value={data?.nama} />
            <DetailRow label="Kategori" value={data?.kategori} />
            <DetailRow label="Nomor Identitas" value={data?.nomor_identitas} />
            <DetailRow
              label="Email"
              value={data?.email}
              classValue="sm:w-full w-[160px] break-words"
            />
            <DetailRow label="Telp/HP" value={data?.telp} />
            <DetailRow label="Alamat" value={data?.alamat} />
            <DetailRow
              label="Alasan mengajukan keberatan"
              value={data?.alasan}
            />
            <DetailRow
              label="Tujuan mengajukan keberatan"
              value={data?.tujuan}
            />
            {isEditPenanggungJawab ? (
              <FormPenanggungJawab
                admins={admins}
                data={data}
                section="keberatan"
              />
            ) : (
              <DetailRow
                label="Penanggung Jawab"
                value={
                  data?.admin?.id ? (
                    <Link
                      href={`/admin/pengguna/${encodeId(data?.admin?.id)}`}
                      className="underline"
                    >
                      {data?.admin?.nama}
                    </Link>
                  ) : (
                    "-"
                  )
                }
              />
            )}
          </div>

          <div className="w-full flex justify-between gap-2 mt-3">
            <p className="font-thin text-xs">
              Dibuat : {formatedDate(data?.created_at, true, true)}
            </p>
            <p className="font-thin text-xs text-right">
              Update Terakhir : {formatedDate(data?.updated_at, true, true)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default KeberatanDetailPage;
