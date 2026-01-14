"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Icon from "@/components/ui/Icon";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import SelectInputPublic from "@/components/front/input/SelectInputPublic";
import TextAreaPublic from "@/components/front/input/TextAreaPublic";
import FileInputPublic from "@/components/front/input/FileInputPublic";
import { MAX_FOTO_SIZE, MAX_FILE_SIZE } from "@/configs/appConfig";
import axios from "axios";
import { toast } from "react-toastify";
import LinkAuth from "@/components/front/LinkAuth";
import getRecaptchaToken from "@/utils/getRecaptchaToken";

function FormKeberatanPublik({ session }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: session?.email || "",
      nama: session?.nama || "",
      nomor_identitas: session?.nomor_identitas || "",
      kategori: "",
      identitas: null,
      telp: session?.telp || "",
      alamat: session?.alamat || "",
      alasan: "",
      tujuan: "",
      file_pendukung: null,
      agree: false,
    },
  });

  const agree = watch("agree");

  async function onSubmit(data) {
    try {
      const token = await getRecaptchaToken();
      const formData = new FormData();
      for (const key in data) {
        const value = data[key];
        if (value instanceof FileList || Array.isArray(value)) {
          Array.from(value).forEach((file) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value);
        }
      }
      formData.append("token", token);

      await axios.post("/api/publik/keberatan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      setResetKey((prev) => prev + 1);
      toast.success("Success");
      setIsSuccess(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row align-items-start">
          <div className="touch-block d-flex flex-column mb-4">
            <h2>Pengajuan Keberatan</h2>
            <p>Masukan Data Dengan Lengkap Pada Formulir Dibawah ini</p>
            <i className="text-xs">{`*) Wajib Diisi`}</i>
          </div>

          <div className="col-md-6">
            <TextInputPublic
              label="Email *"
              name="email"
              type="email"
              id="email"
              error={errors.email}
              {...register("email", {
                required: "Wajib Diisi",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format email tidak valid",
                },
              })}
            />
          </div>

          <div className="col-md-6">
            <SelectInputPublic
              label="Kategori Pemohon"
              name="kategori"
              id="kategori"
              options={[
                { value: "Perorangan", label: "Perorangan" },
                { value: "Kelompok", label: "Kelompok" },
                { value: "LSM/NGO", label: "LSM/NGO" },
                { value: "Instansi Pemerintah", label: "Instansi Pemerintah" },
                { value: "Lembaga Pemerintah", label: "Lembaga Pemerintah" },
                { value: "Lainnya", label: "Lainnya" },
              ]}
              {...register("kategori")}
            />
          </div>

          <div className="col-md-6">
            <TextInputPublic
              label="Nama Lengkap *"
              name="nama"
              id="nama"
              {...register("nama", { required: "Wajib Diisi" })}
              error={errors.nama}
            />
          </div>

          <div className="col-md-6">
            <TextInputPublic
              label="Nomor Handphone *"
              name="telp"
              id="telp"
              error={errors.telp}
              {...register("telp", {
                required: "Wajib Diisi",
                pattern: {
                  value: /^08[0-9]{8,11}$/,
                  message: "Format No HP tidak valid",
                },
              })}
            />
          </div>

          <div>
            <TextInputPublic
              label="Nomor Identitas *"
              name="nomor_identitas"
              id="nomor_identitas"
              error={errors.nomor_identitas}
              {...register("nomor_identitas", { required: "Wajib Diisi" })}
              description="(KTP/SIM/Paspor)"
            />
          </div>

          <FileInputPublic
            label="Upload Identitas *"
            name="identitas"
            id="identitas"
            accept="image/*"
            error={errors.identitas}
            preview
            maxFileSize={MAX_FOTO_SIZE}
            resetKey={resetKey}
            {...register("identitas", {
              required: "Wajib unggah identitas.",
              validate: {
                fileSize: (files) =>
                  !files?.[0] ||
                  files[0].size < MAX_FOTO_SIZE ||
                  `Maksimal ${Math.floor(MAX_FOTO_SIZE / 1024 / 1024)}MB`,
              },
            })}
            description={`Type Gambar Maksimal ${Math.floor(
              MAX_FOTO_SIZE / 1024 / 1024
            )}MB`}
          />

          <div>
            <TextAreaPublic
              label="Alamat Lengkap"
              name="alamat"
              id="alamat"
              {...register("alamat")}
            />
          </div>

          <div>
            <TextAreaPublic
              label="Alasan mengajukan keberatan *"
              name="alasan"
              id="alasan"
              {...register("alasan", { required: "Wajib Diisi" })}
              error={errors.alasan}
            />
          </div>

          <div>
            <TextAreaPublic
              label="Tujuan mengajukan keberatan *"
              name="tujuan"
              id="tujuan"
              {...register("tujuan", { required: "Wajib Diisi" })}
              error={errors.tujuan}
            />
          </div>

          <FileInputPublic
            label="Upload File Pendukung"
            name="file_pendukung"
            id="file_pendukung"
            error={errors.file_pendukung}
            preview
            description={`Maksimal ${Math.floor(
              MAX_FILE_SIZE / 1024 / 1024
            )}MB`}
            maxFileSize={MAX_FILE_SIZE}
            {...register("file_pendukung", {
              validate: {
                fileSize: (files) =>
                  !files?.[0] ||
                  files[0].size < MAX_FILE_SIZE ||
                  `Maksimal ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`,
              },
            })}
          />

          <div className="my-3">
            <div className="form-check">
              <input
                className="form-check-input h-5 w-5 shadow-sm  border-secondary rounded-sm focus:ring-0 focus:outline-none"
                type="checkbox"
                id="agree"
                checked={agree}
                {...register("agree", { required: true })}
              />
              <label className="form-check-label ml-2" htmlFor="agree">
                Dengan ini saya menyatakan bahwa data yang diisi dalam formulir
                ini adalah benar dan dapat dipertanggungjawabkan.
              </label>
            </div>
          </div>

          {isSuccess ? (
            <div className="mt-4">
              <div className="alert alert-primary text-center p-4" role="alert">
                <h5 className="mb-2 fw-bold">Berhasil mengajukan keberatan.</h5>
                <p className="mb-0">
                  Cek email dan WhatsApp Anda untuk bukti dan informasi
                  selanjutnya.
                </p>

                <div className="my-4">
                  <button
                    type="button"
                    className="btn btn-primary px-4 py-2"
                    onClick={() => setIsSuccess(false)}
                  >
                    OK
                  </button>
                </div>

                <LinkAuth section="keberatan" />
              </div>
            </div>
          ) : (
            <div className="form-group form-border">
              <button
                type="submit"
                className="btn fw-medium btn-primary"
                disabled={isSubmitting || !agree}
              >
                <Icon icon="solar:plain-2-broken" width="20" height="20" />
                &nbsp; {isSubmitting ? "Processing..." : "Ajukan Keberatan"}
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

export default FormKeberatanPublik;
