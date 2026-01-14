"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Icon from "@/components/ui/Icon";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import SelectInputPublic from "@/components/front/input/SelectInputPublic";
import TextAreaPublic from "@/components/front/input/TextAreaPublic";
import DateInputPublic from "@/components/front/input/DateInputPublic";
import FileInputPublic from "@/components/front/input/FileInputPublic";
import { MAX_FOTO_SIZE, MAX_FILE_SIZE } from "@/configs/appConfig";
import axios from "axios";
import { toast } from "react-toastify";
import getRecaptchaToken from "@/utils/getRecaptchaToken";

function FormPenelitianPublik({ session }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: session?.email || "",
      judul: "",
      tujuan: "",
      tanggal: null,
      tipe: "",
      nomor_identitas: session?.nomor_identitas || "",
      nama: session?.nama || "",
      alamat: session?.alamat || "",
      telp: session?.telp || "",
      pekerjaan: session?.pekerjaan || "",
      universitas: session?.universitas || "",
      jurusan: session?.jurusan || "",
      nim: session?.nim || "",
      identitas: null,
      file_permohonan: null,
      file_proposal: null,
      file_pertanyaan: null,
    },
  });

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

      const res = await axios.post("/api/publik/penelitian", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const tiket = res?.data?.data?.tiket;
      toast.success(
        res?.data?.message || "Berhasil mengajukan permohonan Penelitian"
      );
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
          <h2>Permohonan Penelitian</h2>
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
          <TextInputPublic
            label="Nama Lengkap *"
            name="nama"
            id="nama"
            {...register("nama", { required: "Wajib Diisi" })}
            error={errors.nama}
          />
        </div>

        <div className="col-md-6">
          <SelectInputPublic
            label="Kategori Pemohon *"
            name="tipe"
            id="tipe"
            options={[
              { value: "Perorangan", label: "Perorangan" },
              { value: "Lembaga/Organisasi", label: "Lembaga/Organisasi" },
            ]}
            {...register("tipe", { required: "Wajib Dipilih" })}
            error={errors.tipe}
          />
        </div>

        <div className="col-md-6">
          <DateInputPublic
            control={control}
            name="tanggal"
            label="Tanggal Penelitian *"
            rules={{ required: "Harus isi tanggal" }}
            error={errors.tanggal}
          />
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="Nomor Identitas *"
            name="nomor_identitas"
            id="nomor_identitas"
            {...register("nomor_identitas", { required: "Wajib Diisi" })}
            error={errors.nomor_identitas}
            description={`(KTP/SIM/Paspor)`}
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

        <div className="col-md-6">
          <TextInputPublic
            label="Pekerjaan *"
            name="pekerjaan"
            id="pekerjaan"
            {...register("pekerjaan", { required: "Wajib Diisi" })}
            error={errors.pekerjaan}
          />
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="Lembaga/Universitas *"
            name="universitas"
            id="universitas"
            {...register("universitas", { required: "Wajib Diisi" })}
            error={errors.universitas}
          />
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="Jurusan/Prodi *"
            name="jurusan"
            id="jurusan"
            {...register("jurusan", { required: "Wajib Diisi" })}
            error={errors.jurusan}
          />
        </div>

        <div className="col-md-6">
          <TextInputPublic
            label="No. Induk Mahasiswa *"
            name="nim"
            id="nim"
            {...register("nim", { required: "Wajib Diisi" })}
            error={errors.nim}
          />
        </div>

        <div>
          <TextAreaPublic
            label="Alamat"
            name="alamat"
            id="alamat"
            {...register("tujuan")}
          />
        </div>

        <div>
          <TextAreaPublic
            label="Judul Penelitian *"
            name="judul"
            id="judul"
            {...register("judul", { required: "Wajib Diisi" })}
            error={errors.judul}
          />
        </div>

        <div>
          <TextAreaPublic
            label="Tujuan Penelitian *"
            name="tujuan"
            id="tujuan"
            {...register("tujuan", { required: "Wajib Diisi" })}
            error={errors.tujuan}
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

        <FileInputPublic
          label="Upload Permohonan *"
          name="file_permohonan"
          id="file_permohonan"
          error={errors.file_permohonan}
          preview
          description={`Upload Surat permohonan dari institusi perihal permohonan ijin penelitian ditujukan kepada PPID KP2MI/BP2MI; berisi minimal tujuan penlitian, nama peneliti, No kontak, judul penelitian dan lokus penelitian, Maksimal ${Math.floor(
            MAX_FILE_SIZE / 1024 / 1024
          )}MB`}
          maxFileSize={MAX_FILE_SIZE}
          {...register("file_permohonan", {
            required: "Wajib unggah.",
            validate: {
              fileSize: (files) =>
                !files?.[0] ||
                files[0].size < MAX_FILE_SIZE ||
                `Maksimal ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`,
            },
          })}
        />

        <FileInputPublic
          label="Upload Proposal *"
          name="file_proposal"
          id="file_proposal"
          error={errors.file_proposal}
          preview
          description={`Upload file Proposal Penelitian, Maksimal ${Math.floor(
            MAX_FILE_SIZE / 1024 / 1024
          )}MB`}
          maxFileSize={MAX_FILE_SIZE}
          {...register("file_proposal", {
            required: "Wajib unggah.",
            validate: {
              fileSize: (files) =>
                !files?.[0] ||
                files[0].size < MAX_FILE_SIZE ||
                `Maksimal ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`,
            },
          })}
        />

        <FileInputPublic
          label="Upload file Daftar Pertanyaan/Kuesioner *"
          name="file_pertanyaan"
          id="file_pertanyaan"
          error={errors.file_pertanyaan}
          preview
          description={`Maksimal ${Math.floor(MAX_FILE_SIZE / 1024 / 1024)}MB`}
          maxFileSize={MAX_FILE_SIZE}
          {...register("file_pertanyaan", {
            required: "Wajib unggah.",
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

export default FormPenelitianPublik;
