"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";
import Icons from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { encodeId } from "@/libs/hash/hashId";
import { Menu } from "@headlessui/react";

function ActionJawaban({ item, foreignKey, section }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `/api/${section}/${item[foreignKey]}/jawaban/${item.id}`
      );
      toast.success(res?.data?.message);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dropdown
      classMenuItems="right-0 w-[140px] top-[110%]"
      label={
        <span className="text-xl text-center block w-full">
          <Icons icon="heroicons-outline:dots-vertical" />
        </span>
      }
    >
      <div
        className={`divide-y divide-slate-100 dark:divide-slate-800 ${
          isDeleting ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <Menu.Item>
          {({ close }) => (
            <Link
              scroll={false}
              href={`/admin/${section}/${encodeId(
                item[foreignKey]
              )}/jawaban/${encodeId(item.id)}`}
              onClick={close}
              className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50
                w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm cursor-pointer 
                flex space-x-2 items-center rtl:space-x-reverse"
            >
              <span className="text-base">
                <Icons icon={"solar:eye-broken"} />
              </span>
              <span>Lihat</span>
            </Link>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ close }) => (
            <Link
              scroll={false}
              href={`/admin/${section}/${encodeId(
                item[foreignKey]
              )}/jawaban/${encodeId(item.id)}/edit`}
              onClick={close}
              className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50
                w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm cursor-pointer 
                flex space-x-2 items-center rtl:space-x-reverse"
            >
              <span className="text-base">
                <Icons icon={"solar:pen-2-broken"} />
              </span>
              <span>Edit</span>
            </Link>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ close }) => (
            <button
              onClick={() => {
                close(); // tutup dropdown sebelum hapus
                handleDelete();
              }}
              className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50
                w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm
                flex space-x-2 items-center rtl:space-x-reverse"
            >
              <span className="text-base">
                {isDeleting ? (
                  <Icons
                    icon="line-md:loading-twotone-loop"
                    className="animate-spin"
                  />
                ) : (
                  <Icons icon="solar:trash-bin-2-broken" />
                )}
              </span>
              <span>Hapus</span>
            </button>
          )}
        </Menu.Item>
      </div>
    </Dropdown>
  );
}

export default ActionJawaban;
