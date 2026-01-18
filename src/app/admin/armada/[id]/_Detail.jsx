"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import { formatedDate, formatOutputTime } from "@/utils/formatDate";
import { useArmadaContext } from "@/providers/armada-provider";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const ArmadaDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);
  const { armada } = useArmadaContext();

  const ListActions = ({ isManage }) => {
    let linkback;
    if (pathname.includes("/survey")) {
      linkback = `/admin/armada/${encodeId(armada.id)}`;
    } else {
      linkback = `/admin/armada`;
    }
    return (
      <>
        <Link className="action-btn" href={linkback}>
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
        {isManage && (
          <>
            <Tooltip
              content="Edit Data"
              placement="top"
              arrow
              animation="shift-away"
            >
              <Link
                className="action-btn"
                href={`/admin/armada/${encodeId(armada.id)}/edit`}
              >
                <Icon icon="solar:pen-2-broken" />
              </Link>
            </Tooltip>
            <Tooltip
              content="Survey Data"
              placement="top"
              arrow
              animation="shift-away"
            >
              <Link
                className="action-btn"
                href={`/admin/armada/${encodeId(armada.id)}/survey`}
              >
                <Icon icon="solar:file-broken" />
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
                onClick={onDeleteSet}
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
      </>
    );
  };

  const onDeleteSet = async () => {
    const confirmed = confirm("Yakin Menghapus Data Ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/armada/${armada.id}`);
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
      title={
        <div className="flex items-center space-x-2">
          <span>JENIS SPM: ARMADA</span>
          <div>
            <Badge
              icon={"solar:checklist-minimalistic-broken"}
              className={armada?.finish ? "bg-success-600" : "bg-warning-600"}
              label={armada?.finish ? "Selesai" : "Belum Selesai"}
            />
          </div>
        </div>
      }
      headerslot={
        <div
          className={`flex space-x-1 ${
            isDeleting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ListActions isManage={armada.isManage} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex-1">
          <div className="text-xs">SURVEYOR :</div>
          <b>{armada?.surveyor?.nama}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JENIS LAYANAN :</div>
          <b>{armada?.service_type?.name}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">TIPE ARMADA :</div>
          <b>{armada?.fleet_type?.name}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">NO. BODY :</div>
          <b>{armada?.no_body}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">KODE TRAYEK :</div>
          <b>{armada?.kode_trayek}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">ASAL - TUJUAN :</div>
          <b>{armada?.asal_tujuan}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">PERIODE :</div>
          <b>{armada?.periode}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">HARI/TANGGAL :</div>
          <b>{formatedDate(armada?.tanggal, true)}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JAM MULAI - SELESAI :</div>
          <b>
            {formatOutputTime(armada?.jam_mulai)} -{" "}
            {formatOutputTime(armada?.jam_selesai)}
          </b>
        </div>
      </div>
    </Card>
  );
};

export default ArmadaDetails;
