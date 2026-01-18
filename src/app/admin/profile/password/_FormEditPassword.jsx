"use client";

import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { validateStrongPassword } from "@/utils/strongPassword";

function FormEditPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const passwordBaru = watch("password_baru");

  async function onSubmit(data) {
    try {
      const res = await axios.patch(`/api/profile/edit-password`, data);
      toast.success(res?.data?.message || "Berhasil");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="space-y-3">
        <Textinput
          label="Password Lama *"
          id="password_lama"
          name="password_lama"
          type="password"
          placeholder="Password Lama"
          hasicon
          {...register("password_lama", {
            required: "Masukan Password Saat Ini",
          })}
          error={errors?.password_lama}
        />
        <Textinput
          label="Password Baru *"
          id="password_baru"
          name="password_baru"
          type="password"
          placeholder="Masukan Password Baru"
          hasicon
          {...register("password_baru", {
            required: "Masukan Password Baru",
            validate: validateStrongPassword,
          })}
          error={errors?.password_baru}
        />
        <Textinput
          label="Konfirmasi Password Baru *"
          id="password_confirm"
          name="password_confirm"
          type="password"
          placeholder="Masukan Ulang Password Baru"
          hasicon
          {...register("password_confirm", {
            required: "Input Ulang Password Baru",
            validate: (value) =>
              value === passwordBaru || "Konfirmasi password tidak cocok",
          })}
          error={errors?.password_confirm}
        />
      </div>
      <Button
        type="submit"
        className="btn-gold w-full"
        isLoading={isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
}

export default FormEditPassword;
