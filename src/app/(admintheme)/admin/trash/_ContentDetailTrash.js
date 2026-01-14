import Link from "next/link";
import DetailRow from "@/components/ui/DetailRow";
import { formatedDate } from "@/utils/formatDate";
import { encodeId } from "@/libs/hash/hashId";
import ActionDetailTrash from "./_ActionDetailTrash";

export const DetailPermohonanTrash = ({ data, kategori }) => {
  return (
    <>
      <div className="space-y-2">
        <DetailRow label="No. Registrasi" value={data?.no_regis} />
        <DetailRow label="Tiket" value={data?.tiket} />
        <DetailRow label="Tanggal" value={formatedDate(data?.tanggal, true)} />
        <DetailRow label="Email Pemohon" value={data?.email} />
        <DetailRow label="Tipe Pemohon" value={data?.tipe} />
        <DetailRow label="Rincian Informasi" value={data?.rincian} />
        <DetailRow label="Tujuan Informasi" value={data?.tujuan} />
        <DetailRow label="Cara Memperoleh Informasi" value={data?.cara_dapat} />
        <DetailRow
          label="Cara Mendapatkan Informasi"
          value={data?.cara_terima}
        />
        <DetailRow label="Status Permohonan" value={data?.status} />
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
      </div>

      <div className="w-full flex justify-between gap-2 mt-3">
        <ActionDetailTrash id={data.id} kategori={kategori} />

        <p className="font-thin text-xs">
          Dihapus : {formatedDate(data?.deleted_at, true, true)}
        </p>
      </div>
    </>
  );
};

export const DetailKeberatanTrash = ({ data, kategori }) => {
  return (
    <>
      <div className="space-y-2">
        <DetailRow label="No. Registrasi" value={data?.no_regis} />
        <DetailRow label="Tanggal" value={formatedDate(data?.tanggal, true)} />
        <DetailRow label="Nama Lengkap" value={data?.nama} />
        <DetailRow label="Kategori" value={data?.kategori} />
        <DetailRow label="Nomor Identitas" value={data?.nomor_identitas} />
        <DetailRow label="Email" value={data?.email} />
        <DetailRow label="Telp/HP" value={data?.telp} />
        <DetailRow label="Alamat" value={data?.alamat} />
        <DetailRow label="Alasan mengajukan keberatan" value={data?.alasan} />
        <DetailRow label="Tujuan mengajukan keberatan" value={data?.tujuan} />
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
      </div>

      <div className="w-full flex justify-between gap-2 mt-3">
        <ActionDetailTrash id={data.id} kategori={kategori} />

        <p className="font-thin text-xs">
          Dihapus : {formatedDate(data?.deleted_at, true, true)}
        </p>
      </div>
    </>
  );
};

export const DetailPenelitianTrash = ({ data, kategori }) => {
  return (
    <>
      <div className="space-y-2">
        <DetailRow label="No. Registrasi" value={data?.no_regis} />
        <DetailRow label="Tiket" value={data?.tiket} />
        <DetailRow label="Tanggal" value={formatedDate(data?.tanggal, true)} />
        <DetailRow label="Email Pemohon" value={data?.email} />
        <DetailRow label="Tipe Pemohon" value={data?.tipe} />
        <DetailRow label="Judul Penelitian" value={data?.judul} />
        <DetailRow label="Tujuan Penelitian" value={data?.tujuan} />
        <DetailRow label="Status" value={data?.status} />
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
      </div>

      <div className="w-full flex justify-between gap-2 mt-3">
        <ActionDetailTrash id={data.id} kategori={kategori} />

        <p className="font-thin text-xs">
          Dihapus : {formatedDate(data?.deleted_at, true, true)}
        </p>
      </div>
    </>
  );
};
