"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const QuestionDetails = ({ initialData }) => {
  const router = useRouter();

  const onDeleteSet = async () => {
    const confirmed = confirm(
      "Menghapus data set akan meghapus semua data pertanyaan, lanjutkan?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/armada/question-set/${initialData.id}`);
      toast.success("Berhasil Hapus");
      router.push("/admin/armada/question-set");
    } catch (error) {
      toast.error("Gagal Hapus");
    }
  };

  return (
    <Card title="DETAIL SET PERTANYAAN">
      <div className="space-y-4">
        <div>
          <span className="font-semibold">Deskripsi: </span>
          <span>{initialData.description}</span>
        </div>
        <div>
          <span className="font-semibold">TIPE LAYANAN: </span>
          <span>
            {initialData.service_types.map((st) => st.name).join(", ")}
          </span>
        </div>
        <div>
          <span className="font-semibold">TIPE ARMADA: </span>
          <span>{initialData.fleet_types.map((ft) => ft.name).join(", ")}</span>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Button text="Edit" className="btn-outline-primary btn-sm" />
          <Button
            text="Hapus"
            className="btn-danger btn-sm"
            onClick={onDeleteSet}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuestionDetails;
