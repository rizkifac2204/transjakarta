"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE } from "@/configs/appConfig";
import { validateStrongPassword } from "@/utils/strongPassword";

function FormAddPengguna({ level }) {
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
    defaultValues: {
      level_id: "",
      nama: "",
      telp: "",
      alamat: "",
      email: "",
      username: "",
      password: "",
      password_confirm: "",
      foto: null,
    },
  });

  const password = watch("password");

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

      const res = await axios.post("/api/pengguna", formData, {
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
          label="Level Admin *"
          name="level_id"
          options={
            Array.isArray(level)
              ? level.map((item) => ({
                  value: item.id,
                  label: item.level,
                }))
              : []
          }
          placeholder={!level ? "Memuat data..." : "Pilih level"}
          disabled={!level}
          {...register("level_id", { required: "Pilih Level" })}
          error={errors.level_id}
        />

        <Textinput
          label="Nama Pengguna *"
          name="nama"
          id="nama"
          placeholder="Masukan Nama Pengguna"
          {...register("nama")}
          error={errors.nama}
        />

        <Textinput
          label="Email Pengguna"
          name="email"
          id="email"
          type="email"
          placeholder="Masukan Email Pengguna"
          {...register("email")}
        />

        <Textinput
          label="Telp/HP"
          name="telp"
          id="telp"
          placeholder="Masukan Nomor Telp/HP Pengguna"
          {...register("telp")}
        />

        <Textarea
          label="Alamat"
          name="alamat"
          id="alamat"
          placeholder="Masukan Alamat Pengguna"
          {...register("alamat")}
        />

        <Textinput
          label="Username *"
          name="username"
          id="username"
          placeholder="Masukan Username Pengguna"
          {...register("username")}
          error={errors.username}
        />

        <Textinput
          label="Password *"
          name="password"
          id="password"
          type="password"
          placeholder="Masukan Password Pengguna"
          {...register("password", {
            required: "Wajib Input Password",
            validate: validateStrongPassword,
          })}
          error={errors.password}
        />

        <Textinput
          label="Konfirmasi Password *"
          name="password_confirm"
          id="password_confirm"
          type="password"
          placeholder="Masukan Kembali Password Pengguna"
          {...register("password_confirm", {
            required: "Input Ulang Password",
            validate: (value) =>
              value === password || "Konfirmasi password tidak cocok",
          })}
          error={errors.password_confirm}
        />

        <Fileinputcontroller
          accept="image/*"
          name="foto"
          id="foto"
          label="Upload Foto Pengguna"
          placeholder="Pilih gambar..."
          control={control}
          error={errors.foto}
          preview
          badge
          description="Format hanya berupa gambar"
          maxFileSize={MAX_FOTO_SIZE}
          resetKey={resetKey}
        />
      </div>

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}

export default FormAddPengguna;
