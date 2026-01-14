import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import FilePreview from "@/components/ui/FilePreview";
import { useAuthContext } from "@/providers/auth-provider";
import { PATH_UPLOAD } from "@/configs/appConfig";
import axios from "axios";

const MobileFooter = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/unregistered-data");
        setResult(response.data);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      } finally {
      }
    };

    fetchData();
  }, [pathname]);

  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <Link href="/admin/permohonan?unregister=true">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${
           pathname === "/admin/permohonan"
             ? "text-primary-500"
             : "dark:text-white text-slate-900"
         }
          `}
          >
            <Icon icon="solar:database-broken" />
            {result?.countPermohonan ? (
              <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                {result?.countPermohonan}
              </span>
            ) : null}
          </span>
          <span
            className={` block text-[11px]
          ${
            router.pathname === "chat"
              ? "text-primary-500"
              : "text-slate-600 dark:text-slate-300"
          }
          `}
          >
            Permohonan
          </span>
        </div>
      </Link>
      <Link
        href="/admin/profile"
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
          <FilePreview
            fileUrl={
              user?.foto
                ? `/api/services/file/uploads/${PATH_UPLOAD.admin}/${user?.foto}`
                : null
            }
            filename={user?.foto || "Pengguna"}
            isUser={true}
            noLink={true}
            className={`w-full h-full rounded-full
          ${
            pathname === "/admin/profile"
              ? "border-2 border-primary-500"
              : "border-2 border-slate-100"
          }
              `}
          />
        </div>
      </Link>
      <Link href="/admin/penelitian?unregister=true">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${
        pathname === "/admin/penelitian"
          ? "text-primary-500"
          : "dark:text-white text-slate-900"
      }
          `}
          >
            <Icon icon="solar:square-academic-cap-2-broken" />
            {result?.countPenelitian ? (
              <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                {result?.countPenelitian}
              </span>
            ) : null}
          </span>
          <span
            className={` block text-[11px]
         ${
           router.pathname === "notifications"
             ? "text-primary-500"
             : "text-slate-600 dark:text-slate-300"
         }
        `}
          >
            Keberatan
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MobileFooter;
