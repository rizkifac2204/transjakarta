"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Select from "@/components/ui/Select";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FILE_SIZE } from "@/configs/appConfig";

function FormAddLaporan({ kategori, headers }) {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm({
    defaultValues: {
      header_id: "",
      label: "",
      link: "",
      file: null,
    },
  });

  async function onSubmit(data) {
    const noLink = !data.link?.trim();
    const noFile = !data.file || data.file.length === 0;

    if (noLink && noFile) {
      toast.error("Minimal isi Link atau Upload File.");
      return;
    }

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

      const res = await axios.post(`/api/laporan/${kategori}`, formData, {
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
          placeholder={!headers ? "Memuat data..." : "Pilih Header Laporan"}
          disabled={!headers}
          {...register("header_id")}
        />

        <Textinput
          label="Judul Laporan *"
          name="label"
          id="label"
          placeholder="Masukan Judul atau Nama Laporan"
          {...register("label", { required: "Harus Isi" })}
          error={errors.label}
        />

        <Textinput
          label="Link File"
          name="link"
          id="link"
          placeholder="Masukan Link Lokasi File Laporan"
          {...register("link")}
        />

        <Fileinputcontroller
          name="file"
          id="file"
          label="Upload File Laporan"
          placeholder="Pilih gambar/file Laporan"
          control={control}
          error={errors.file}
          preview
          badge
          description="Format boleh berupa gambar, PDF, Word, Excel, etc"
          maxFileSize={MAX_FILE_SIZE}
          resetKey={resetKey}
        />
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}

export default FormAddLaporan;
