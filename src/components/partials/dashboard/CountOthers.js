import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

import {
  getDipCount,
  getLaporanCount,
  getPeraturanCount,
} from "@/libs/dashboard/getOthers";

const CountOthers = async () => {
  const [countDip, countLaporan, countPeraturan] = await Promise.all([
    getDipCount(),
    getLaporanCount(),
    getPeraturanCount(),
  ]);

  const dashboardDataHead = [
    {
      title: "Total DIP",
      count: countDip,
      text: "text-blue-500",
      icon: "solar:infinity-broken",
      link: "/admin/dip/berkala",
    },
    {
      title: "Laporan",
      count: countLaporan,
      text: "text-sky-500",
      icon: "solar:bookmark-opened-broken",
      link: "/admin/laporan/akses-informasi-publik",
    },
    {
      title: "Peraturan",
      count: countPeraturan,
      text: "text-purple-500",
      icon: "solar:book-bookmark-minimalistic-broken",
      link: "/admin/peraturan",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-1">
      {dashboardDataHead.map((item, i) => (
        <Link href={item.link} key={i}>
          <Card bodyClass="pt-4 pb-3 px-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
                <div
                  className={`bg-[#FFEDE6] dark:bg-slate-900 ${item.text} h-5 w-5 rounded-full flex flex-col items-center justify-center`}
                >
                  <Icon icon={item.icon} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                  {item.count} Data {item.title}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CountOthers;
