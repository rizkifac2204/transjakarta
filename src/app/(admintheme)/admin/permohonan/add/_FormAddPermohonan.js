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
    return "✖ tidak ditemukan, otomatis email akan didaftarkan pada data pemohon, silakan upload beserta identitas jika ada";
  if (emailTerdaftar)
    return `✔ pemohon ditemukan dengan nama ${emailTerdaftar?.nama}`;
  return null;
}

function FormAddPermohonan({ isMaster, admin, defaultValues }) {
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
  const bentuk_fisik = watch("bentuk_fisik");
  const penguasaan = watch("penguasaan");
  const status = watch("status");
  const jenis = watch("jenis");
  const cara_dapat = watch("cara_dapat");
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

      const res = await axios.post("/api/permohonan", formData, {
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

          <Textarea
            label="Rincian Informasi Yang Dibutuhkan *"
            name="rincian"
            id="rincian"
            {...register("rincian", { required: "Wajib Diisi" })}
            error={errors.rincian}
          />

          <Textarea
            label="Tujuan Memperoleh Informasi *"
            name="tujuan"
            id="tujuan"
            {...register("tujuan", { required: "Wajib Diisi" })}
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
            {...register("cara_dapat", { required: "Wajib Dipilih" })}
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
              {...register("cara_terima", { required: "Wajib Dipilih" })}
              error={errors.cara_terima}
            />
          ) : null}

          {Boolean(email) && !Boolean(emailTerdaftar) ? (
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
          ) : null}

          <Fileinputcontroller
            name="file_pendukung"
            id="file_pendukung"
            label="Upload File Pendukung"
            placeholder="Pilih gambar/file..."
            control={control}
            error={errors.file_pendukung}
            preview
            badge
            description="Format boleh berupa gambar, PDF, Word, Excel, etc"
            maxFileSize={MAX_FILE_SIZE}
            resetKey={resetKey}
          />

          <Select
            label="Status *"
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

              {jenis ? (
                <>
                  <Dateinputcontroller
                    control={control}
                    name="tanggal_jawaban"
                    label="Tanggal Jawaban/Response"
                  />
                  {["Diberikan", "Diberikan Sebagian"].includes(status) ? (
                    <>
                      <div className="flex flex-wrap space-xy-5 pt-4">
                        <span>Bentuk Jawaban Diberikan :</span>
                        <Radio
                          label="Softcopy"
                          name="bentuk_fisik"
                          value="Softcopy"
                          checked={bentuk_fisik === "Softcopy"}
                          {...register("bentuk_fisik")}
                        />
                        <Radio
                          label="Hardcopy"
                          name="bentuk_fisik"
                          value="Hardcopy"
                          checked={bentuk_fisik === "Hardcopy"}
                          {...register("bentuk_fisik")}
                        />
                      </div>

                      <Textinput
                        label="Biaya"
                        name="biaya"
                        id="biaya"
                        type="number"
                        {...register("biaya")}
                        min="0"
                      />

                      {["Respon Final"].includes(jenis) ? (
                        <Textinput
                          label="Jangka Waktu Jawaban (Hari)"
                          name="jangka_waktu"
                          id="jangka_waktu"
                          type="number"
                          description="Jangka Waktu Antara Permohonan Dibuat Sampai Diberikan (Hari)"
                          {...register("jangka_waktu")}
                          min="0"
                        />
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>

            {jenis ? (
              <div className="w-full lg:w-1/2 space-y-3">
                {["Diberikan Sebagian"].includes(status) ? (
                  <>
                    <Textinput
                      label="Penjelasan Penghitaman"
                      name="penghitaman"
                      id="penghitaman"
                      description="Penjelasan diberikan sebagian"
                      {...register("penghitaman")}
                    />
                  </>
                ) : null}

                {["Diberikan Sebagian", "Tidak Dapat Diberikan"].includes(
                  status
                ) ? (
                  <>
                    <div className="flex flex-wrap space-xy-5 pt-4">
                      <span>Penguasaan Informasi :</span>
                      <Radio
                        label="KP2MI"
                        name="penguasaan"
                        value="KP2MI"
                        checked={penguasaan === "KP2MI"}
                        {...register("penguasaan")}
                      />

                      <Radio
                        label="Instansi Lainnya"
                        name="penguasaan"
                        value="Instansi Lainnya"
                        checked={penguasaan === "Instansi Lainnya"}
                        {...register("penguasaan")}
                      />
                    </div>

                    <Textinput
                      label="Dasar Pengecualian"
                      name="pengecualian"
                      id="pengecualian"
                      description="Dasar Pengecualian Tidak Dapat Diberikan"
                      {...register("pengecualian")}
                    />
                  </>
                ) : null}

                {["Tidak Dapat Diberikan"].includes(status) ? (
                  <>
                    <Textinput
                      label="Pasal"
                      name="pasal"
                      id="pasal"
                      {...register("pasal")}
                    />

                    <Textinput
                      label="Konsekuensi"
                      name="konsekuensi"
                      id="konsekuensi"
                      {...register("konsekuensi")}
                    />
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          {jenis ? (
            <>
              <Fileinputcontroller
                name="file_surat_pemberitahuan"
                id="file_surat_pemberitahuan"
                label="Upload File Surat Pemberitahuan"
                placeholder="(Optional)"
                control={control}
                error={errors.file_surat_pemberitahuan}
                preview
                badge
                description="Format boleh berupa gambar, PDF, Word, Excel, etc"
                maxFileSize={MAX_FILE_SIZE}
                resetKey={resetKey}
              />

              {["Diberikan", "Diberikan Sebagian"].includes(status) ? (
                <>
                  <Fileinputcontroller
                    name="file_informasi"
                    id="file_informasi"
                    label="Upload File Informasi"
                    placeholder="(Optional)"
                    control={control}
                    error={errors.file_informasi}
                    preview
                    badge
                    description="Format boleh berupa gambar, PDF, Word, Excel, etc"
                    maxFileSize={MAX_FILE_SIZE}
                    resetKey={resetKey}
                  />
                </>
              ) : null}

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

export default FormAddPermohonan;
