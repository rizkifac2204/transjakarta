"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Dateinputcontroller from "@/components/ui/DateInputController";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import Radio from "@/components/ui/Radio";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FILE_SIZE } from "@/configs/appConfig";

function FormEditJawaban({ admin, isMaster, defaultValues, isModal = false }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    resetField,
  } = useForm({
    defaultValues: defaultValues,
  });

  const jenis = watch("jenis");
  const status_file_surat_pemberitahuan = watch(
    "status_file_surat_pemberitahuan"
  );
  const status_file_informasi = watch("status_file_informasi");

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
        `/api/penelitian/${formDataRaw.penelitian_id}/jawaban/${formDataRaw?.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResetKey((prev) => prev + 1);
      resetField("file_surat_pemberitahuan");
      resetField("file_informasi");
      toast.success(res?.data?.message || "Berhasil mengupdate data.");
      router.refresh();
      if (isModal) setTimeout(router.back, 1000);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Terjadi Kesalahan Saat Mengupdate"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
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
          {...register("jenis", { required: "Pilih Jenis Respon" })}
          error={errors.jenis}
        />

        <Dateinputcontroller
          control={control}
          name="tanggal"
          label="Tanggal Tanggapan *"
          rules={{ required: "Harus isi tanggal" }}
          error={errors.tanggal}
        />

        <div className="flex flex-wrap space-xy-5 pt-4">
          <Radio
            label="Biarkan File Pendukung"
            name="status_file_surat_pemberitahuan"
            value="keep"
            checked={status_file_surat_pemberitahuan === "keep"}
            {...register("status_file_surat_pemberitahuan", { required: true })}
          />
          <Radio
            label="Hapus File Pendukung"
            name="status_file_surat_pemberitahuan"
            value="delete"
            checked={status_file_surat_pemberitahuan === "delete"}
            {...register("status_file_surat_pemberitahuan", { required: true })}
          />
          <Radio
            label="Ganti File Pendukung"
            name="status_file_surat_pemberitahuan"
            value="change"
            checked={status_file_surat_pemberitahuan === "change"}
            {...register("status_file_surat_pemberitahuan", { required: true })}
          />
        </div>

        {status_file_surat_pemberitahuan === "change" ? (
          <Fileinputcontroller
            name="file_surat_pemberitahuan"
            id="file_surat_pemberitahuan"
            label="Upload File Pendukung"
            placeholder="Pilih gambar/file..."
            control={control}
            error={errors.file_surat_pemberitahuan}
            preview
            badge
            description="Format boleh berupa gambar, PDF, Word, Excel, etc"
            maxFileSize={MAX_FILE_SIZE}
            resetKey={resetKey}
            rules={{ required: "File wajib diunggah" }}
          />
        ) : null}

        <hr />

        <div className="flex flex-wrap space-xy-5 pt-4">
          <Radio
            label="Biarkan File Lainnya"
            name="status_file_informasi"
            value="keep"
            checked={status_file_informasi === "keep"}
            {...register("status_file_informasi", { required: true })}
          />
          <Radio
            label="Hapus File Lainnya"
            name="status_file_informasi"
            value="delete"
            checked={status_file_informasi === "delete"}
            {...register("status_file_informasi", { required: true })}
          />
          <Radio
            label="Ganti File Lainnya"
            name="status_file_informasi"
            value="change"
            checked={status_file_informasi === "change"}
            {...register("status_file_informasi", { required: true })}
          />
        </div>

        {status_file_informasi === "change" ? (
          <Fileinputcontroller
            name="file_informasi"
            id="file_informasi"
            label="Upload File Lainnya"
            placeholder="Pilih gambar/file..."
            control={control}
            error={errors.file_informasi}
            preview
            badge
            description="Format boleh berupa gambar, PDF, Word, Excel, etc"
            maxFileSize={MAX_FILE_SIZE}
            resetKey={resetKey}
            rules={{ required: "File wajib diunggah" }}
          />
        ) : null}

        <Textarea
          label="Pesan"
          name="pesan"
          id="pesan"
          placeholder="Masukan Pesan"
          {...register("pesan")}
        />
      </div>

      <Button
        type="submit"
        className="btn-gold w-full"
        isLoading={isSubmitting}
        text={"Edit"}
      />
    </form>
  );
}

export default FormEditJawaban;
