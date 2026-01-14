"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE } from "@/configs/appConfig";

function FormAddSlider({ headers }) {
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
      judul: "",
      deskripsi: "",
      link: "",
      urutan: "",
      is_active: "",
      file: null,
    },
  });

  async function onSubmit(data) {
    const noFile = !data.file || data.file.length === 0;
    if (noFile) {
      toast.error("Upload File.");
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

      const res = await axios.post("/api/slider", formData, {
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
        <Textinput
          label="Urutan Slider *"
          name="urutan"
          id="urutan"
          type="number"
          {...register("urutan", { required: "Harus Isi" })}
          error={errors.urutan}
        />

        <Textinput
          label="Judul *"
          name="judul"
          id="judul"
          {...register("judul", { required: "Harus Isi" })}
          error={errors.judul}
        />

        <Textarea
          label="Deskripsi *"
          name="deskripsi"
          id="deskripsi"
          {...register("deskripsi", { required: "Wajib Diisi" })}
          error={errors.deskripsi}
        />

        <Textinput
          label="Link"
          name="link"
          id="link"
          placeholder="Link Tujuan jika pengunjung melakukan klik"
          {...register("link", { required: "Wajib Diisi" })}
          error={errors.link}
        />

        <Fileinputcontroller
          accept="image/*"
          name="file"
          id="file"
          label="Upload Tampilan Slider"
          placeholder="Pilih gambar..."
          control={control}
          error={errors.file}
          preview
          badge
          description="Hanya berupa gambar"
          maxFileSize={MAX_FOTO_SIZE}
          resetKey={resetKey}
          rules={{ required: "File wajib diunggah" }}
        />
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}

export default FormAddSlider;
