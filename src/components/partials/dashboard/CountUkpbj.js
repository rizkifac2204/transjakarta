import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

import {
  getUkpbjRegulasiCount,
  getUkpbjInformasiCount,
} from "@/libs/dashboard/getOthers";

const CountUkpbj = async () => {
  const [countUkpbjRegulasi, countUkpbjInformasi] = await Promise.all([
    getUkpbjRegulasiCount(),
    getUkpbjInformasiCount(),
  ]);

  const dashboardDataHead = [
    {
      title: "Regulasi UKPBJ",
      count: countUkpbjRegulasi,
      text: "text-green-500",
      icon: "solar:bookmark-opened-broken",
      link: "/admin/ukpbj/regulasi",
    },
    {
      title: "Informasi PBJ",
      count: countUkpbjInformasi,
      text: "text-orange-500",
      icon: "solar:book-bookmark-minimalistic-broken",
      link: "/admin/ukpbj/informasi",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-2">
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
                  {item.count} {item.title}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CountUkpbj;
