"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, startTransition } from "react";
import Select from "@/components/ui/Select";
import DateRangeInput from "@/components/ui/Infografis/DateRangeInput";
import Button from "@/components/ui/Button";
import { format } from "date-fns";

export default function FilterInfografis({ chartConfig }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [table, setTable] = useState(searchParams.get("table") || "permohonan");
  const [range, setRange] = useState([
    searchParams.get("start") ? new Date(searchParams.get("start")) : null,
    searchParams.get("end") ? new Date(searchParams.get("end")) : null,
  ]);

  const [date, end] = range;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const params = new URLSearchParams();
    if (table) params.set("table", table);
    if (date && !end) {
      params.set("date", format(date, "yyyy-MM-dd"));
    } else if (date && end) {
      params.set("start", format(date, "yyyy-MM-dd"));
      params.set("end", format(end, "yyyy-MM-dd"));
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
      setIsSubmitting(false);
    });
  };

  const tableOptions = Object.entries(chartConfig).map(([key, conf]) => ({
    value: key,
    label: conf.label,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
      <div className="w-full md:min-w-[200px]">
        <Select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          options={tableOptions}
          placeholder="--Pilih Kategori Data"
        />
      </div>

      <div className="w-full md:min-w-[220px]">
        <DateRangeInput
          range={range}
          setRange={setRange}
          placeholder="Tanggal / Rentang"
        />
      </div>

      <div>
        <Button
          type="submit"
          className="btn-gold w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memuat" : "Filter"}
        </Button>
      </div>
    </form>
  );
}
