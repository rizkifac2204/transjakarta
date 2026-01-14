"use client";

import React from "react";
import Link from "next/link";
import { encodeId } from "@/libs/hash/hashId";
import SimpleBar from "simplebar-react";
import Card from "./Card";
import Icon from "@/components/ui/Icon";
import FilePreview from "./FilePreview";
import { PATH_UPLOAD } from "@/configs/appConfig";

const Info = ({ user }) => {
  return (
    <Card bodyClass="p-0">
      <SimpleBar className="h-full p-6">
        <div className="h-[100px] w-[100px] rounded-full mx-auto mb-4">
          <FilePreview
            fileUrl={
              user?.foto
                ? `/api/services/file/uploads/${PATH_UPLOAD.admin}/${user?.foto}`
                : null
            }
            filename={user?.foto || "Pengguna"}
            isUser={true}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="text-center">
          <h5 className="text-base text-slate-600 dark:text-slate-300 font-medium">
            {user?.nama}
          </h5>
          <h6 className="text-xs text-slate-600 dark:text-slate-300 font-normal">
            {user?.level?.level}
          </h6>
        </div>
        <ul className="list-item mt-5 space-y-4 border-b border-slate-100 dark:border-slate-700 pb-5 -mx-6 px-6">
          <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
            <div className="flex space-x-2 items-start rtl:space-x-reverse">
              <Icon icon="solar:phone-calling-bold" />
            </div>
            <div className="font-medium">{user?.telp} </div>
          </li>

          <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
            <div className="flex space-x-2 items-start rtl:space-x-reverse">
              <Icon icon="solar:mailbox-broken" />
            </div>
            <div className="font-medium">{user?.email || "-"}</div>
          </li>

          <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
            <Link href={`/admin/permohonan?q=${encodeId(user.id)}`}>
              <div className="flex space-x-2 items-start rtl:space-x-reverse">
                <Icon icon="solar:database-broken" />
                <span>Handle Permohonan</span>
              </div>
            </Link>
            <div className="font-medium">{user?._count?.permohonan || "0"}</div>
          </li>

          <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
            <Link href={`/admin/keberatan?q=${encodeId(user.id)}`}>
              <div className="flex space-x-2 items-start rtl:space-x-reverse">
                <Icon icon="solar:feed-broken" />
                <span>Handle Keberatan</span>
              </div>
            </Link>
            <div className="font-medium">{user?._count?.keberatan || "0"}</div>
          </li>

          <li className="flex justify-between text-sm text-slate-600 dark:text-slate-300 leading-[1]">
            <Link href={`/admin/penelitian?q=${encodeId(user.id)}`}>
              <div className="flex space-x-2 items-start rtl:space-x-reverse">
                <Icon icon="solar:square-academic-cap-2-broken" />
                <span>Handle Penelitian</span>
              </div>
            </Link>
            <div className="font-medium">{user?._count?.penelitian || "0"}</div>
          </li>

          <li className="text-sm text-wrap text-center border-t pt-2">
            {user?.alamat || "-"}
          </li>
        </ul>
      </SimpleBar>
    </Card>
  );
};

export default Info;
