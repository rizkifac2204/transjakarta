"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import TablePagination from "@/components/ui/Table/Pagination";
import TableSearchGlobal from "@/components/ui/Table/Search";
import Link from "next/link";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { encodeId } from "@/libs/hash/hashId";
import { formatedDate } from "@/utils/formatDate";
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

const ArmadaTable = ({ initialData }) => {
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [safeData, setSafeData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    try {
      if (!Array.isArray(initialData)) {
        setHasError(true);
      } else {
        setSafeData(initialData);
      }
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [initialData]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setDeletingRowId(id);
    try {
      await axios.delete(`/api/armada/${id}`);
      toast.success("Berhasil");
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
    COLUMNHELPER.accessor((row) => row.surveyor?.nama ?? "", {
      id: "surveyor",
      header: "SURVEYOR",
    }),
    COLUMNHELPER.accessor("tanggal", {
      id: "tanggal",
      header: "TANGGAL",
      cell: ({ row }) => {
        const item = row.original;
        return formatedDate(item.tanggal, true);
      },
      sortingFn: "datetime",
    }),
    COLUMNHELPER.accessor("periode", { header: "PERIODE" }),
    COLUMNHELPER.accessor("kode_trayek", { header: "KODE TRAYEK" }),
    COLUMNHELPER.accessor("asal_tujuan", { header: "ASAL-TUJUAN" }),
    COLUMNHELPER.accessor("no_body", { header: "NO BODY" }),
    COLUMNHELPER.accessor((row) => row.service_type?.name ?? "", {
      id: "jenis_layanan",
      header: "JENIS LAYANAN",
    }),
    COLUMNHELPER.accessor((row) => row.fleet_type?.name ?? "", {
      id: "tipe_armada",
      header: "TIPE ARMADA",
    }),
    {
      id: "action",
      header: "Aksi",
      cell: ({ row }) => {
        const isDeleting = deletingRowId === row.original.id;
        const rowData = row.original;
        return (
          <div
            className={`flex space-x-1 rtl:space-x-reverse ${
              isDeleting ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Tooltip
              content="Detail"
              placement="top"
              arrow
              animation="shift-away"
            >
              <Link
                className="action-btn"
                href={`/admin/armada/${encodeId(rowData.id)}`}
              >
                <Icon icon="solar:eye-broken" />
              </Link>
            </Tooltip>
            {rowData.isManage && (
              <>
                <Tooltip
                  content="Survey"
                  placement="top"
                  arrow
                  animation="shift-away"
                >
                  <Link
                    className="action-btn"
                    href={`/admin/armada/${encodeId(rowData.id)}/survey`}
                  >
                    <Icon icon="solar:file-broken" />
                  </Link>
                </Tooltip>
                <Tooltip
                  content="Hapus"
                  placement="top"
                  arrow
                  animation="shift-away"
                >
                  <button
                    className={`action-btn ${
                      Boolean(deletingRowId)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                    type="button"
                    disabled={!rowData.isManage}
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
              </>
            )}
          </div>
        );
      },
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
      title="DAT SURVEY ARMADA"
      headerslot={
        <TableSearchGlobal filter={globalFilter} setFilter={setGlobalFilter} />
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
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-100 dark:hover:bg-slate-700`}
                    >
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
};

export default ArmadaTable;
