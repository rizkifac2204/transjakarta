"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";

import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import TimeInputController from "@/components/ui/TimeInputController";
import Dateinputcontroller from "@/components/ui/DateInputController";

const ShelterFormAdd = ({ shelterTypes }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama_halte: "",
      kode_halte: "",
      shelter_type_id: "",
      tanggal: null,
      periode: "",
      jam_mulai: null,
      jam_selesai: null,
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await axios.post("/api/shelter", formData);
      toast.success("Berhasil Membuat Data");
      setTimeout(() => {
        window.open(`/admin/shelter/${encodeId(res.data.id)}/survey`, "_self");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal Membuat Data");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <TextInput
            label="Nama Halte *"
            type="text"
            {...register("nama_halte", { required: true })}
            error={errors.nama_halte}
          />

          <TextInput
            label="Kode Halte *"
            type="text"
            {...register("kode_halte", { required: true })}
            error={errors.kode_halte}
          />

          <Select
            label="Tipe Halte *"
            name="shelter_type_id"
            options={
              Array.isArray(shelterTypes)
                ? shelterTypes.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))
                : []
            }
            {...register("shelter_type_id", { required: "Wajib Dipilih" })}
            error={errors.shelter_type_id}
          />
        </div>
        <div>
          <Select
            label="Periode *"
            name="periode"
            options={[
              { value: "SIBUK", label: "SIBUK" },
              { value: "TIDAK SIBUK", label: "TIDAK SIBUK" },
            ]}
            {...register("periode", { required: "Wajib Dipilih" })}
            error={errors.periode}
          />

          <Dateinputcontroller
            control={control}
            name="tanggal"
            label="Tanggal *"
            rules={{ required: "Harus isi tanggal" }}
            error={errors.tanggal}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TimeInputController
              control={control}
              name="jam_mulai"
              label="Jam Mulai *"
              rules={{ required: "Harus isi jam mulai" }}
              error={errors.jam_mulai}
            />
            <TimeInputController
              control={control}
              name="jam_selesai"
              label="Jam Selesai *"
              rules={{ required: "Harus isi jam selesai" }}
              error={errors.jam_selesai}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 rtl:space-x-reverse">
        <Button
          type="submit"
          className="btn-primary w-full btn-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default ShelterFormAdd;
