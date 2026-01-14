"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import CheckInput from "@/components/ui/CheckInput";
import Dateinputcontroller from "@/components/ui/DateInputController";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FILE_SIZE } from "@/configs/appConfig";

function FormAddJawaban({
  permohonan_id,
  admin,
  isMaster,
  defaultValues,
  isModal = false,
}) {
  const router = useRouter();
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

  const bentuk_fisik = watch("bentuk_fisik");
  const jenis = watch("jenis");
  const penguasaan = watch("penguasaan");
  const whatsapped = watch("whatsapped");
  const mailed = watch("mailed");
  const status = watch("status");

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

      const res = await axios.post(
        `/api/permohonan/${permohonan_id}/jawaban`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      reset();
      setResetKey((prev) => prev + 1);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
      if (isModal) setTimeout(router.back, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
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
          {...register("status", { required: true })}
          error={errors.status}
          description="Edit Status Permohonan"
        />

        <Select
          label="Jenis Jawaban/Response"
          name="jenis"
          options={[
            { value: "Respon Awal", label: "Respon Awal" },
            { value: "Respon Lanjutan", label: "Respon Lanjutan" },
            { value: "Respon Final", label: "Respon Final" },
            { value: "Respon Perbaikan", label: "Respon Perbaikan" },
          ]}
          {...register("jenis", { required: "Pilih Jenis Respon" })}
          error={errors.jenis}
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
          placeholder={!admin ? "Memuat data..." : ""}
          disabled={!admin || !isMaster}
          {...register("admin_id", { required: "Wajib Dipilih" })}
          error={errors.admin_id}
        />

        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Tanggapan *"
          rules={{ required: "Harus isi tanggal" }}
          error={errors.tanggal}
        />

        {["Diberikan", "Diberikan Sebagian"].includes(status) ? (
          <>
            <div className="flex flex-wrap space-xy-5 pt-4">
              <span>Bentuk Jawaban Diberikan :</span>
              <div className="flex flex-wrap space-xy-5">
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

        {["Diberikan Sebagian", "Tidak Dapat Diberikan"].includes(status) ? (
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

        <Fileinputcontroller
          name="file_surat_pemberitahuan"
          id="file_surat_pemberitahuan"
          label="Upload File Surat Pemberitahuan"
          control={control}
          error={errors.file_surat_pemberitahuan}
          preview
          badge
          description="Pilih gambar/file surat pemberitahuan kepada pemohon (Optional), Format boleh berupa gambar, PDF, Word, Excel, etc"
          maxFileSize={MAX_FILE_SIZE}
          resetKey={resetKey}
        />

        <Fileinputcontroller
          name="file_informasi"
          id="file_informasi"
          label="Upload File Informasi"
          control={control}
          error={errors.file_informasi}
          preview
          badge
          description="Pilih gambar/file informasi jika ingin menyisipkan jawaban (Optional), Format boleh berupa gambar, PDF, Word, Excel, etc"
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
      </div>

      <Button
        type="submit"
        className="btn-gold w-full"
        isLoading={isSubmitting}
        text={"Simpan"}
      />
    </form>
  );
}

export default FormAddJawaban;
