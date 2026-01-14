"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Textinput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Radio from "@/components/ui/Radio";
import Fileinputcontroller from "@/components/ui/FileInputController";
import Button from "@/components/ui/Button";
import { MAX_FOTO_SIZE } from "@/configs/appConfig";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function FormEditPemohon({ data }) {
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    resetField,
  } = useForm({
    defaultValues: {
      email: data.email,
      nama: data?.nama || "",
      telp: data?.telp || "",
      nomor_identitas: data?.nomor_identitas || "",
      jenis_kelamin: data?.jenis_kelamin || "",
      pekerjaan: data?.pekerjaan || "",
      alamat: data?.alamat || "",
      identitas: null,
      pendidikan: data?.pendidikan || "",
      universitas: data?.universitas || "",
      jurusan: data?.jurusan || "",
      nim: data?.nim || "",
      status_identitas: "keep",
    },
  });

  const status_identitas = watch("status_identitas");

  useEffect(() => {
    resetField("identitas");
    setResetKey((prev) => prev + 1);
  }, [status_identitas, resetField]);

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

      const res = await axios.patch(`/api/pemohon/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResetKey((prev) => prev + 1);
      resetField("identitas");
      toast.success(res?.data?.message || "Berhasil mengupdate data.");
      router.refresh();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Terjadi Kesalahan Saat Mengupdate"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="space-y-3">
        <Textinput
          label="Email Pemohon *"
          name="email"
          id="email"
          type="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Format email tidak valid",
            },
          })}
          error={errors?.email}
        />

        <Textinput
          label="Nama Lengkap *"
          name="nama"
          id="nama"
          type="text"
          {...register("nama", { required: true })}
          error={errors?.nama}
        />

        <Textinput
          label="Nomor Identitas"
          name="nomor_identitas"
          id="nomor_identitas"
          type="text"
          {...register("nomor_identitas")}
          description={`(KTP/SIM/Paspor)`}
        />

        <Select
          label="Jenis Kelamin"
          name="jenis_kelamin"
          options={[
            { value: "Pria", label: "Pria" },
            { value: "Wanita", label: "Wanita" },
          ]}
          placeholder="--Pilih Jenis Kelamin Pemohon"
          {...register("jenis_kelamin")}
        />

        <Textinput
          label="Nomor Telp/HP"
          name="telp"
          id="telp"
          type="text"
          {...register("telp")}
        />

        <Textinput
          label="Pekerjaan"
          name="pekerjaan"
          id="pekerjaan"
          type="text"
          placeholder="Masukan Pekerjaan Pemohon"
          {...register("pekerjaan")}
        />

        <Select
          label="Pendidikan"
          name="pendidikan"
          options={[
            { value: "Tidak/Belum Sekolah", label: "Tidak/Belum Sekolah" },
            {
              value: "Tidak Tamat SD/Sederajat",
              label: "Tidak Tamat SD/Sederajat",
            },
            {
              value: "SD / MI / Paket A / Sederajat",
              label: "SD / MI / Paket A / Sederajat",
            },
            {
              value: "SMP / MTs / Paket B / Sederajat",
              label: "SMP / MTs / Paket B / Sederajat",
            },
            {
              value: "SMA / MA / SMK / Paket C / Sederajat",
              label: "SMA / MA / SMK / Paket C / Sederajat",
            },
            {
              value: "D1 / D2 / D3 (Diploma)",
              label: "D1 / D2 / D3 (Diploma)",
            },
            { value: "S1 / D4 (Sarjana)", label: "S1 / D4 (Sarjana)" },
            { value: "S2 (Magister)", label: "S2 (Magister)" },
            { value: "S3 (Doktor)", label: "S3 (Doktor)" },
          ]}
          placeholder="--Pilih pendidikan Pemohon"
          {...register("pendidikan")}
        />

        <Textinput
          label="Lembaga/Universitas"
          name="universitas"
          id="universitas"
          type="text"
          {...register("universitas")}
        />

        <Textinput
          label="Jurusan/prodi"
          name="jurusan"
          id="jurusan"
          type="text"
          {...register("jurusan")}
        />

        <Textinput
          label="No. Induk Mahasiswa"
          name="nim"
          id="nim"
          type="text"
          {...register("nim")}
        />

        <Textarea
          label="Alamat"
          name="alamat"
          id="alamat"
          placeholder="Masukan Alamat Lengkap"
          {...register("alamat")}
        />

        <div className="flex flex-wrap space-xy-5">
          <Radio
            label="Biarkan Identitas Sebelumnya"
            name="status_identitas"
            value="keep"
            checked={status_identitas === "keep"}
            {...register("status_identitas", { required: true })}
          />
          <Radio
            label="Hapus Identitas Sebelumnya"
            name="status_identitas"
            value="delete"
            checked={status_identitas === "delete"}
            {...register("status_identitas", { required: true })}
          />
          <Radio
            label="Ganti Identitas Sebelumnya"
            name="status_identitas"
            value="change"
            checked={status_identitas === "change"}
            {...register("status_identitas", { required: true })}
          />
        </div>

        {status_identitas === "change" ? (
          <Fileinputcontroller
            accept="image/*"
            name="identitas"
            id="identitas"
            label="Upload Identitas"
            placeholder="Pilih gambar..."
            control={control}
            error={errors.identitas}
            preview
            badge
            description="Upload ulang untuk mengganti foto identitas sebelumnya. Format boleh berupa gambar"
            maxFileSize={MAX_FOTO_SIZE}
            rules={{ required: "File wajib diunggah" }}
            resetKey={resetKey}
          />
        ) : null}
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

export default FormEditPemohon;
