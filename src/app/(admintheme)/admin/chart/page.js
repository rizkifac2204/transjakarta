import { chartConfig } from "@/configs/chartConfig";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FilterChart from "./_Filter";
import InfografisChartList from "@/components/ui/Infografis/InfografisChartList";

async function InfografisPage({ searchParams }) {
  const { table = "permohonan" } = searchParams;

  const config = chartConfig[table];
  if (!config) notFound();

  return (
    <>
      <Card
        title={config.label.toUpperCase()}
        subtitle={"Infografis"}
        headerslot={<FilterChart chartConfig={chartConfig} />}
      />
      <InfografisChartList config={config} />
    </>
  );
}

export default InfografisPage;
