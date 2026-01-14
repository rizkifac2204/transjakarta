"use client";

import Alert from "@/components/ui/Alert";
import { formatedDate } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { encodeId } from "@/libs/hash/hashId";

function getStatusClass(status) {
  const base = "inline-block px-3 ...";
  const statusMap = {
    Proses: "text-warning-500 bg-warning-500",
    Diberikan: "text-success-500 bg-success-500",
    "Diberikan Sebagian": "text-danger-500 bg-danger-500",
    "Tidak Dapat Diberikan": "text-danger-500 bg-danger-500",
    Sengketa: "text-danger-500 bg-danger-500",
    Ditolak: "text-danger-500 bg-danger-500",
  };

  return `${base} ${statusMap[status] || ""}`;
}

const StatusLabel = ({ status }) => {
  return (
    <span
      className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${getStatusClass(
        status
      )}`}
    >
      {status}
    </span>
  );
};

function ContentPermohonanTerbaru({ data }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
        <thead className="bg-slate-200 dark:bg-slate-700">
          <tr>
            <th scope="col" className=" table-th ">
              Nama
            </th>
            <th scope="col" className=" table-th ">
              Tanggal
            </th>
            <th scope="col" className=" table-th ">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
          {data?.length === 0 ? (
            <tr>
              <td colSpan={3}>
                <Alert
                  label="Data Tidak Ditemukan"
                  className="m-2 alert-info light-mode"
                />
              </td>
            </tr>
          ) : (
            data?.map((item, index) => (
              <tr
                className="hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                key={index}
                onClick={() =>
                  router.push(`/admin/permohonan/${encodeId(item.id)}`)
                }
              >
                <td className="table-td">{item.nama}</td>
                <td className="table-td">{formatedDate(item.tanggal)}</td>
                <td className="table-td">
                  <StatusLabel status={item.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContentPermohonanTerbaru;
