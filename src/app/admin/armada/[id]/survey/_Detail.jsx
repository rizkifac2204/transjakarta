"use client";

import { encodeId } from "@/libs/hash/hashId";
import { formatedDate, formatOutputTime } from "@/utils/formatDate";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

const ArmadaDetails = ({ initialData }) => {
  return (
    <Card
      title={`JENIS SPM: ARMADA`}
      headerslot={
        <Link
          className="action-btn"
          href={`/admin/armada/${encodeId(initialData.id)}`}
        >
          <Icon icon="solar:alt-arrow-left-bold-duotone" />
        </Link>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        <div className="flex-1">
          <div className="text-xs">SURVEYOR :</div>
          <b>{initialData?.surveyor?.nama}</b>
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
