"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";
import Link from "next/link";
import Card from "@/components/ui/Card";
import TablePagination from "@/components/ui/Table/Pagination";
import TableSearchGlobal from "@/components/ui/Table/Search";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import ButtonExport from "@/components/ui/Table/ButtonExport";
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

function ActionCell({ rowData, deletingRowId, handleDelete, kategori }) {
  const isDeleting = deletingRowId === rowData.id;

  return (
    <div
      className={`flex space-x-1 rtl:space-x-reverse ${
        isDeleting ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <Tooltip content="Edit" placement="top" arrow animation="shift-away">
        <Link
          className="action-btn"
          href={`/admin/laporan/${kategori}/${encodeId(rowData.id)}/edit`}
          scroll={false}
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

function TableLaporan({ kategori, data = [] }) {
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
      const res = await axios.delete(`/api/laporan/${kategori}/${id}`);
      toast.success(res?.data?.message || "Berhasil");
      setSafeData((prev) => prev.filter((item) => item.id !== id));
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
    COLUMNHELPER.accessor("label", { header: "Judul" }),
    COLUMNHELPER.accessor(
      (row) => row.laporan_header?.label || "-", // fallback null
      {
        id: "laporan_header", // ID kolom (harus unik)
        header: "Header",
      }
    ),
    COLUMNHELPER.accessor("link", {
      header: "Link File",
      cell: (info) => {
        const url = info.getValue();
        if (!url || typeof url !== "string" || url.trim() === "") {
          return <span className="text-slate-400 italic">Tidak tersedia</span>;
        }

        const displayText = url.length > 30 ? url.slice(0, 20) + "..." : url;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {displayText}
          </a>
        );
      },
    }),
    COLUMNHELPER.accessor("file", {
      header: "File Upload",
      cell: (info) => {
        const url = info.getValue();
        if (!url || typeof url !== "string" || url.trim() === "") {
          return <span className="text-slate-400 italic">Tidak tersedia</span>;
        }

        const displayText = url.length > 30 ? url.slice(0, 20) + "..." : url;
        return (
          <a
            href={`/api/services/file/uploads/laporan/${kategori}/${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayText}
          </a>
        );
      },
    }),
    COLUMNHELPER.accessor("created_at", {
      header: "Dibuat",
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
          kategori={kategori}
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
      title={`DATA LAPORAN ${kategori}`}
      headerslot={
        <div className="flex flex-col md:flex-row gap-1">
          <TableSearchGlobal
            filter={globalFilter}
            setFilter={setGlobalFilter}
          />
          <Link
            href={`/admin/laporan/${kategori}/add`}
            className="btn-outline-dark px-4 py-1 flex items-center justify-center rounded-md text-sm"
            scroll={false}
          >
            Tambah
          </Link>
          <ButtonExport data={safeData} fileName={`Laporan ${kategori}`} />
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

export default TableLaporan;
