"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Dateinputcontroller from "@/components/ui/DateInputController";
import Fileinputcontroller from "@/components/ui/FileInputController";
import CheckInput from "@/components/ui/CheckInput";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
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

function FormAddPenelitian({ isMaster, admin, defaultValues }) {
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
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const tipe = watch("tipe");
  const email = watch("email");
  const jenis = watch("jenis");
  const whatsapped = watch("whatsapped");
  const mailed = watch("mailed");

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

      const res = await axios.post("/api/penelitian", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      reset();
      setResetKey((prev) => prev + 1);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <>
          <Dateinputcontroller
            control={control}
            name="tanggal"
            label="Tanggal Permohonan Penelitian *"
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
        </>

        <>
          <div className="py-4 border-y">
            <div className="text-xs my-10 text-center">
              Jawaban/Response <br />
              <i className="text-secondary">{`(Opsional)`}</i>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-1/2 space-y-3">
              <Select
                label="Jenis Jawaban/Response"
                name="jenis"
                options={[
                  { value: "Respon Awal", label: "Respon Awal" },
                  { value: "Respon Lanjutan", label: "Respon Lanjutan" },
                  { value: "Respon Final", label: "Respon Final" },
                  { value: "Respon Perbaikan", label: "Respon Perbaikan" },
                ]}
                placeholder="--Pilih Jenis Jawaban"
                {...register("jenis")}
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {jenis ? (
                <>
                  <Dateinputcontroller
                    control={control}
                    name="tanggal_jawaban"
                    label="Tanggal Jawaban/Response"
                  />
                </>
              ) : null}
            </div>
          </div>

          {jenis ? (
            <>
              <Fileinputcontroller
                name="file_surat_pemberitahuan"
                id="file_surat_pemberitahuan"
                label="Upload File Pendukung"
                placeholder="Optional"
                control={control}
                error={errors.file_surat_pemberitahuan}
                preview
                badge
                description="Format boleh berupa gambar, PDF, Word, Excel, etc"
                maxFileSize={MAX_FILE_SIZE}
                resetKey={resetKey}
              />

              <Fileinputcontroller
                name="file_informasi"
                id="file_informasi"
                label="Upload File Lainnya"
                placeholder="Optional"
                control={control}
                error={errors.file_informasi}
                preview
                badge
                description="Format boleh berupa gambar, PDF, Word, Excel, etc"
                maxFileSize={MAX_FILE_SIZE}
                resetKey={resetKey}
              />

              <Textarea
                label="Pesan"
                name="pesan"
                id="pesan"
                {...register("pesan")}
              />

              <div className="flex flex-wrap space-xy-5 pt-4">
                <CheckInput
                  label="Kirim Whatsapp Kepada Pemohon"
                  id="whatsapped"
                  name="whatsapped"
                  activeClass="ring-primary-500 bg-primary-500"
                  checked={whatsapped}
                  {...register("whatsapped")}
                />

                <CheckInput
                  label="Kirim Email Kepada Pemohon"
                  id="mailed"
                  name="mailed"
                  activeClass="ring-primary-500 bg-primary-500"
                  checked={mailed}
                  {...register("mailed")}
                />
              </div>
            </>
          ) : null}
        </>
      </div>

      <Button
        type="submit"
        className="btn-gold w-full"
        disabled={isSubmitting || isCheckingEmail}
        icon="gg:add"
        text={
          isSubmitting
            ? "Processing..."
            : isCheckingEmail
              ? "Cek Email Dulu..."
              : "Simpan Permohonan Informasi"
        }
      />
    </form>
  );
}

export default FormAddPenelitian;
