"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Icon from "@/components/ui/Icon";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import SelectInputPublic from "@/components/front/input/SelectInputPublic";
import TextAreaPublic from "@/components/front/input/TextAreaPublic";
import FileInputPublic from "@/components/front/input/FileInputPublic";
import { MAX_FOTO_SIZE, MAX_FILE_SIZE } from "@/configs/appConfig";
import axios from "axios";
import { toast } from "react-toastify";
import getRecaptchaToken from "@/utils/getRecaptchaToken";

function FormPermohonanPublik({ session }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    resetField,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: session?.email || "",
      tipe: "",
      rincian: "",
      tujuan: "",
      cara_dapat: "",
      telp: session?.telp || "",
      cara_terima: "",
      identitas: null,
      file_pendukung: null,
    },
  });

  const cara_dapat = watch("cara_dapat");

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

      const res = await axios.post("/api/publik/permohonan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const tiket = res?.data?.data?.tiket;
      toast.success(res?.data?.message || "Berhasil mengajukan permohonan");
      setTimeout(() => {
        router.push(`/form/result?tiket=${encodeURIComponent(tiket)}`);
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row align-items-start">
        <div className="touch-block d-flex flex-column mb-4">
          <h2>Permohonan Informasi</h2>
          <p>Masukan Data Dengan Lengkap Pada Formulir Dibawah ini</p>
          <i className="text-xs">{`*) Wajib Diisi`}</i>
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="Email Pemohon *"
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
            label="Pilih Type Pemohon *"
            name="tipe"
            id="tipe"
            options={[
              { value: "Pribadi", label: "Pribadi" },
              { value: "Lembaga", label: "Lembaga" },
            ]}
            {...register("tipe", { required: "Wajib Dipilih" })}
            error={errors.tipe}
          />
        </div>

        <div>
          <TextAreaPublic
            label="Rincian Permohonan *"
            placeholder="Jelaskan rincian Permohoan yang kamu minta"
            name="rincian"
            id="rincian"
            {...register("rincian", { required: "Wajib Diisi" })}
            error={errors.rincian}
          />
        </div>

        <div>
          <TextAreaPublic
            label="Tujuan Permohonan *"
            placeholder="Jelaskan tujuan kamu terkait permohonan"
            name="tujuan"
            id="tujuan"
            {...register("tujuan", { required: "Wajib Diisi" })}
            error={errors.tujuan}
          />
        </div>

        <div className="col-md-6">
          <SelectInputPublic
            label="Cara Memperoleh *"
            name="cara_dapat"
            id="cara_dapat"
            options={[
              {
                value: "Mendapatkan Salinan Informasi (Soft/Hard Copy)",
                label: "Mendapatkan Salinan Informasi (Soft/Hard Copy)",
              },
              {
                value: "Melihat/Membaca/Mencatat/Mendengarkan",
                label: "Melihat/Membaca/Mencatat/Mendengarkan",
              },
            ]}
            {...register("cara_dapat", { required: "Wajib Dipilih" })}
            error={errors.cara_dapat}
          />
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="No. Handphone *"
            name="telp"
            id="telp"
            type="tel"
            placeholder="08xxxxxxxxxx"
            pattern="08[0-9]{8,11}"
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

        {cara_dapat === "Mendapatkan Salinan Informasi (Soft/Hard Copy)" ? (
          <div className="col-md-6">
            <SelectInputPublic
              label="Cara Mendapatkan Salinan *"
              name="cara_terima"
              id="cara_terima"
              options={[
                { value: "Mengambil Langsung", label: "Mengambil Langsung" },
                { value: "Email", label: "Email" },
                { value: "Aplikasi", label: "Aplikasi" },
              ]}
              {...register("cara_terima", { required: "Wajib Dipilih" })}
              error={errors.cara_terima}
            />
          </div>
        ) : null}

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

        <FileInputPublic
          label="Upload File Pendukung"
          name="file_pendukung"
          id="file_pendukung"
          error={errors.file_pendukung}
          preview
          description={`Maksimal ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`}
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

        <div>
          <div className="form-group form-border">
            <button
              type="submit"
              className="btn fw-medium btn-primary"
              disabled={isSubmitting}
            >
              <Icon icon="solar:plain-2-broken" width="20" height="20" />
              &nbsp; {isSubmitting ? "Processing..." : "Ajukan Permohonan"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FormPermohonanPublik;
