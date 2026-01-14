"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/TextInput";
import Select from "@/components/ui/Select";
import Radio from "@/components/ui/Radio";
import Button from "@/components/ui/Button";
import Fileinputcontroller from "@/components/ui/FileInputController";
import { MAX_FILE_SIZE } from "@/configs/appConfig";

function FormEditLaporan({ data, headers, kategori }) {
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
    defaultValues: {
      header_id: data?.header_id || "",
      label: data?.label || "",
      link: data?.link || "",
      file: null,
      status_file: "keep",
    },
  });

  const status_file = watch("status_file");

  useEffect(() => {
    resetField("file");
    setResetKey((prev) => prev + 1);
  }, [status_file, resetField]);

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
        `/api/laporan/${kategori}/${data.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResetKey((prev) => prev + 1);
      resetField("file");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <Select
          label="Header"
          name="header_id"
          options={
            Array.isArray(headers)
              ? headers.map((item) => ({
                  value: item.id,
                  label: item.label,
                }))
              : []
          }
          placeholder={!headers ? "Memuat data..." : "Pilih Header Peraturan"}
          disabled={!headers}
          {...register("header_id")}
        />

        <Textinput
          label="Judul Peraturan"
          name="label"
          id="label"
          placeholder="Masukan Judul atau Nama Peraturan"
          {...register("label", { required: "Harus Isi" })}
          error={errors.label}
        />

        <Textinput
          label="Link File"
          name="link"
          id="link"
          placeholder="Masukan Link Lokasi File Peraturan"
          {...register("link")}
        />

        <div className="flex flex-wrap space-xy-5">
          <Radio
            label="Biarkan File Sebelumnya"
            name="status_file"
            value="keep"
            checked={status_file === "keep"}
            {...register("status_file", { required: true })}
          />
          <Radio
            label="Hapus File Sebelumnya"
            name="status_file"
            value="delete"
            checked={status_file === "delete"}
            {...register("status_file", { required: true })}
          />
          <Radio
            label="Ganti File Sebelumnya"
            name="status_file"
            value="change"
            checked={status_file === "change"}
            {...register("status_file", { required: true })}
          />
        </div>

        {status_file === "change" ? (
          <Fileinputcontroller
            name="file"
            id="file"
            label="Upload File Peraturan"
            placeholder="Pilih gambar/file Peraturan"
            control={control}
            error={errors.file}
            preview
            badge
            description="Format boleh berupa gambar, PDF, Word, Excel, etc"
            maxFileSize={MAX_FILE_SIZE}
            rules={{ required: "File wajib diunggah" }}
            resetKey={resetKey}
          />
        ) : null}
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}

export default FormEditLaporan;
