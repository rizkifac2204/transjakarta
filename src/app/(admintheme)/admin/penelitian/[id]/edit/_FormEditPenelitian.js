"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Radio from "@/components/ui/Radio";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Dateinputcontroller from "@/components/ui/DateInputController";
import Fileinputcontroller from "@/components/ui/FileInputController";
import { MAX_FOTO_SIZE, MAX_FILE_SIZE } from "@/configs/appConfig";

function getStatusIcon(email, isChecking, emailTerdaftar) {
  if (!email || email.trim() === "") return null;
  if (isChecking) return "⏳ mencari data pemohon by email ...";
  if (emailTerdaftar === false)
    return "✖ tidak ditemukan, otomatis email akan didaftarkan pada data pemohon, silakan lengkapi data dan upload identitas jika ada";
  if (emailTerdaftar)
    return `✔ pemohon ditemukan dengan nama ${emailTerdaftar?.nama}`;
  return null;
}

function FormEditPenelitian({ data, admin, isMaster, defaultValues }) {
  const router = useRouter();
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailTerdaftar, setEmailTerdaftar] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    resetField,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const email = watch("email");
  const tipe = watch("tipe");
  const status_file_permohonan = watch("status_file_permohonan");
  const status_file_proposal = watch("status_file_proposal");
  const status_file_pertanyaan = watch("status_file_pertanyaan");

  async function cekEmailTerdaftar(e) {
    const emailInput = e.target?.value?.trim?.() || e?.trim?.();
    if (!emailInput) {
      setEmailTerdaftar(null);
      return;
    }

    try {
      setIsCheckingEmail(true);
      const res = await axios.get(
        `/api/pemohon/cek-email?email=${encodeURIComponent(emailInput)}`
      );

      if (res?.data) {
        setEmailTerdaftar(res.data);
      } else {
        setEmailTerdaftar(false);
      }
    } catch (error) {
      setEmailTerdaftar(null);
      toast.error("Gagal cek email pemohon.");
    } finally {
      setIsCheckingEmail(false);
    }
  }

  useEffect(() => {
    if (data?.email) {
      cekEmailTerdaftar(data.email);
    }
  }, [data?.email]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (email && email !== data?.email) {
        cekEmailTerdaftar(email);
      } else if (!email) {
        setEmailTerdaftar(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [email, data?.email]);

  useEffect(() => {
    resetField("file_permohonan");
    resetField("file_proposal");
    resetField("file_pertanyaan");
    setResetKey((prev) => prev + 1);
  }, [resetField]);

  async function onSubmit(formDataRaw) {
    try {
      const formData = new FormData();

      for (const key in formDataRaw) {
        const value = formDataRaw[key];
        if (value instanceof FileList || Array.isArray(value)) {
          Array.from(value).forEach((file) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value);
        }
      }

      const res = await axios.patch(
        `/api/penelitian/${formDataRaw.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResetKey((prev) => prev + 1);
      resetField("file_permohonan");
      resetField("file_proposal");
      resetField("file_pertanyaan");
      resetField("status_file_permohonan");
      resetField("status_file_proposal");
      resetField("status_file_pertanyaan");
      toast.success(res?.data?.message || "Berhasil mengupdate data.");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Terjadi Kesalahan Saat Mengupdate"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Permohonan *"
          rules={{ required: "Harus isi tanggal" }}
          error={errors.tanggal}
        />

        <Textinput
          label="Nomor Registrasi *"
          name="no_regis"
          id="no_regis"
          {...register("no_regis", { required: "Wajib Diisi" })}
          error={errors.no_regis}
        />

        <Select
          label="Penanggung Jawab *"
          name="admin_id"
          options={
            Array.isArray(admin)
              ? admin.map((item) => ({
                  value: item.id,
                  label: item.nama,
                }))
              : []
          }
          placeholder={
            !admin ? "Memuat data..." : "--Pilih Penanggung Jawab Permohonan"
          }
          disabled={!admin || !isMaster}
          {...register("admin_id", { required: "Wajib Dipilih" })}
          error={errors.admin_id}
        />

        <Textinput
          label="Email Pemohon Penelitian"
          name="email"
          id="email"
          type="email"
          {...register("email")}
          error={errors.email}
          description={getStatusIcon(email, isCheckingEmail, emailTerdaftar)}
        />

        <div className="flex flex-wrap space-xy-5 pt-4">
          <span>Kategori Pemohon :</span>
          <div className="flex flex-wrap space-xy-5">
            <Radio
              label="Perorangan"
              name="tipe"
              value="Perorangan"
              checked={tipe === "Perorangan"}
              {...register("tipe")}
            />
            <Radio
              label="Lembaga/Organisasi"
              name="tipe"
              value="Lembaga/Organisasi"
              checked={tipe === "Lembaga/Organisasi"}
              {...register("tipe")}
            />
          </div>
        </div>

        {Boolean(email) && !Boolean(emailTerdaftar) ? (
          <>
            <Textinput
              label="Nama Mahasiswa"
              name="nama"
              id="nama"
              {...register("nama")}
            />

            <Textinput
              label="No. Identitas"
              name="nomor_identitas"
              id="nomor_identitas"
              {...register("nomor_identitas")}
              description="KTP/SIM/Paspor"
            />

            <Textinput
              label="No. Induk Mahasiswa"
              name="nim"
              id="nim"
              {...register("nim")}
            />

            <Textinput
              label="Lembaga/Universitas"
              name="universitas"
              id="universitas"
              {...register("universitas")}
            />

            <Textinput
              label="Jurusan/Prodi"
              name="jurusan"
              id="jurusan"
              {...register("jurusan")}
            />

            <Fileinputcontroller
              accept="image/*"
              name="identitas"
              id="identitas"
              label="Upload Identitas Pemohon"
              placeholder="Pilih gambar..."
              control={control}
              error={errors.identitas}
              preview
              badge
              description="Hanya berupa gambar"
              maxFileSize={MAX_FOTO_SIZE}
              resetKey={resetKey}
            />
          </>
        ) : null}

        <Textarea
          label="Judul Penelitian *"
          name="judul"
          id="judul"
          {...register("judul", { required: "Wajib Diisi" })}
          error={errors.judul}
        />

        <Textarea
          label="Tujuan Penelitian *"
          name="tujuan"
          id="tujuan"
          {...register("tujuan", { required: "Wajib Diisi" })}
          error={errors.tujuan}
        />

        <>
          <div className="flex flex-wrap space-xy-5 pt-4">
            <Radio
              label="Biarkan File Permohonan"
              name="status_file_permohonan"
              value="keep"
              checked={status_file_permohonan === "keep"}
              {...register("status_file_permohonan", { required: true })}
            />
            <Radio
              label="Ganti File Permohonan"
              name="status_file_permohonan"
              value="change"
              checked={status_file_permohonan === "change"}
              {...register("status_file_permohonan", { required: true })}
            />
          </div>

          {status_file_permohonan === "change" ? (
            <Fileinputcontroller
              name="file_permohonan"
              id="file_permohonan"
              label="Upload Surat permohonan *"
              placeholder=""
              control={control}
              error={errors.file_permohonan}
              preview
              badge
              description="Upload Surat permohonan dari institusi perihal permohonan ijin penelitian ditujukan kepada PPID KP2MI/BP2MI; berisi minimal tujuan penlitian, nama peneliti, No kontak, judul penelitian dan lokus penelitian. Format boleh berupa gambar, PDF, Word, Excel, etc"
              maxFileSize={MAX_FILE_SIZE}
              resetKey={resetKey}
              rules={{ required: "File wajib diunggah" }}
            />
          ) : null}
        </>

        <>
          <div className="flex flex-wrap space-xy-5 pt-4">
            <Radio
              label="Biarkan File Proposal"
              name="status_file_proposal"
              value="keep"
              checked={status_file_proposal === "keep"}
              {...register("status_file_proposal", { required: true })}
            />
            <Radio
              label="Ganti File Proposal"
              name="status_file_proposal"
              value="change"
              checked={status_file_proposal === "change"}
              {...register("status_file_proposal", { required: true })}
            />
          </div>

          {status_file_proposal === "change" ? (
            <Fileinputcontroller
              name="file_proposal"
              id="file_proposal"
              label="Upload File Proposal Penelitian *"
              placeholder=""
              control={control}
              error={errors.file_proposal}
              preview
              badge
              description="Format boleh berupa gambar, PDF, Word, Excel, etc"
              maxFileSize={MAX_FILE_SIZE}
              resetKey={resetKey}
              rules={{ required: "File wajib diunggah" }}
            />
          ) : null}
        </>

        <>
          <div className="flex flex-wrap space-xy-5 pt-4">
            <Radio
              label="Biarkan File Pertanyaan"
              name="status_file_pertanyaan"
              value="keep"
              checked={status_file_pertanyaan === "keep"}
              {...register("status_file_pertanyaan", { required: true })}
            />
            <Radio
              label="Ganti File Pertanyaan"
              name="status_file_pertanyaan"
              value="change"
              checked={status_file_pertanyaan === "change"}
              {...register("status_file_pertanyaan", { required: true })}
            />
          </div>

          {status_file_pertanyaan === "change" ? (
            <Fileinputcontroller
              name="file_pertanyaan"
              id="file_pertanyaan"
              label="Upload Daftar Pertanyaan/Kuesioner *"
              placeholder=""
              control={control}
              error={errors.file_pertanyaan}
              preview
              badge
              description="Format boleh berupa gambar, PDF, Word, Excel, etc"
              maxFileSize={MAX_FILE_SIZE}
              resetKey={resetKey}
              rules={{ required: "File wajib diunggah" }}
            />
          ) : null}
        </>

        <Select
          label="Status Permohonan *"
          name="status"
          options={[
            { value: "Proses", label: "Proses" },
            { value: "Diberikan", label: "Diberikan" },
            {
              value: "Tidak Dapat Diberikan",
              label: "Tidak Dapat Diberikan",
            },
            { value: "Ditolak", label: "Ditolak" },
            { value: "Hold", label: "Hold" },
          ]}
          placeholder="--Pilih Status Permohonan"
          {...register("status", { required: true })}
          error={errors.status}
        />
      </div>

      <Button
        type="submit"
        className="btn-gold w-full"
        disabled={isSubmitting || isCheckingEmail}
      >
        {isSubmitting
          ? "Processing..."
          : isCheckingEmail
          ? "Cek Email Dulu..."
          : "Submit"}
      </Button>
    </form>
  );
}

export default FormEditPenelitian;
