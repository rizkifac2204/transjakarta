"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";
import Link from "next/link";
import Card from "@/components/ui/Card";
import TablePagination from "@/components/ui/Table/Pagination";
import TableSearchGlobal from "@/components/ui/Table/Search";
import ButtonExport from "@/components/ui/Table/ButtonExport";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";

const COLUMNHELPER = createColumnHelper();

function ActionCell({ rowData, deletingRowId, handleDelete }) {
  const isDeleting = deletingRowId === rowData.id;

  return (
    <div
      className={`flex space-x-1 rtl:space-x-reverse ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Tooltip content="Detail" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/keberatan/${encodeId(rowData.id)}`}
        >
          <Icon icon="solar:eye-broken" />
        </Link>
      </Tooltip>

      <Tooltip content="Edit" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/keberatan/${encodeId(rowData.id)}/edit`}
        >
          <Icon icon="solar:pen-2-broken" />
        </Link>
      </Tooltip>

      <Tooltip content="Hapus" placement="top" arrow animation="shift-away">
        <button
          className={`action-btn ${
            Boolean(deletingRowId) ? "pointer-events-none opacity-50" : ""
          }`}
          type="button"
          onClick={() => handleDelete(rowData.id)}
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
    </div>
  );
}

function TableKeberatan({ data = [] }) {
  const router = useRouter();
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [safeData, setSafeData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    try {
      if (!Array.isArray(data)) {
        setHasError(true);
      } else {
        setSafeData(data);
      }
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      const res = await axios.delete(`/api/keberatan/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      setSafeData((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setDeletingRowId(null);
    }
  };

  const columns = [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    COLUMNHELPER.accessor("no_regis", { header: "No. Registrasi" }),
    COLUMNHELPER.accessor((row) => row.admin?.nama || "-", {
      id: "admin",
      header: "Penanggung Jawab",
    }),
    COLUMNHELPER.accessor("alasan", {
      header: "Alasan Keberatan",
      cell: (info) => {
        const text = info.getValue();
        const maxLength = 60;
        return text.length > maxLength
          ? text.slice(0, maxLength) + "..."
          : text;
      },
    }),
    COLUMNHELPER.accessor("tujuan", {
      header: "Tujuan",
      cell: (info) => {
        const text = info.getValue();
        const maxLength = 60;
        return text.length > maxLength
          ? text.slice(0, maxLength) + "..."
          : text;
      },
    }),
    COLUMNHELPER.accessor("tanggal", {
      header: "Tanggal",
      cell: (info) =>
        new Date(info.getValue()).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
    }),
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <ActionCell
          rowData={row.original}
          deletingRowId={deletingRowId}
          handleDelete={handleDelete}
        />
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    columns,
    data: safeData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  if (isLoading) {
    return <p className="text-gray-500 italic">Memuat data...</p>;
  }

  if (hasError) {
    return (
      <p className="text-red-500">Data tidak tersedia atau gagal dimuat.</p>
    );
  }

  return (
    <Card
      title="DATA KEBERATAN"
      headerslot={
        <div className="flex flex-col md:flex-row gap-2">
          <TableSearchGlobal
            filter={globalFilter}
            setFilter={setGlobalFilter}
          />
          <ButtonExport data={safeData} fileName="Keberatan" />
        </div>
      }
    >
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
              <thead className=" border-t border-slate-100 dark:border-slate-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className=" table-th cursor-pointer "
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted()] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-4 text-slate-500 dark:text-slate-400"
                    >
                      Tidak Ditemukan
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="table-td">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TablePagination table={table} />
    </Card>
  );
}

export default TableKeberatan;
