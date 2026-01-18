import { getUserCount } from "@/libs/user";
import { getProfile } from "@/libs/profile";

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import ImageBlock from "@/components/partials/dashboard/ImageBlock";
// import CountData from "@/components/partials/dashboard/CountData";
// import CountOthers from "@/components/partials/dashboard/CountOthers";
// import CountUkpbj from "@/components/partials/dashboard/CountUkpbj";
// import DataPerbulan from "@/components/partials/dashboard/DataPerbulan";
// import PermohonanTerbaru from "@/components/partials/dashboard/PermohonanTerbaru";
import Alert from "@/components/ui/Alert";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

async function AdminPage() {
  const countUser = await getUserCount();
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div>
      {profile.mfa_enabled ? null : (
        <div className="mb-5">
          <Alert className="alert-outline-warning">
            Anda belum mengaktifkan fitur MFA, silahkan aktifkan pada halaman{" "}
            <Link href={"/admin/profile/mfa"} className="underline">
              Aktivasi MFA
            </Link>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="lg:col-span-3 col-span-12">
          <ImageBlock countUser={countUser} />
        </div>
        <div className="lg:col-span-9 col-span-12">
          <Suspense fallback={<Skeleton className={"w-full h-20"} />}>
            {/* <CountData /> */}
          </Suspense>
          <Suspense fallback={<Skeleton className={"w-full h-20"} />}>
            {/* <CountOthers /> */}
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="2xl:col-span-8 lg:col-span-7 col-span-12">
          <Suspense fallback={<Skeleton className={"w-full h-[350px]"} />}>
            {/* <DataPerbulan /> */}
          </Suspense>
        </div>

        <div className="2xl:col-span-4 lg:col-span-5 col-span-12">
          <Suspense fallback={<Skeleton className={"w-full h-[350px]"} />}>
            {/* <CountUkpbj />
            <PermohonanTerbaru /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
