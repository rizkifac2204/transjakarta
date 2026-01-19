"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";
import { formatedDate, formatOutputTime } from "@/utils/formatDate";
import { useShelterContext } from "@/providers/shelter-provider";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const ShelterDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);
  const { shelter } = useShelterContext();
  const title = pathname.includes("/survey")
    ? "LEMBAR SURVEY"
    : "DETAIL SURVEY";

  const ListActions = ({ isManage }) => {
    let linkback;
    if (pathname.includes("/survey")) {
      linkback = `/admin/shelter/${encodeId(shelter.id)}`;
    } else {
      linkback = `/admin/shelter`;
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
                href={`/admin/shelter/${encodeId(shelter.id)}/edit`}
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
                href={`/admin/shelter/${encodeId(shelter.id)}/survey`}
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
                onClick={hanldeDelete}
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

  const hanldeDelete = async () => {
    const confirmed = confirm("Yakin Menghapus Data Ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/api/shelter/${shelter.id}`);
      toast.success("Berhasil Hapus");
      router.push("/admin/shelter");
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
          <span>{title} - SPM: HALTE</span>
          <div>
            <Badge
              icon={"solar:checklist-minimalistic-broken"}
              className={shelter?.finish ? "bg-success-600" : "bg-warning-600"}
              label={shelter?.finish ? "Selesai" : "Belum Selesai"}
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
          <ListActions isManage={shelter.isManage} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="flex-1">
          <div className="text-xs">SURVEYOR :</div>
          <b>{shelter?.surveyor?.nama}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JENIS LAYANAN :</div>
          <b>{shelter?.shelter_type?.name}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">NAMA HALTE :</div>
          <b>{shelter?.nama_halte}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">KODE HALTE :</div>
          <b>{shelter?.kode_halte}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">PERIODE :</div>
          <b>{shelter?.periode}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">HARI/TANGGAL :</div>
          <b>{formatedDate(shelter?.tanggal, true)}</b>
        </div>
        <div className="flex-1">
          <div className="text-xs">JAM MULAI - SELESAI :</div>
          <b>
            {formatOutputTime(shelter?.jam_mulai)} -{" "}
            {formatOutputTime(shelter?.jam_selesai)}
          </b>
        </div>
      </div>
    </Card>
  );
};

export default ShelterDetails;
