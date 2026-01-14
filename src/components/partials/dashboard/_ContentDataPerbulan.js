"use client";

import dynamic from "next/dynamic";
import useDarkmode from "@/themes/dashcode/hooks/useDarkMode";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function ContentDataPerbulan({ data }) {
  const [isChartReady, setIsChartReady] = useState(false);
  const [isDark] = useDarkmode();

  const series = [
    {
      name: "Permohonan",
      data: data.map((item) => item.permohonan),
    },
    {
      name: "Keberatan",
      data: data.map((item) => item.keberatan),
    },
    {
      name: "Penelitian",
      data: data.map((item) => item.penelitian),
    },
  ];

  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: data.map((item) => item.bulan),
      labels: {
        style: {
          colors: isDark ? "#E5E7EB" : "#374151",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#E5E7EB" : "#374151",
        },
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      monochrome: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    legend: {
      labels: {
        colors: isDark ? "#f1f5f9" : "#1e293b",
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartReady(true); // simulasi chart load selesai
    }, 1000); // bisa kamu sesuaikan

    return () => clearTimeout(timer);
  }, []);

  if (!isChartReady) {
    return <Skeleton className="h-[440px] w-full rounded-xl" />;
  }

  return <Chart options={options} series={series} type="bar" height={440} />;
}

export default ContentDataPerbulan;
