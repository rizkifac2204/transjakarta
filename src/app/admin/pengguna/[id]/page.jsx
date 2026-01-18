import React from "react";
import { getUserById } from "@/libs/user";
import { notFound } from "next/navigation";
import { verifyAuth } from "@/libs/jwt";
import { redirect } from "next/navigation";
import ActionFotoPengguna from "./_ActionFotoPengguna";
import ActionPengguna from "./_ActionPengguna";
import Card from "@/components/ui/Card";
import Icons from "@/components/ui/Icon";
import FormEditPengguna from "./_FormEditPengguna";
import Link from "next/link";
import { decodeOrNotFound } from "@/libs/hash/safeDecode";
import { encodeId } from "@/libs/hash/hashId";

async function UserDetailPage({ params }) {
  const auth = await verifyAuth();
  const id = decodeOrNotFound(params.id);
  const data = await getUserById(id);
  if (!data) notFound();

  const pengguna = {
    ...data,
    isManage: data?.level_id > auth.level,
  };

  if (Number(id) === Number(auth.id)) {
    redirect("/admin/profile");
  }

  return (
    <div className="space-y-5 profile-page">
      <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
        <div
          className="absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg flex items-center justify-center
             bg-gradient-to-r from-[#18448f] via-[#18448f] to-[#2f82c4] dark:from-slate-700 dark:via-slate-700 dark:to-slate-700"
        >
          <h3 className="text-white">ADMIN</h3>
        </div>
        <div className="profile-box flex-none md:text-start text-center">
          <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
            <div className="flex-none">
              <ActionFotoPengguna pengguna={pengguna} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                {pengguna?.nama}
              </div>
              <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                {pengguna?.level?.level}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
          <div className="flex-1">
            <Link href={`/admin/permohonan?q=${encodeId(pengguna.id)}`}>
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {pengguna?._count?.permohonan || "0"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Data Survey Armada
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <Link href={`/admin/keberatan?q=${encodeId(pengguna.id)}`}>
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {pengguna?._count?.keberatan || "0"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Data Survey Halte
              </div>
            </Link>
          </div>

          <div className="flex-1">
            <Link href={`/admin/penelitian?q=${encodeId(pengguna.id)}`}>
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {pengguna?._count?.penelitian || "0"}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Data Survey Headway
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <Card
            title="INFORMASI"
            headerslot={pengguna.isManage ? <ActionPengguna id={id} /> : null}
          >
            <ul className="list space-y-8">
              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:envelope" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    EMAIL
                  </div>
                  <a
                    href={pengguna?.email ? `mailto:${pengguna?.email}` : ""}
                    className="text-base text-slate-600 dark:text-slate-50"
                  >
                    {pengguna?.email || "-"}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:phone-arrow-up-right" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    PHONE
                  </div>
                  <a
                    href={pengguna?.telp || "-"}
                    className="text-base text-slate-600 dark:text-slate-50"
                  >
                    {pengguna?.telp || "-"}
                  </a>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-slate-600 dark:text-slate-300">
                  <Icons icon="solar:shield-broken" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    USERNAME
                  </div>
                  <span className="text-base text-slate-600 dark:text-slate-50">
                    {pengguna?.username || "-"}
                  </span>
                </div>
              </li>

              <li className="flex space-x-3 rtl:space-x-reverse">
                <div className="flex-none text-slate-600 dark:text-slate-300">
                  <Icons icon="heroicons:map" />
                </div>
                <div className="flex-1">
                  <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                    ALAMAT
                  </div>
                  <div className="text-base text-slate-600 dark:text-slate-50">
                    {pengguna?.alamat || "-"}
                  </div>
                </div>
              </li>
            </ul>
          </Card>
        </div>

        <div className="lg:col-span-6 col-span-12">
          <FormEditPengguna pengguna={pengguna} />
        </div>
      </div>
    </div>
  );
}

export default UserDetailPage;
