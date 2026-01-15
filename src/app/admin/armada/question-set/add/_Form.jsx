"use client";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import CheckInput from "@/components/ui/CheckInput";

const schema = yup.object().shape({
  description: yup.string().required("Deskripsi Wajib Diisi"),
  service_types: yup
    .array()
    .min(1, "Minimal pilih 1 pilihan")
    .required("Wajib Dipilih"),
  fleet_types: yup
    .array()
    .min(1, "Minimal pilih 1 pilihan")
    .required("Wajib Dipilih"),
});

const QuestionSetForm = ({ serviceTypes, fleetTypes }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      description: "",
      service_types: [],
      fleet_types: [],
    },
  });

  const onSubmit = async (formData) => {
    try {
      const payload = {
        description: formData.description,
        service_types: formData.service_types.map((id) => ({ id: Number(id) })),
        fleet_types: formData.fleet_types.map((id) => ({ id: Number(id) })),
      };

      await axios.post("/api/armada/question-set", payload);
      toast.success("Berhasil Membuat Data");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Gagal Membuat Data");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <TextInput
        label="Deskripsi"
        type="text"
        placeholder="Masukan deskripsi"
        {...register("description", { required: true })}
        error={errors.description}
      />

      <div>
        <label className="form-label mb-1 block capitalize">TIPE LAYANAN</label>
        <div className="grid grid-cols-2 gap-2">
          {serviceTypes.map((st) => (
            <Controller
              key={st.id}
              name="service_types"
              control={control}
              render={({ field }) => (
                <CheckInput
                  label={st.name}
                  value={st.id.toString()}
                  checked={field.value.includes(st.id.toString())}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      field.onChange([...field.value, value]);
                    } else {
                      field.onChange(
                        field.value.filter((item) => item !== value)
                      );
                    }
                  }}
                />
              )}
            />
          ))}
        </div>
        {errors.service_types && (
          <span className="text-danger-500 text-sm">
            {errors.service_types.message}
          </span>
        )}
      </div>

      <div>
        <label className="form-label mb-1 block capitalize">TIPE ARMADA</label>
        <div className="grid grid-cols-3 gap-2">
          {fleetTypes.map((ft) => (
            <Controller
              key={ft.id}
              name="fleet_types"
              control={control}
              render={({ field }) => (
                <CheckInput
                  label={ft.name}
                  value={ft.id.toString()}
                  checked={field.value.includes(ft.id.toString())}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      field.onChange([...field.value, value]);
                    } else {
                      field.onChange(
                        field.value.filter((item) => item !== value)
                      );
                    }
                  }}
                />
              )}
            />
          ))}
        </div>
        {errors.fleet_types && (
          <span className="text-danger-500 text-sm">
            {errors.fleet_types.message}
          </span>
        )}
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

export default QuestionSetForm;
