import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import FilePreview from "@/components/ui/FilePreview";
import { useAuthContext } from "@/providers/auth-provider";
import { PATH_UPLOAD } from "@/configs/appConfig";

const MobileFooter = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <Link href="/admin/armada">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${
           pathname === "/admin/armada"
             ? "text-primary-500"
             : "dark:text-white text-slate-900"
         }
          `}
          >
            <Icon icon="solar:bus-broken" />
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
            Armada
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
                ? `/api/services/file/uploads/${PATH_UPLOAD.user}/${user?.foto}`
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
      <Link href="/admin/shelter">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${
        pathname === "/admin/shelter"
          ? "text-primary-500"
          : "dark:text-white text-slate-900"
      }
          `}
          >
            <Icon icon="solar:streets-navigation-broken" />
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
            Halte
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MobileFooter;
