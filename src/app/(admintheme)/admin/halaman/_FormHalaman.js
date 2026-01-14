"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Textinput from "@/components/ui/TextInput";
import Select from "@/components/ui/Select";
import QuillEditor from "@/components/ui/QuillEditor";
import Button from "@/components/ui/Button";

function FormHalaman({ slugOptions = [], defaultValues = {}, isEdit = false }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      judul: defaultValues.judul || "",
      slug: defaultValues.slug || "",
      isi: defaultValues.isi || "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await fetch(
        `/api/halaman${isEdit ? `/${defaultValues.id}` : ""}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menyimpan data");

      toast.success(result.message || "Berhasil");
      router.push("/admin/halaman");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat menyimpan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        {isEdit ? (
          <Textinput
            label="Halaman"
            name="slug"
            id="slug"
            value={defaultValues.slug}
            disabled={true}
          />
        ) : (
          <Select
            label="Halaman *"
            name="slug"
            options={slugOptions}
            placeholder="--Pilih halaman"
            {...register("slug", { required: "Slug harus dipilih" })}
            error={errors.slug}
          />
        )}

        <Textinput
          label="Judul Halaman *"
          name="judul"
          id="judul"
          placeholder="Masukkan judul halaman"
          {...register("judul", { required: "Judul harus diisi" })}
          error={errors.slug}
        />

        <div>
          <label className="form-label">Isi Halaman *</label>
          <Controller
            name="isi"
            control={control}
            rules={{ required: "Isi halaman tidak boleh kosong" }}
            render={({ field }) => (
              <QuillEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.isi && (
            <p className="mt-1 text-sm text-red-500">{errors.isi.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting
          ? "Menyimpan..."
          : isEdit
          ? "Simpan Perubahan"
          : "Tambah Halaman"}
      </Button>
    </form>
  );
}

export default FormHalaman;
