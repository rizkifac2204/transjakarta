"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";

import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";

const QuestionForm = ({ set }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      section: "",
      basic: "",
      indicator: "",
      spm_criteria: "",
      spm_reference: "",
      order: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await axios.post(`/api/armada/question-set/${set.id}/question`, formData);
      toast.success("Berhasil Membuat Data");
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Gagal Membuat Data");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Bagian *"
        name="section"
        options={[
          { value: "KEAMANAN", label: "KEAMANAN" },
          { value: "KESELAMATAN", label: "KESELAMATAN" },
          { value: "KENYAMANAN", label: "KENYAMANAN" },
          { value: "KESETARAAN", label: "KESETARAAN" },
          { value: "KETERATURAN", label: "KETERATURAN" },
        ]}
        placeholder={"Pilih Bagian"}
        {...register("section", { required: "Pilih Bagian" })}
        error={errors.section}
      />

      <TextInput
        label="Urut Soal *"
        type="text"
        placeholder="a/b/c etc..."
        {...register("order", { required: true })}
        error={errors.order}
      />

      <TextInput
        label="Jenis Pelayanan Dasar *"
        type="text"
        {...register("basic", { required: true })}
        error={errors.basic}
      />

      <TextInput
        label="Indikator *"
        type="text"
        {...register("indicator", { required: true })}
        error={errors.indicator}
      />

      <TextInput
        label="Nilai SPM Yang Diukur *"
        type="text"
        {...register("spm_criteria", { required: true })}
        error={errors.spm_criteria}
      />

      <TextInput
        label="Refere NSI SPM *"
        type="text"
        {...register("spm_reference", { required: true })}
        error={errors.spm_reference}
      />

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

export default QuestionForm;
