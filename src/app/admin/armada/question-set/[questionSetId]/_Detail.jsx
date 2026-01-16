"use client";

import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
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
    <Card
      title={initialData.description || "Detail Set Pertanyaan"}
      headerslot={
        <Link className="action-btn" href={`/admin/armada/question-set`}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <div className="space-y-4">
        <div>
          <span>Tipe Layanan: </span>
          <span className="font-semibold">
            {initialData.service_types.map((st) => st.name).join(", ")}
          </span>
        </div>
        <div>
          <span>Tipe Armada: </span>
          <span className="font-semibold">
            {initialData.fleet_types.map((ft) => ft.name).join(", ")}
          </span>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Button
            text="Hapus"
            className="btn-danger btn-sm"
            onClick={onDeleteSet}
          />
          <Button
            text="Tambah Pertanyaan"
            className="btn-primary btn-sm"
            onClick={() => {
              router.push(
                `/admin/armada/question-set/${encodeId(
                  initialData.id
                )}/add-pertanyaan`
              );
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuestionDetails;
