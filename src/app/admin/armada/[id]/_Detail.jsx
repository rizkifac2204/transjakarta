"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import { formatedDate, formatOutputTime } from "@/utils/formatDate";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

const ArmadaDetails = ({ initialData }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteSet = async () => {
    const confirmed = confirm("Yakin Menghapus Data Ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/armada/${initialData.id}`);
      toast.success("Berhasil Hapus");
      router.push("/admin/armada");
    } catch (error) {
      toast.error("Gagal Hapus");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      title={"Detail Survey"}
      headerslot={
        <div
          className={`flex space-x-1 ${
            isDeleting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <Link className="action-btn" href={`/admin/armada`}>
            <Icon icon="solar:alt-arrow-left-bold-duotone" />
          </Link>
          {initialData.isManage && (
            <>
              <Tooltip
                content="Edit Data"
                placement="top"
                arrow
                animation="shift-away"
              >
                <Link
                  className="action-btn"
                  href={`/admin/armada/${encodeId(initialData.id)}/edit`}
                >
                  <Icon icon="solar:pen-2-broken" />
                </Link>
              </Tooltip>
              <Tooltip
                content="Hapus Data"
                placement="top"
                arrow
                animation="shift-away"
              >
                <button
                  className="action-btn"
                  type="button"
                  onClick={() => handleDelete()}
                >
                  {isDeleting ? (
                    <Icon
                      icon="line-md:loading-twotone-loop"
                      className="animate-spin"
                    />
                  ) : (
                    <Icon icon="solar:trash-bin-2-broken" />
                  )}
                </button>
              </Tooltip>
            </>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <div className="flex-1">
          <div className="text-xs">JENIS SPM :</div>
          <b>ARMADA</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JENIS LAYANAN :</div>
          <b>{initialData?.service_type?.name}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">TIPE ARMADA :</div>
          <b>{initialData?.fleet_type?.name}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">NO. BODY :</div>
          <b>{initialData?.no_body}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">KODE TRAYEK :</div>
          <b>{initialData?.kode_trayek}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">ASAL - TUJUAN :</div>
          <b>{initialData?.asal_tujuan}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">PERIODE :</div>
          <b>{initialData?.periode}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">HARI/TANGGAL :</div>
          <b>{formatedDate(initialData?.tanggal, true)}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JAM MULAI - SELESAI :</div>
          <b>
            {formatOutputTime(initialData?.jam_mulai)} -{" "}
            {formatOutputTime(initialData?.jam_selesai)}
          </b>
        </div>
      </div>
    </Card>
  );
};

export default ArmadaDetails;
