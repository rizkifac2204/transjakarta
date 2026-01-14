"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import useDarkmode from "@/themes/dashcode/hooks/useDarkMode";
import Card from "../Card";

const WordCloudCanvas = dynamic(() => import("./WordCloudCanvas"), {
  ssr: false,
});
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ChartCard({ field, value }) {
  const [isChartReady, setIsChartReady] = useState(false);
  const [isDark] = useDarkmode();

  useEffect(() => {
    const timeout = setTimeout(() => setIsChartReady(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const isEmpty = !value || (Array.isArray(value) && value.length === 0);

  const { chartType, label } = field;

  const commonOptions = {
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
    legend: {
      labels: {
        colors: isDark ? "#f1f5f9" : "#1e293b",
      },
    },
  };

  const renderChart = () => {
    if (!isChartReady)
      return <div className="h-[300px] animate-pulse bg-muted rounded-lg" />;

    switch (chartType) {
      case "pie":
        return (
          <ReactApexChart
            type="pie"
            height={300}
            options={{
              ...commonOptions,
              labels: value.map((v) => v.label),
              legend: {
                ...commonOptions.legend,
                position: "bottom",
              },
            }}
            series={value.map((v) => v.count)}
          />
        );

      case "bar":
        return (
          <ReactApexChart
            type="bar"
            height={300}
            options={{
              ...commonOptions,
              chart: { id: "bar-chart" },
              xaxis: {
                categories: value.map((v) => v.label),
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
            }}
            series={[{ name: label, data: value.map((v) => v.count) }]}
          />
        );

      case "number":
        return (
          <div className="text-8xl font-bold text-center p-10">
            {value}
            <div className="text-base mt-2 text-gray-500">{label}</div>
          </div>
        );

      case "wordCloud":
        return (
          <div className="w-full">
            <WordCloudCanvas words={value} isDark={isDark} />
          </div>
        );

      default:
        return (
          <div className="text-sm text-red-600">Unsupported chart type</div>
        );
    }
  };

  const totalCount =
    Array.isArray(value) && value.every((v) => typeof v.count === "number")
      ? value.reduce((sum, v) => sum + v.count, 0)
      : null;

  return (
    <Card
      title={`${label}${totalCount !== null ? `: Total ${totalCount}` : ""}`}
    >
      {isEmpty ? (
        <div className="h-[300px] flex items-center justify-center text-gray-400 italic">
          Data tidak tersedia
        </div>
      ) : (
        renderChart()
      )}
    </Card>
  );
}
