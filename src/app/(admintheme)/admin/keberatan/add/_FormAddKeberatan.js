"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Dateinputcontroller from "@/components/ui/DateInputController";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE, MAX_FILE_SIZE } from "@/configs/appConfig";

function getStatusIcon(email, isChecking, emailTerdaftar) {
  if (!email || email.trim() === "") return null;
  if (isChecking) return "⏳ mencari data pemohon by email ...";
  if (emailTerdaftar === false)
    return "✖ tidak ditemukan, otomatis email akan didaftarkan pada data pemohon, silakan upload beserta identitas jika ada";
  if (emailTerdaftar)
    return `✔ pemohon ditemukan dengan nama ${emailTerdaftar?.nama}`;
  return null;
}

function FormAddKeberatan({ admin, isMaster, defaultValues }) {
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
    reset,
  } = useForm({ mode: "onChange", defaultValues: defaultValues });

  const email = watch("email");

  async function cekEmailTerdaftar(e) {
    const emailInput = e.target.value.trim();
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
        const data = res.data;
        setEmailTerdaftar(res.data);
        reset((prev) => ({
          ...prev,
          nama: data.nama || "",
          nomor_identitas: data.nomor_identitas || "",
          telp: data.telp || "",
          alamat: data.alamat || "",
        }));
      } else {
        setEmailTerdaftar(false);
        reset((prev) => ({
          ...prev,
          nama: "",
          nomor_identitas: "",
          telp: "",
          alamat: "",
        }));
      }
    } catch (error) {
      setEmailTerdaftar(null);
      toast.error("Gagal cek email pemohon.");
    } finally {
      setIsCheckingEmail(false);
    }
  }

  async function onSubmit(data) {
    try {
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

      const res = await axios.post("/api/keberatan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      setResetKey((prev) => prev + 1);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Pengajuan *"
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
          label="Email Pemohon"
          name="email"
          id="email"
          type="email"
          {...register("email")}
          onBlur={cekEmailTerdaftar}
          error={errors.email}
          description={getStatusIcon(email, isCheckingEmail, emailTerdaftar)}
        />

        <Textinput
          label="Nama Pemohon *"
          name="nama"
          id="nama"
          {...register("nama", { required: "Harus Isi Nama Pemohon" })}
          error={errors.nama}
        />

        <Textinput
          label="Nomor Identitas *"
          name="nomor_identitas"
          id="nomor_identitas"
          {...register("nomor_identitas", {
            required: "Harus Isi Nomor Identitas",
          })}
          error={errors.nomor_identitas}
          description="(KTP/SIM/Paspor)"
        />

        <Select
          label="Kategori Pemohon *"
          name="kategori"
          options={[
            { value: "Perorangan", label: "Perorangan" },
            { value: "Kelompok", label: "Kelompok" },
            { value: "LSM/NGO", label: "LSM/NGO" },
            { value: "Instansi Pemerintah", label: "Instansi Pemerintah" },
            { value: "Lembaga Pemerintah", label: "Lembaga Pemerintah" },
            { value: "Lainnya", label: "Lainnya" },
          ]}
          placeholder="--Pilih Kategori Pemohon"
          {...register("kategori", { required: "Pilih Salah Satu Kategori" })}
          error={errors.kategori}
        />

        {Boolean(email) && !Boolean(emailTerdaftar) ? (
          <Fileinputcontroller
            accept="image/*"
            name="identitas"
            id="identitas"
            label="Upload Identitas Pemohon"
            placeholder="Opsional"
            control={control}
            error={errors.identitas}
            preview
            badge
            description="Hanya berupa gambar"
            maxFileSize={MAX_FOTO_SIZE}
            resetKey={resetKey}
          />
        ) : null}

        <Textinput
          label="Telp/HP"
          name="telp"
          id="telp"
          {...register("telp")}
        />

        <Textarea
          label="Alamat Pemohon"
          name="alamat"
          id="alamat"
          {...register("alamat")}
        />

        <Textarea
          label="Alasan Pengajuan Keberatan *"
          name="alasan"
          id="alasan"
          {...register("alasan", { required: true })}
          error={errors.alasan}
        />

        <Textarea
          label="Tujuan Pengajuan Keberatan *"
          name="tujuan"
          id="tujuan"
          {...register("tujuan", { required: true })}
          error={errors.tujuan}
        />

        <Fileinputcontroller
          name="file_pendukung"
          id="file_pendukung"
          label="Upload File Pendukung"
          placeholder="Opsional"
          control={control}
          error={errors.file_pendukung}
          preview
          badge
          description="Format boleh berupa gambar, PDF, Word, Excel, etc"
          maxFileSize={MAX_FILE_SIZE}
          resetKey={resetKey}
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

export default FormAddKeberatan;
