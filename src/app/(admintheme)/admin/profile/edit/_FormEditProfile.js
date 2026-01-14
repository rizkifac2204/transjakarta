"use client";

import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function FormEditProfile({ profile }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: profile,
  });

  async function onSubmit(data) {
    try {
      const res = await axios.patch("/api/profile", data);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="space-y-3">
        <Textinput
          label="Nama Admin *"
          name="nama"
          id="nama"
          type="text"
          placeholder="Masukan Nama"
          {...register("nama", { required: "Masukan Nama Administrator" })}
          error={errors?.nama}
        />
        <Textinput
          label="Nomor HP"
          name="telp"
          id="telp"
          type="text"
          placeholder="Masukan Nomor Handphone Admin"
          description="Nomor akan digunakan sebagai nomor penerima pemberitahuan jika ada permohonan informasi baru via Whatsapp"
          {...register("telp")}
        />
        <Textinput
          label="Email Admin"
          name="email"
          id="email"
          type="email"
          placeholder="Masukan Email"
          {...register("email")}
        />
        <Textarea
          label="Alamat"
          name="alamat"
          id="alamat"
          placeholder="Masukan Alamat Lengkap"
          {...register("alamat")}
        />
        <Textinput
          label="Username Admin *"
          name="username"
          id="username"
          type="text"
          placeholder="Masukan Username"
          {...register("username", { required: "Masukan Username" })}
          error={errors?.username}
        />
        <Textinput
          label="Password Lama *"
          id="password_lama"
          name="password_lama"
          type="password"
          placeholder="Masukan Password Yang Saat Ini Digunakan"
          hasicon
          {...register("password_lama", {
            required: "Masukan Password Saat Ini",
          })}
          error={errors?.password_lama}
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

export default FormEditProfile;
