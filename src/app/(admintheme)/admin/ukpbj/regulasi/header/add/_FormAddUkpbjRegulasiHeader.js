"use client";

import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function FormAddUkpbjRegulasiHeader() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      label: "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await axios.post("/api/ukpbj/regulasi/header", data);
      reset();
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

export default FormAddUkpbjRegulasiHeader;
