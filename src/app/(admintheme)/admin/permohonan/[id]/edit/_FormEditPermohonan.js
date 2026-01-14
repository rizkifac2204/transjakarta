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

function FormEditPermohonan({ data, admin, isMaster, defaultValues }) {
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
  const cara_dapat = watch("cara_dapat");
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
        `/api/permohonan/${formDataRaw.id}`,
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

        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Permohonan *"
          rules={{ required: "Harus isi tanggal" }}
          error={errors.tanggal}
        />

        <div className="flex flex-wrap space-xy-5 pt-4">
          <span>Tipe Pemohon :</span>
          <div className="flex flex-wrap space-xy-5">
            <Radio
              label="Pribadi"
              name="tipe"
              value="Pribadi"
              checked={tipe === "Pribadi"}
              {...register("tipe")}
            />
            <Radio
              label="Lembaga"
              name="tipe"
              value="Lembaga"
              checked={tipe === "Lembaga"}
              {...register("tipe")}
            />
          </div>
        </div>

        <Textinput
          label="Email Pemohon"
          name="email"
          id="email"
          type="email"
          {...register("email")}
          error={errors.email}
          description={getStatusIcon(email, isCheckingEmail, emailTerdaftar)}
        />

        <Textarea
          label="Rincian Informasi Yang Dibutuhkan *"
          name="rincian"
          id="rincian"
          {...register("rincian", {
            required: "Masukan Rincian Informasi Yang Dibutuhkan",
          })}
          error={errors.rincian}
        />

        <Textarea
          label="Tujuan Informasi *"
          name="tujuan"
          id="tujuan"
          {...register("tujuan", {
            required: "Masukan Tujuan Pemohon Mendapatkan Informasi",
          })}
          error={errors.tujuan}
        />

        <Select
          label="Cara Memperoleh *"
          name="cara_dapat"
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
          placeholder="--Pilih Cara Pemohon Memperoleh Informasi"
          {...register("cara_dapat", {
            required: "Pilih Cara Pemohon Memperoleh Informasi",
          })}
          error={errors.cara_dapat}
        />

        {cara_dapat === "Mendapatkan Salinan Informasi (Soft/Hard Copy)" ? (
          <Select
            label="Cara Mendapatkan Salinan *"
            name="cara_terima"
            options={[
              { value: "Mengambil Langsung", label: "Mengambil Langsung" },
              { value: "Email", label: "Email" },
              { value: "Aplikasi", label: "Aplikasi" },
            ]}
            placeholder="--Pilih Cara Pemohon Mendapatkan Informasi"
            {...register("cara_terima", {
              required: "Pilih Cara Pemohon Mendapatkan Salinan",
            })}
            error={errors.cara_terima}
          />
        ) : null}

        {email && emailTerdaftar === false ? (
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
          />
        ) : null}

        <div className="flex flex-wrap space-xy-5 pt-4">
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
            label="Upload File Pendukung *"
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

        <Select
          label="Status Permohonan *"
          name="status"
          options={[
            { value: "Proses", label: "Proses" },
            { value: "Diberikan", label: "Diberikan" },
            { value: "Diberikan Sebagian", label: "Diberikan Sebagian" },
            {
              value: "Tidak Dapat Diberikan",
              label: "Tidak Dapat Diberikan",
            },
            { value: "Sengketa", label: "Sengketa" },
            { value: "Ditolak", label: "Ditolak" },
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

export default FormEditPermohonan;
