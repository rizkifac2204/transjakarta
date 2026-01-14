"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function FormInstansi({ defaultValues }) {
  const [isReset, setIsReset] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultValues,
  });

  async function onReset() {
    try {
      setIsReset(true);
      const res = await axios.delete("/api/instansi");
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
      reset();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsReset(false);
    }
  }

  async function onSubmit(data) {
    try {
      const res = await axios.patch("/api/instansi", data);
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          className="btn-gold"
          text={isReset ? "Processing..." : "Reset Data Instansi"}
          onClick={async () => {
            const yakin = window.confirm(
              "Apakah Anda yakin ingin mereset semua data instansi?"
            );
            if (yakin) {
              await onReset();
            }
          }}
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Textinput
            label="Nama Instansi *"
            name="nama"
            id="nama"
            {...register("nama", { required: "Harus Input Nama Instansi" })}
            error={errors.nama}
          />

          <Textinput
            label="Kode Instansi"
            name="kode"
            id="kode"
            {...register("kode")}
          />

          <Textinput
            label="Telp/HP 1"
            name="telp_1"
            id="telp_1"
            {...register("telp_1")}
            description="Masukan No. Telp/HP (Dalam Negeri)"
          />

          <Textinput
            label="Telp/HP 2"
            name="telp_2"
            id="telp_2"
            description="Masukan No. Telp/HP ke-2 (Luar Negeri)"
            {...register("telp_2")}
          />

          <Textinput
            label="Email Instansi"
            name="email"
            id="email"
            type="email"
            {...register("email")}
          />

          <Textarea
            label="Alamat"
            name="alamat"
            id="alamat"
            {...register("alamat")}
          />

          <Textinput
            label="URL Website Utama"
            name="website"
            id="website"
            {...register("website")}
          />

          <Textinput
            label="URL Sosmed Facebook"
            name="facebook"
            id="facebook"
            {...register("facebook")}
          />

          <Textinput
            label="URL Sosmed X"
            name="twitter"
            id="twitter"
            {...register("twitter")}
          />

          <Textinput
            label="URL Sosmed Instagram"
            name="instagram"
            id="instagram"
            {...register("instagram")}
          />

          <Textinput
            label="URL Chanel Youtube"
            name="youtube"
            id="youtube"
            {...register("youtube")}
          />

          <Textinput
            label="URL Tiktok"
            name="tiktok"
            id="tiktok"
            {...register("tiktok")}
          />

          <Textinput
            label="Nomor Penerima Notifikasi"
            name="notif_wa"
            id="notif_wa"
            {...register("notif_wa")}
            description={
              "Nomor yang dimasukan akan menjadi nomor penerima notifikasi jika ada permohonan baru (Pastikan Nomor Memiliki Whatsapp)"
            }
          />

          <Textinput
            label="Email Penerima Pemberitahuan"
            name="notif_email"
            id="notif_email"
            {...register("notif_email")}
            description={
              "Email yang dimasukan akan menjadi email penerima pemberitahuan jika ada permohonan baru"
            }
          />
        </div>

        <Button
          type="submit"
          className="btn-gold w-full"
          disabled={isSubmitting}
          text={isSubmitting ? "Processing..." : "Submit"}
        />
      </form>
    </>
  );
}

export default FormInstansi;
