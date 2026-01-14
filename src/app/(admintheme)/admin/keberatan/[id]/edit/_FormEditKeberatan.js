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
    return "✖ tidak ditemukan, otomatis email akan didaftarkan pada data pemohon, silakan upload beserta identitas jika ada";
  if (emailTerdaftar)
    return `✔ pemohon ditemukan dengan nama ${emailTerdaftar?.nama}`;
  return null;
}

function FormEditKeberatan({ data, admin, isMaster, defaultValues }) {
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
  } = useForm({ mode: "onChange", defaultValues: defaultValues });

  const email = watch("email");
  const status_file_pendukung = watch("status_file_pendukung");

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
    resetField("file_pendukung");
    setResetKey((prev) => prev + 1);
  }, [status_file_pendukung, resetField]);

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
        `/api/keberatan/${formDataRaw.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResetKey((prev) => prev + 1);
      resetField("file_pendukung");
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
        <Textinput
          label="Nomor Registrasi *"
          name="no_regis"
          id="no_regis"
          {...register("no_regis", { required: "Wajib Diisi" })}
          error={errors.no_regis}
        />

        <Select
          label="Penanggung Jawab"
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

        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Pengajuan *"
          rules={{ required: "Harus isi tanggal" }}
          error={errors.tanggal}
        />

        <Textinput
          label="Email Pemohon"
          name="email"
          id="email"
          type="email"
          {...register("email")}
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
          label="No. HP Pemohon"
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
          {...register("alasan", { required: "Masukan alasan" })}
          error={errors.alasan}
        />

        <Textarea
          label="Tujuan Pengajuan Keberatan *"
          name="tujuan"
          id="tujuan"
          {...register("tujuan", { required: "Harus memasukan tujuan" })}
          error={errors.tujuan}
        />

        <div className="flex flex-wrap space-xy-5">
          <Radio
            label="Biarkan File Sebelumnya"
            name="status_file_pendukung"
            value="keep"
            checked={status_file_pendukung === "keep"}
            {...register("status_file_pendukung", { required: true })}
          />
          <Radio
            label="Hapus File Sebelumnya"
            name="status_file_pendukung"
            value="delete"
            checked={status_file_pendukung === "delete"}
            {...register("status_file_pendukung", { required: true })}
          />
          <Radio
            label="Ganti File Sebelumnya"
            name="status_file_pendukung"
            value="change"
            checked={status_file_pendukung === "change"}
            {...register("status_file_pendukung", { required: true })}
          />
        </div>

        {status_file_pendukung === "change" ? (
          <Fileinputcontroller
            name="file_pendukung"
            id="file_pendukung"
            label="Upload File Pendukung"
            placeholder=""
            control={control}
            error={errors.file_pendukung}
            preview
            badge
            description="Upload ulang untuk mengganti file sebelumnya. Format boleh berupa gambar, PDF, Word, Excel, etc"
            maxFileSize={MAX_FILE_SIZE}
            rules={{ required: "File wajib diunggah" }}
            resetKey={resetKey}
          />
        ) : null}
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

export default FormEditKeberatan;
