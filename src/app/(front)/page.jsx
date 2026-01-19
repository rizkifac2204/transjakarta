"use client";

import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const tables2 = [
  {
    title: "Armada",
    icon: "solar:bus-broken",
    des: "Formulir Armada",
    button: "Lakukan Survey",
    link: "/admin/armada/add",
    text: "Formulir untuk mengisi data survey SPM Armada Transjakarta",
  },
  {
    title: "Halte",
    icon: "solar:streets-navigation-broken",
    des: "Formulir Halte",
    button: "Lakukan Survey",
    link: "/admin/shelter/add",
    text: "Formulir untuk mengisi data survey SPM Halte Transjakarta",
  },
  {
    title: "Headway",
    icon: "solar:flip-horizontal-broken",
    des: "Formulir Headway",
    button: "Lakukan Survey",
    link: "/admin/headway/add",
    text: "Formulir untuk mengisi data survey Headway Layanan Transjakarta",
  },
];

function Page() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  if (!user)
    return (
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6  block relative">
                  <Link href="/">
                    <Image
                      src="/assets/images/logo-color.png"
                      alt=""
                      priority
                      width={100}
                      height={50}
                      className="mx-auto"
                      style={{ width: "auto" }}
                    />
                  </Link>
                </div>
                <div className="text-center 2xl:mb-10 mb-4">
                  <h4 className="font-medium">Selamat Datang</h4>
                  <div className="">
                    Aplikasi ini dibangun untuk mengelola data capaian Standar
                    Pelayanan Minimal (SPM) Armada, Halte dan Headway
                    Transjakarta 2025
                  </div>
                </div>
                <Link
                  href="/login?callbackUrl=/"
                  className="btn-primary rounded w-full text-center p-3"
                >
                  Login untuk melanjutkan pengisian Survey
                </Link>
              </div>
              <div className="auth-footer text-center">
                Copyright 2026, PT Surveyor Indonesia.
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="p-2">
          <div className="text-center mb-6">
            <Link href="/">
              <Image
                src="/assets/images/logo-color.png"
                alt=""
                priority
                width={100}
                height={50}
                className="mx-auto"
                style={{ width: "auto" }}
              />
            </Link>
          </div>

          <div className="text-center mb-6">
            <h4>Selamat Datang, {user?.nama}</h4>
            Kunjungi halaman{" "}
            <Link className="underline" href="/admin">
              Admin
            </Link>{" "}
            untuk mengelola data
          </div>

          <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5">
            {tables2.map((item, i) => (
              <div
                className={`price-table border dark:border-none rounded-[6px] shadow-lg dark:bg-slate-800 p-6 dark:text-white`}
                key={i}
              >
                <header className="mb-6">
                  <h4 className={`text-xl mb-5`}>{item.title}</h4>
                  <div className="flex items-center gap-x-2">
                    <span className="text-[32px] leading-10 font-medium">
                      <Icon icon={item.icon} />
                    </span>

                    <span className="text-xs bg-warning-50 text-warning-500 font-medium px-2 py-1 rounded-full inline-block dark:bg-slate-700 uppercase h-auto">
                      {item.des}
                    </span>
                  </div>
                </header>
                <div className="price-body space-y-8">
                  <p className={`text-sm leading-5`}>{item.text}</p>
                  <div>
                    <Button
                      text={item.button}
                      className={` w-full btn-outline-dark dark:border-slate-400`}
                      onClick={() => router.push(item.link, { scroll: false })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="auth-footer text-center mt-3">
            Copyright 2026, PT Surveyor Indonesia. <br />
            <button onClick={signOut} className="ml-4 text-red-600 underline">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
