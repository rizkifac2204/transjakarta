"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

function FormEditPeraturanHeader({ data }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      label: data?.label || "",
    },
  });

  async function onSubmit(formDataRaw) {
    try {
      const res = await axios.patch(
        `/api/peraturan/header/${data.id}`,
        formDataRaw
      );

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
        <Textinput
          label="Label Header"
          name="label"
          id="label"
          placeholder="Masukan Judul atau Nama Header"
          {...register("label", { required: "Harus Isi" })}
          error={errors.label}
        />
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}

export default FormEditPeraturanHeader;
