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

const QuestionSetTable = ({ initialData, set_id, isManage }) => {
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
      await axios.delete(`/api/armada/question-set/${set_id}/question/${id}`);
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
    COLUMNHELPER.accessor("section", { header: "BAGIAN" }),
    COLUMNHELPER.accessor("text", { header: "PELAYANAN DASAR" }),
    COLUMNHELPER.accessor("category", { header: "INDIKATOR" }),
    COLUMNHELPER.accessor("spm_criteria", { header: "NILAI SPM DIUKUR" }),
    COLUMNHELPER.accessor("spm_reference", { header: "REFERE NSI SPM" }),
    COLUMNHELPER.accessor("order", { header: "URUTAN SOAL" }),
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
                href={`/admin/armada/question-set/${encodeId(
                  set_id
                )}/${encodeId(rowData.id)}`}
              >
                <Icon icon="solar:eye-broken" />
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
                  Boolean(deletingRowId) ? "pointer-events-none opacity-50" : ""
                }`}
                type="button"
                disabled={!isManage}
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
      title="DATA PERTANYAAN"
      headerslot={
        <div className="flex gap-2">
          <TableSearchGlobal
            filter={globalFilter}
            setFilter={setGlobalFilter}
          />
          <Link
            href={`/admin/armada/question-set/${encodeId(
              set_id
            )}/add-pertanyaan`}
            scroll={false}
            className={`shadow-md cursor-pointer px-4 py-2 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-60 rounded-md`}
          >
            Tambah Pertanyaan
          </Link>
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

export default QuestionSetTable;
