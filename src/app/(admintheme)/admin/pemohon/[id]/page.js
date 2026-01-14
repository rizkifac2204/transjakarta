import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { getPemohonDetailById } from "@/libs/pemohon";
import { notFound } from "next/navigation";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";
import Card from "@/components/ui/Card";
import ActionDetailPemohon from "./_Action";
import { formatedDate } from "@/utils/formatDate";
import ActionIdentitas from "./_ActionIdentitas";
import { PATH_UPLOAD } from "@/configs/appConfig";
import FilePreview from "@/components/ui/FilePreview";

async function PemohonDetailPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await getPemohonDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-8 pb-2">
        <div className="md:w-1/3 w-full p-5">
          <ActionIdentitas data={data} />
        </div>

        <div className="md:w-2/3 w-full">
          <div className="flex gap-2">
            <FilePreview
              fileUrl={
                data?.foto
                  ? `/api/services/file/uploads/${PATH_UPLOAD.pemohon}/${data?.foto}`
                  : null
              }
              filename={data?.foto || "Pemohon"}
              isUser={true}
              className="h-[40px] w-auto object-cover rounded-md"
            />

            <p className="text-2xl font-bold">{data?.nama || "Pemohon"}</p>
          </div>

          <hr className="my-3" />

          <>
            <p className="font-thin">
              Nomor Identitas :{" "}
              <span className="text-lg font-bold">
                {data?.nomor_identitas || "-"}
              </span>
            </p>
            <p className="font-thin">
              Jenis Kelamin :{" "}
              <span className="text-lg font-bold">
                {data?.jenis_kelamin || "-"}
              </span>
            </p>
            <p className="font-thin">
              Telp :{" "}
              <span className="text-lg font-bold">{data?.telp || "-"}</span>
            </p>
            <p className="font-thin">
              Email :{" "}
              <span className="text-lg font-bold">{data?.email || "-"}</span>
            </p>
            <p className="font-thin">
              Pekerjaan :{" "}
              <span className="text-lg font-bold">
                {data?.pekerjaan || "-"}
              </span>
            </p>
            <p className="font-thin">
              Pendidikan :{" "}
              <span className="text-lg font-bold">
                {data?.pendidikan || "-"}
              </span>
            </p>
            <p className="font-thin">
              Lembaga/Universita :{" "}
              <span className="text-lg font-bold">
                {data?.universitas || "-"}
              </span>
            </p>
            <p className="font-thin">
              Jurusan/Prodi :{" "}
              <span className="text-lg font-bold">{data?.jurusan || "-"}</span>
            </p>
            <p className="font-thin">
              No. Induk Mahasiswa :{" "}
              <span className="text-lg font-bold">{data?.nim || "-"}</span>
            </p>

            <div>
              <p className="font-thin">
                Permohonan Diajukan :{" "}
                <span className="text-lg font-bold">
                  {data?.permohonan?.length}
                </span>
              </p>
              {Boolean(data?.permohonan?.length)
                ? data?.permohonan?.map((item) => (
                    <Link
                      href={`/admin/permohonan/${encodeId(item.id)}`}
                      key={item.id}
                    >
                      <Badge
                        label={item.tiket}
                        className="bg-secondary-500 text-white m-1"
                        icon="solar:star-circle-broken"
                      />
                    </Link>
                  ))
                : null}
            </div>

            <div>
              <p className="font-thin">
                Keberatan Diajukan :{" "}
                <span className="text-lg font-bold">
                  {data?.keberatan?.length}
                </span>
              </p>
              {Boolean(data?.keberatan?.length)
                ? data?.keberatan?.map((item) => (
                    <Link
                      href={`/admin/keberatan/${encodeId(item.id)}`}
                      key={item.id}
                    >
                      <Badge
                        label={formatedDate(item.tanggal)}
                        className="bg-secondary-500 text-white m-1"
                        icon="solar:palette-broken"
                      />
                    </Link>
                  ))
                : null}
            </div>

            <div>
              <p className="font-thin">
                Permohonan Penelitian :{" "}
                <span className="text-lg font-bold">
                  {data?.penelitian?.length}
                </span>
              </p>
              {Boolean(data?.penelitian?.length)
                ? data?.penelitian?.map((item) => (
                    <Link
                      href={`/admin/penelitian/${encodeId(item.id)}`}
                      key={item.id}
                    >
                      <Badge
                        label={item.tiket}
                        className="bg-secondary-500 text-white m-1"
                        icon="solar:palette-broken"
                      />
                    </Link>
                  ))
                : null}
            </div>

            <p className="font-thin my-8">{data?.alamat || "-"}</p>
            {data?.register ? (
              <>
                <u className="text-xs font-light">
                  {`Pemohon Terdaftar Melakukan Registrasi`}
                </u>

                <p className="font-thin">
                  Username :{" "}
                  <span className="text-lg font-bold">{data.username} </span>
                </p>
                <p className="font-thin">
                  Password : <i className="text-xs font-light">Enrcypted </i>
                </p>
              </>
            ) : (
              <i className="text-xs font-light">
                {`(User ini tidak/belum membuat akun)`}
              </i>
            )}
          </>

          <ActionDetailPemohon data={data} />
        </div>
      </div>

      <div className="w-full flex justify-between px-2 gap-2 mt-10">
        <p className="font-thin text-xs">
          Dibuat : {formatedDate(data?.created_at, true, true)}
        </p>
        <p className="font-thin text-xs text-right">
          Update Terakhir : {formatedDate(data?.updated_at, true, true)}
        </p>
      </div>
    </Card>
  );
}

export default PemohonDetailPage;
