import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getAdminOnly } from "@/libs/admin";
import Link from "next/link";
import { getPermohonanDetailById } from "@/libs/permohonan";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import DetailRow from "@/components/ui/DetailRow";
import { formatedDate } from "@/utils/formatDate";
import CardPemohon from "./_CardPemohon";
import FilePreview from "@/components/ui/FilePreview";
import ActionPermohonanDetail from "./_Action";
import JawabanList from "./_JawabanList";
import FormNoRegis from "./_FormNoRegis";
import FormPenanggungJawab from "./_FormPenanggungJawab";
import FormStatus from "./_FormStatus";
import Alert from "@/components/ui/Alert";
import StatusTanggapan from "../_StatusTanggapan";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Permohonan Informasi",
};

async function PermohonanDetailPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPermohonanDetailById(id);
  if (!data) notFound();
  const auth = await verifyAuth();
  let admins = [];
  const isEditPenanggungJawab = auth.level < 3;
  if (isEditPenanggungJawab) {
    admins = await getAdminOnly();
  }

  return (
    <div className="flex flex-col md:flex-col">
      <div className="flex flex-col-reverse md:flex-row md:gap-x-4">
        <div className="md:w-1/4 w-full flex flex-col gap-y-2">
          <div className="order-4 md:order-1 mt-4 md:mt-0">
            <CardPemohon pemohon={data?.pemohon} />
          </div>
          <div className="order-2 md:order-2 p-2">
            <FilePreview
              fileUrl={
                data?.file_pendukung
                  ? `/api/services/file/uploads/${PATH_UPLOAD.permohonan}/${data?.file_pendukung}`
                  : null
              }
              filename={data?.file_pendukung || "File Pendukung"}
              label="File Pendukung"
            />
          </div>
        </div>

        <div className="md:w-3/4 w-full order-1 md:order-2">
          <Card
            title={
              <div className="flex flex-col md:flex-row gap-1">
                DETAIL PERMOHONAN INFORMASI{" "}
                <StatusTanggapan
                  no_regis={data.no_regis}
                  tanggal={data.tanggal}
                />
              </div>
            }
            headerslot={<ActionPermohonanDetail id={id} />}
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

              <FormNoRegis data={data} section="permohonan" />
              <DetailRow label="Tiket" value={data?.tiket} />
              <DetailRow
                label="Tanggal"
                value={formatedDate(data?.tanggal, true)}
              />
              <DetailRow
                label="Email Pemohon"
                value={data?.email}
                classValue="sm:w-full w-[160px] break-words"
              />
              <DetailRow label="Tipe Pemohon" value={data?.tipe} />
              <DetailRow label="Rincian Informasi" value={data?.rincian} />
              <DetailRow label="Tujuan Informasi" value={data?.tujuan} />
              <DetailRow
                label="Cara Memperoleh Informasi"
                value={data?.cara_dapat}
              />
              <DetailRow
                label="Cara Mendapatkan Informasi"
                value={data?.cara_terima}
              />
              <FormStatus data={data} section="permohonan" />
              {isEditPenanggungJawab ? (
                <FormPenanggungJawab
                  admins={admins}
                  data={data}
                  section="permohonan"
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

              <DetailRow
                label="Jumlah Testimoni"
                value={
                  data.testimoni.length ? (
                    <Link
                      href={`/admin/testimoni?permohonan=${encodeId(data?.id)}`}
                    >
                      {data.testimoni.length}
                    </Link>
                  ) : (
                    "0"
                  )
                }
              />
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

      <div className="w-full mt-4 order-3">
        <JawabanList
          data={data?.jawaban}
          section="permohonan"
          foreignKey="permohonan_id"
        />
      </div>
    </div>
  );
}

export default PermohonanDetailPage;
