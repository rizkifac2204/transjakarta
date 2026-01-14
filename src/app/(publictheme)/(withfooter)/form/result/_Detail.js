"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatedDate } from "@/utils/formatDate";
import Alert from "@/components/ui/Alert";
import { PATH_UPLOAD } from "@/configs/appConfig";
import appConfig from "@/configs/appConfig";
import FormTestimoni from "./_FormTestimoni";
import { useReactToPrint } from "react-to-print";

function DetailPage({ data, isPenelitian }) {
  const printRef = useRef(null);
  const keyJawaban = isPenelitian ? "jawaban_penelitian" : "jawaban";
  const path_pemberitahuan = isPenelitian
    ? PATH_UPLOAD.jawabanpenelitian.pemberitahuan
    : PATH_UPLOAD.jawaban.pemberitahuan;
  const path_informasi = isPenelitian
    ? PATH_UPLOAD.jawabanpenelitian.informasi
    : PATH_UPLOAD.jawaban.informasi;

  const reactToPrintFn = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Permohonan-${data?.tiket || "Cetak"}`,
  });

  return (
    <>
      <section
        className="bg-cover"
        style={{
          backgroundImage: `url('/front/auth-bg.png')`,
          backgroundColor: `#fff3ce`,
        }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-xl-9 col-lg-9 col-md-12">
              <div
                ref={printRef}
                className="card card-body shadow-lg border-0 p-4 p-lg-5"
              >
                <div className="d-flex justify-content-between align-items-start pb-4 pb-md-5 mb-4 mb-md-5 border-bottom">
                  <div>
                    <h4>
                      Status Permohonan{" "}
                      {isPenelitian ? "Penelitian" : "Informasi"} :{" "}
                      {data?.tiket}
                    </h4>
                    <address>
                      No. Register <strong>{data?.no_regis || "-"}</strong>
                      <br />
                      Oleh <strong>{data?.pemohon?.nama || "-"}</strong>
                    </address>
                    <span className="fw-medium text-primary">
                      {formatedDate(data?.created_at, true)}
                    </span>
                  </div>
                  <Image
                    src="/assets/images/logo-color.png"
                    alt="Logo"
                    width={80}
                    height={0}
                    className="img-fluid"
                    style={{ height: "auto" }}
                  />
                </div>
                <div className="mb-4">
                  <h3 className="m-0">
                    Permohonan {isPenelitian ? "Penelitian" : "Informasi"}{" "}
                    <span className="badge badge-info rounded-pill">
                      {data?.status}
                    </span>
                  </h3>
                </div>

                <div className="row justify-content-between mb-4 mb-md-5">
                  <div className="col-sm">
                    <h6>
                      Detail Permohonan{" "}
                      {isPenelitian ? "Penelitian" : "Informasi"} :
                    </h6>
                    <div>
                      <div>Via {data?.platform || "Website"}</div>
                      {isPenelitian ? (
                        <>
                          <div>
                            <strong>Judul Penelitian</strong> :{" "}
                            {data?.judul || "-"}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <strong>Rincian Informasi</strong> :{" "}
                            {data?.rincian || "-"}
                          </div>
                        </>
                      )}
                      <div>
                        <strong>Tujuan</strong> : {data?.tujuan || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm col-lg-5">
                    <dl className="row text-sm-end">
                      <dt className="col-6">
                        <strong className="fw-semibold text-dark">
                          Tipe Pemohon
                        </strong>
                      </dt>
                      <dd className="col-6 text-end">{data?.tipe || "-"}</dd>

                      {isPenelitian ? (
                        <>
                          <dt className="col-6">
                            <strong className="fw-semibold text-dark">
                              Tanggal Penelitian
                            </strong>
                          </dt>
                          <dd className="col-6 text-end">
                            {formatedDate(data?.tanggal)}
                          </dd>
                        </>
                      ) : (
                        <>
                          <dt className="col-6">
                            <strong className="fw-semibold text-dark">
                              Cara memperoleh
                            </strong>
                          </dt>
                          <dd className="col-6 text-end">
                            {data?.cara_terima}
                          </dd>

                          <dt className="col-6">
                            <strong className="fw-semibold text-dark">
                              Berupa
                            </strong>
                          </dt>
                          <dd className="col-6 text-end">
                            {data?.cara_dapat || "-"}
                          </dd>
                        </>
                      )}
                    </dl>
                  </div>
                </div>

                <div>
                  <h4>
                    Jawaban Permohonan{" "}
                    {isPenelitian ? "Penelitian" : "Informasi"}
                  </h4>
                  {data?.[keyJawaban]?.length === 0 && (
                    <Alert>Belum Ada Jawaban</Alert>
                  )}

                  {data?.[keyJawaban]?.length !== 0 && (
                    <table className="table table-striped mb-0">
                      <thead className="bg-light border-top">
                        <tr>
                          <th scope="col" className="border-0 text-start">
                            Jawaban
                          </th>
                          <th scope="col" className="border-0">
                            Pesan
                          </th>
                          <th scope="col" className="border-0">
                            Pemberitahuan
                          </th>
                          <th scope="col" className="border-0">
                            File {isPenelitian ? "Lainnya" : "Informasi"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.[keyJawaban]?.map((item) => {
                          const hasPemberitahuan = Boolean(
                            item?.file_surat_pemberitahuan
                          );
                          const hasInformasi = Boolean(item?.file_informasi);
                          return (
                            <tr key={item.id}>
                              <td data-label="Response">
                                <strong>{item?.jenis}</strong>
                                <br />
                                {formatedDate(item?.created_at)} <br />
                                {isPenelitian ? null : (
                                  <>
                                    Penguasaan Informasi :{" "}
                                    {item?.penguasaan || "-"}
                                    <br />
                                    Bentuk Fisik : {item?.bentuk_fisik || "-"}
                                    <br />
                                    Biaya: Rp. {item?.biaya || "0"}
                                    <br />
                                    Jangka Waktu: {item?.jangka_waktu ||
                                      "-"}{" "}
                                    Hari
                                    <br />
                                    Penghitaman : {item?.penghitaman || "-"}
                                    <br />
                                    Pengecualian : {item?.pengecualian || "-"}
                                    <br />
                                    Pasal : {item?.pasal || "-"}
                                    <br />
                                    Konsekuensi : {item?.konsekuensi || "-"}
                                  </>
                                )}
                              </td>
                              <td data-label="Pesan: ">{item?.pesan || "-"}</td>
                              <td data-label="Pemberitahuan: ">
                                <Link
                                  href={
                                    hasPemberitahuan
                                      ? `/api/services/file/uploads/${path_pemberitahuan}/${item.file_surat_pemberitahuan}`
                                      : "#"
                                  }
                                  {...(hasPemberitahuan && {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  })}
                                  scroll={false}
                                >
                                  <span
                                    className={
                                      hasPemberitahuan
                                        ? "badge badge-success"
                                        : "badge badge-secondary"
                                    }
                                  >
                                    {hasPemberitahuan ? "Lihat" : "No File"}
                                  </span>
                                </Link>
                              </td>
                              <td
                                data-label={`File ${
                                  isPenelitian ? "Lainnya" : "Informasi"
                                }: `}
                              >
                                <Link
                                  href={
                                    hasInformasi
                                      ? `/api/services/file/uploads/${path_informasi}/${item.file_informasi}`
                                      : "#"
                                  }
                                  {...(hasInformasi && {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  })}
                                  scroll={false}
                                >
                                  <span
                                    className={
                                      hasInformasi
                                        ? "badge badge-success"
                                        : "badge badge-secondary"
                                    }
                                  >
                                    {hasInformasi ? "Lihat" : "No File"}
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  <div className="d-flex justify-content-end text-right mb-4 py-4 border-bottom">
                    <div className="row justify-content-md-end mb-3">
                      <div className="col-md-8 col-lg-7">
                        <p>
                          Kamu akan mendapatkan notifikasi ketika terjadi
                          perubahan status, atau anda bisa melakukan pengecekan
                          kembali dihalaman ini.
                        </p>

                        <div className="no-print">
                          <p>
                            Penilaian dan testimoni kamu sangat berarti bagi
                            kami
                          </p>
                          <button
                            className="btn btn-sm fw-medium btn-primary no-print"
                            data-bs-toggle="modal"
                            data-bs-target="#testimoniModal"
                          >
                            Berikan Penilaian
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-small">
                    <div>
                      <h4 className="fw-semibold">Terimakasih!</h4>
                    </div>
                    <div>
                      <p>
                        Jika mempunyai pertanyaan, silakan hubungi kami pada
                        laman{" "}
                        <Link href="/seputar-ppid/lokasi-kontak">
                          <u>Kontak</u>
                        </Link>
                      </p>
                    </div>
                    <div>
                      © {new Date().getFullYear()} {appConfig.app.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="printInvoice d-block mt-4">
                <div className="d-flex align-items-center justify-content-center gap-2 w-100">
                  <button
                    className="btn btn-sm btn-outline-primary rounded-pill fw-medium"
                    onClick={reactToPrintFn}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FormTestimoni data={data} isPenelitian={isPenelitian} />
    </>
  );
}

export default DetailPage;
