import Link from "next/link";
import Icons from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import { getProfile } from "@/libs/profile";
import { notFound } from "next/navigation";
import ActionFoto from "./_Action";
import MfaStatus from "./_MfaStatus";
import Alert from "@/components/ui/Alert";

export const metadata = {
  title: "Profile",
};
export const dynamic = "force-dynamic";

async function Profile() {
  const profile = await getProfile();
  if (!profile) notFound();

  return (
    <div className="space-y-5 profile-page">
      <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
        <div
          className="absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg flex items-center justify-center
             bg-gradient-to-r from-[#c8a25e] via-[#d4b06a] to-[#e1be76] dark:from-slate-700 dark:via-slate-700 dark:to-slate-700"
        >
          <h3 className="text-white">PROFILE</h3>
        </div>
        <div className="profile-box flex-none md:text-start text-center">
          <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
            <div className="flex-none">
              <ActionFoto profile={profile} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                {profile?.nama}
              </div>
              <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                {profile?.level?.level}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
          <div className="flex-1">
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {profile?._count?.permohonan || "0"}
            </div>
            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Survey Armada
            </div>
          </div>

          <div className="flex-1">
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {profile?._count?.keberatan || "0"}
            </div>
            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Survet Halte
            </div>
          </div>

          <div className="flex-1">
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {profile?._count?.penelitian || "0"}
            </div>
            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Survey Headway
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-4 col-span-12">
          <Card title="INFORMASI">
            <ul className="list space-y-8">
              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:envelope" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    EMAIL
                  </div>
                  <a
                    href="mailto:someone@example.com"
                    className="text-base text-slate-600 dark:text-slate-50"
                  >
                    {profile?.email || "-"}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:phone-arrow-up-right" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    PHONE
                  </div>
                  <a
                    href="tel:0189749676767"
                    className="text-base text-slate-600 dark:text-slate-50"
                  >
                    {profile?.telp || "-"}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:map" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    ALAMAT
                  </div>
                  <div className="text-base text-slate-600 dark:text-slate-50">
                    {profile?.alamat || "-"}
                  </div>
                </div>
              </li>
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-8 col-span-12">
          <Card title="PENGATURAN">
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
              <Card>
                <div className="space-y-6">
                  <div className="flex space-x-3 items-center rtl:space-x-reverse">
                    <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-slate-300 flex flex-col items-center justify-center text-lg">
                      <Icons icon="solar:settings-broken" />
                    </div>
                    <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                      Update Profile
                    </div>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">
                    Lengkapi data diri pengguna aplikasi
                  </div>
                  <Link
                    href="/admin/profile/edit"
                    scroll={false}
                    className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-slate-600 dark:text-slate-300"
                  >
                    <span>Buka Formulir</span>
                    <Icons icon="solar:alt-arrow-right-linear" />
                  </Link>
                </div>
              </Card>
              <Card>
                <div className="space-y-6">
                  <div className="flex space-x-3 items-center rtl:space-x-reverse">
                    <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                      <Icons icon="solar:folder-security-broken" />
                    </div>
                    <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                      Ganti Password
                    </div>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-sm">
                    Ganti Password secara berkala untuk menjaga keamanan akses
                    menuju aplikasi
                  </div>
                  <Link
                    href="/admin/profile/password"
                    scroll={false}
                    className="inline-flex items-center space-x-3 rtl:space-x-reverse text-sm capitalize font-medium text-slate-600 dark:text-slate-300"
                  >
                    <span>Buka Formulir</span>
                    <Icons icon="solar:alt-arrow-right-linear" />
                  </Link>
                </div>
              </Card>
            </div>

            <div className="mt-3">
              <MfaStatus profile={profile} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
