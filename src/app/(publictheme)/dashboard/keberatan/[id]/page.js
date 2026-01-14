import React from "react";
import { notFound } from "next/navigation";
import { publicGetKeberatananDetailById } from "@/libs/publik/keberatan";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatedDate } from "@/utils/formatDate";
import FilePreview from "@/components/ui/FilePreview";
import DetailRow from "@/components/front/DetailRow";
import { PATH_UPLOAD } from "@/configs/appConfig";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Detail Keberatan",
};

async function DashboardPublikKeberatanDetailPage({ params }) {
  const id = decodeOrNotFound(params.id);
  const data = await publicGetKeberatananDetailById(parseInt(id));
  if (!data) notFound();

  return (
    <div className="user-dashboard-box bg-light">
      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-lg-5 mb-4">
          <div className="col-lg-8 col-md-7">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header px-4 py-3 d-flex justify-content-between align-items-center">
                <h4 className="m-0">Detail Keberatan</h4>
                <Link
                  href={`/dashboard/keberatan`}
                  className="btn btn-sm fw-medium"
                >
                  <Icon
                    icon="solar:alt-arrow-left-bold-duotone"
                    width="24"
                    height="24"
                  />
                  Kembali
                </Link>
              </div>
              <div className="card-body p-4">
                <div className="d-flex flex-column gap-2">
                  <DetailRow
                    label="No. Registrasi"
                    value={
                      data?.no_regis || (
                        <i className="text-muted">Belum Diregistrasi</i>
                      )
                    }
                  />
                  <DetailRow
                    label="Tanggal"
                    value={formatedDate(data?.tanggal, true)}
                  />
                  <DetailRow label="Nama Lengkap" value={data?.nama} />
                  <DetailRow label="Kategori" value={data?.kategori} />
                  <DetailRow
                    label="Nomor Identitas"
                    value={data?.nomor_identitas}
                  />
                  <DetailRow label="Email" value={data?.email} />
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
                </div>
                <div className="w-100 d-flex justify-content-between gap-2 mt-3">
                  <p className="fw-light small mb-0">
                    Dibuat : {formatedDate(data?.created_at, true, true)}
                  </p>
                  <p className="fw-light small mb-0 text-end">
                    Update Terakhir :{" "}
                    {formatedDate(data?.updated_at, true, true)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-5">
            <div className="card rounded-3 shadow-sm">
              <div className="card-body p-3">
                <FilePreview
                  fileUrl={
                    data?.file_pendukung
                      ? `/api/services/file/uploads/${PATH_UPLOAD.keberatan}/${data?.file_pendukung}`
                      : null
                  }
                  filename={data?.file_pendukung || "Lampiran"}
                  label="LAMPIRAN FILE PENDUKUNG"
                />

                <div className="alert alert-success mt-5" role="alert">
                  <strong>Perhatian:</strong> Tindak lanjut atas keberatan yang
                  Anda ajukan akan diselesaikan di luar aplikasi ini. Hasil
                  penanganan akan dikirimkan melalui <strong>WhatsApp</strong>{" "}
                  atau <strong>email</strong> yang telah Anda cantumkan saat
                  pengajuan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPublikKeberatanDetailPage;
