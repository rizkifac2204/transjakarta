"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Radio from "@/components/ui/Radio";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE } from "@/configs/appConfig";
import { validateStrongPassword } from "@/utils/strongPassword";

function FormEditPengguna({ pengguna }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);

  const toggleAccrodian = () => {
    setOpen(!open);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    resetField,
    reset,
  } = useForm({
    defaultValues: {
      level_id: pengguna.level_id,
      nama: pengguna.nama || "",
      telp: pengguna.telp || "",
      alamat: pengguna.alamat || "",
      email: pengguna.email || "",
      username: pengguna.username || "",
      status_password: "keep",
      password: "",
      password_confirm: "",
      foto: null,
      status_foto: "keep",
    },
  });

  const status_password = watch("status_password");
  const status_foto = watch("status_foto");
  const password = watch("password");

  useEffect(() => {
    resetField("foto");
    setResetKey((prev) => prev + 1);
  }, [status_foto, resetField]);

  useEffect(() => {
    resetField("password");
    resetField("password_confirm");
  }, [status_password, resetField]);

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

      const res = await axios.patch(`/api/pengguna/${pengguna.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResetKey((prev) => prev + 1);
      resetField("foto");
      resetField("password");
      resetField("password_confirm");
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
    <Card
      title="FORMULIR EDIT DATA PENGGUNA"
      headerslot={
        <div
          className={`flex shadow-md cursor-pointer px-4 py-2 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-md`}
          onClick={() => toggleAccrodian()}
        >
          <span
            className={`text-slate-900 dark:text-white text-[22px] transition-all duration-300 h-5 ${
              open ? "rotate-180 transform" : ""
            }`}
          >
            <Icon icon="heroicons-outline:chevron-down" />
          </span>
        </div>
      }
    >
      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-3">
            <Textinput
              label="Level *"
              name="level"
              id="level"
              value={pengguna?.level?.level}
              disabled
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

            <div className="flex flex-wrap space-xy-5 pt-4">
              <Radio
                label="Biarkan Password"
                name="status_password"
                value="keep"
                checked={status_password === "keep"}
                {...register("status_password", { required: true })}
              />
              <Radio
                label="Ganti Password"
                name="status_password"
                value="change"
                checked={status_password === "change"}
                {...register("status_password", { required: true })}
              />
            </div>

            {status_password === "change" ? (
              <>
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
              </>
            ) : null}

            <div className="flex flex-wrap space-xy-5 pt-4">
              <Radio
                label="Biarkan Foto"
                name="status_foto"
                value="keep"
                checked={status_foto === "keep"}
                {...register("status_foto", { required: true })}
              />
              <Radio
                label="Hapus Foto"
                name="status_foto"
                value="delete"
                checked={status_foto === "delete"}
                {...register("status_foto", { required: true })}
              />
              <Radio
                label="Ganti Foto"
                name="status_foto"
                value="change"
                checked={status_foto === "change"}
                {...register("status_foto", { required: true })}
              />
            </div>

            {status_foto === "change" ? (
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
            ) : null}
          </div>

          <Button
            type="submit"
            className="btn-gold w-full"
            disabled={isSubmitting || !pengguna.isManage}
          >
            {isSubmitting ? "Processing..." : "Submit"}
          </Button>
          {!pengguna.isManage ? (
            <i className="text-xs">
              Tidak Bisa Edit User Dengan Level Sama Atau Lebih Tinggi
            </i>
          ) : (
            ""
          )}
        </form>
      )}
    </Card>
  );
}

export default FormEditPengguna;
