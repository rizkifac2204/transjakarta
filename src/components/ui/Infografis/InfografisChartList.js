"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/Skeleton";
import ChartCard from "./ChartCard";

export default function InfografisChartList({ config }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const table = searchParams.get("table") || "permohonan";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const date = searchParams.get("date");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/chart", {
          params: { table, date, start, end },
        });
        setData(res.data);
      } catch (err) {
        toast.error("Gagal mengambil data infografis");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, start, end, date]);

  if (loading) return <Skeleton className={"w-full h-20"} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
      {config.fields.map((field) => (
        <ChartCard
          key={field.column}
          field={field}
          value={data?.[field.column]}
        />
      ))}
    </div>
  );
}
