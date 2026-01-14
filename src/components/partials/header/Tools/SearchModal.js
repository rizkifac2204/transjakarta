import React, { Fragment, useState } from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import menuItems from "@/configs/menuItems";
import Link from "next/link";

const SearchModal = () => {
  const { user } = useAuthContext();
  let [isOpen, setIsOpen] = useState(false);
  const userLevel = user?.level;

  const filteredMenu = menuItems
    .map((item) => {
      // Langsung skip jika tidak punya akses
      if (item.access_level && !item.access_level.includes(userLevel)) {
        return null;
      }

      // Jika ada anak (child), lakukan filter juga
      if (item.child) {
        const filteredChild = item.child.filter(
          (child) =>
            !child.access_level || child.access_level.includes(userLevel)
        );

        // Jika setelah difilter tidak ada child yang tersisa, skip juga
        if (filteredChild.length === 0) return null;

        return { ...item, child: filteredChild };
      }

      return item;
    })
    .filter(Boolean);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const [query, setQuery] = useState(" ");

  const filteredSearchList = filteredMenu
    .filter((item) => !item.isHeader) // Menghapus item dengan isHeader: true
    .flatMap((item) => {
      const queryLower = query.toLowerCase();

      if (item.child && Array.isArray(item.child)) {
        // Mencari child yang cocok dengan query
        const matchingChildren = item.child.filter((child) =>
          child.childtitle.toLowerCase().includes(queryLower)
        );
        if (matchingChildren.length > 0) {
          // Mengembalikan array child yang cocok
          return matchingChildren;
        }
      }

      // Memeriksa apakah title item cocok dengan query
      if (item.title.toLowerCase().includes(queryLower)) {
        return [item];
      }

      // Jika tidak ada yang cocok, kembalikan array kosong
      return [];
    });

  return (
    <>
      <div>
        <button
          className="flex items-center xl:text-sm text-lg xl:text-slate-400 text-slate-800 dark:text-slate-300 px-1 space-x-3 rtl:space-x-reverse"
          onClick={openModal}
        >
          <>
            <Icon icon="heroicons-outline:search" />
            <span className="xl:inline-block hidden">Search... </span>
          </>
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[9999] overflow-y-auto p-4 md:pt-[25vh] pt-20"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-filter backdrop-blur-sm backdrop-brightness-10" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel>
              <Combobox>
                <div className="relative">
                  <div className="relative mx-auto max-w-xl rounded-md bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-gray-500-500 dark:ring-light divide-y divide-gray-500-300 dark:divide-light">
                    <div className="flex bg-white dark:bg-slate-800  px-3 rounded-md py-3 items-center">
                      <div className="flex-0  text-slate-700 dark:text-slate-300 ltr:pr-2 rtl:pl-2 text-lg">
                        <Icon icon="heroicons-outline:search" />
                      </div>
                      <Combobox.Input
                        className="bg-transparent outline-none focus:outline-none border-none w-full flex-1 dark:placeholder:text-slate-300 dark:text-slate-200"
                        placeholder="Search..."
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="max-h-40 overflow-y-auto text-sm py-2">
                        {filteredSearchList.length === 0 && query !== "" && (
                          <div>
                            <div className=" text-base py-2 px-4">
                              <p className="text-slate-500 text-base dark:text-white">
                                No result found
                              </p>
                            </div>
                          </div>
                        )}

                        {filteredSearchList.map((item, i) => (
                          <Combobox.Option key={i}>
                            {({ active }) => (
                              <div
                                className={`px-4 text-[15px] font-normal capitalize py-2 ${
                                  active
                                    ? "bg-slate-900 dark:bg-slate-600 dark:bg-opacity-60 text-white"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                <Link
                                  href={item?.link || item?.childlink}
                                  onClick={closeModal}
                                >
                                  {item?.title || item?.childtitle}
                                </Link>
                              </div>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchModal;
