import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

import { getPermohonanCount } from "@/libs/permohonan";
import { getKeberatanCount } from "@/libs/keberatan";
import { getJawabanCount } from "@/libs/jawaban";
import { getPenelitianCount } from "@/libs/penelitian";
import { getJawabanPenelitianCount } from "@/libs/jawaban-penelitian";

const CountData = async () => {
  const [
    countPermohonan,
    countKeberatan,
    countPenelitian,
    countJawaban,
    countJawabanPenelitian,
  ] = await Promise.all([
    getPermohonanCount(),
    getKeberatanCount(),
    getPenelitianCount(),
    getJawabanCount(),
    getJawabanPenelitianCount(),
  ]);

  const dashboardDataHead = [
    {
      title: "Total Permohonan Informasi",
      count: countPermohonan,
      child: countJawaban,
      text: "text-info-500",
      icon: "solar:database-broken",
      link: "/admin/permohonan",
    },
    {
      title: "Total Keberatan",
      count: countKeberatan,
      child: false,
      text: "text-warning-500",
      icon: "solar:palette-broken",
      link: "/admin/keberatan",
    },
    {
      title: "Total Permohonan Penelitian",
      count: countPenelitian,
      child: countJawabanPenelitian,
      text: "text-[#d71a4b]",
      icon: "solar:square-academic-cap-2-broken",
      link: "/admin/penelitian",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      {dashboardDataHead.map((item, i) => (
        <Link href={item.link} key={i}>
          <Card bodyClass="pt-4 pb-3 px-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
                <div
                  className={`bg-[#FFEDE6] dark:bg-slate-900 ${item.text} h-12 w-12 rounded-full flex flex-col items-center justify-center text-2xl`}
                >
                  <Icon icon={item.icon} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                  {item.title}
                </div>
                <div className="text-slate-900 dark:text-white text-lg font-medium">
                  {item.count}
                  {item.child ? (
                    <span className="ml-3 text-xs font-medium text-secondary-500">
                      {`(${item.child} Jawaban)`}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CountData;
