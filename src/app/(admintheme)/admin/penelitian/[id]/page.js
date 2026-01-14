import React from "react";
import { verifyAuth } from "@/libs/auth";
import { getAdminOnly } from "@/libs/admin";
import Link from "next/link";
import { getPenelitianDetailById } from "@/libs/penelitian";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import DetailRow from "@/components/ui/DetailRow";
import { formatedDate } from "@/utils/formatDate";
import CardPemohon from "../../permohonan/[id]/_CardPemohon";
import FilePreview from "@/components/ui/FilePreview";
import ActionPenelitialDetail from "./_Action";
import FormNoRegis from "../../permohonan/[id]/_FormNoRegis";
import FormStatus from "../../permohonan/[id]/_FormStatus";
import FormPenanggungJawab from "../../permohonan/[id]/_FormPenanggungJawab";
import JawabanList from "../../permohonan/[id]/_JawabanList";
import Alert from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detail Permohonan Penelitian",
};

async function PenelitianDetailPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPenelitianDetailById(parseInt(id));
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

            <div className="py-5 border-b">
              <FilePreview
                fileUrl={
                  data?.file_permohonan
                    ? `/api/services/file/uploads/${PATH_UPLOAD.penelitian.permohonan}/${data?.file_permohonan}`
                    : null
                }
                filename={data?.file_permohonan || "File Permohonan"}
                label="File Permohonan"
              />
            </div>

            <div className="pb-5 border-b">
              <FilePreview
                fileUrl={
                  data?.file_proposal
                    ? `/api/services/file/uploads/${PATH_UPLOAD.penelitian.proposal}/${data?.file_proposal}`
                    : null
                }
                filename={data?.file_proposal || "File Proposal"}
                label="File Proposal"
              />
            </div>

            <FilePreview
              fileUrl={
                data?.file_pertanyaan
                  ? `/api/services/file/uploads/${PATH_UPLOAD.penelitian.pertanyaan}/${data?.file_pertanyaan}`
                  : null
              }
              filename={data?.file_pertanyaan || "File Pertanyaan"}
              label="File Pertanyaan"
            />
          </div>
        </div>

        <div className="md:w-3/4 w-full order-1 md:order-2">
          <Card
            title={`DETAIL PERMOHONAN PENELITIAN: ${
              data?.no_regis ? data?.no_regis : data?.tiket
            }`}
            headerslot={<ActionPenelitialDetail id={id} />}
            noborder={false}
          >
            <div className="space-y-2">
              {data?.no_regis ? null : (
                <Alert
                  dismissible
                  label="Permohonan Penelitian Belum Diregisrasi"
                  className="alert-outline-primary"
                />
              )}

              <FormNoRegis data={data} section="penelitian" />
              <DetailRow label="Tiket" value={data?.tiket} />
              <DetailRow
                label="Tanggal Penelitian"
                value={formatedDate(data?.tanggal, true)}
              />
              <DetailRow
                label="Email Pemohon"
                value={data?.email}
                classValue="sm:w-full w-[160px] break-words"
              />
              <DetailRow label="Tipe Pemohon" value={data?.tipe} />
              <DetailRow label="Judul Penelitian" value={data?.judul} />
              <DetailRow label="Tujuan Penelitian" value={data?.tujuan} />
              <FormStatus data={data} section="penelitian" />
              {isEditPenanggungJawab ? (
                <FormPenanggungJawab
                  admins={admins}
                  data={data}
                  section="penelitian"
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
                      href={`/admin/testimoni?penelitian=${encodeId(data?.id)}`}
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

          <div className="w-full mt-4">
            <JawabanList
              data={data?.jawaban_penelitian}
              section="penelitian"
              foreignKey="penelitian_id"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PenelitianDetailPage;
