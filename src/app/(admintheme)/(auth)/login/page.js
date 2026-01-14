import Link from "next/link";
import Image from "next/image";
import FormSignIn from "@/components/partials/auth/FormSignIn";

export default async function Login() {
  return (
    <>
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <h4>
                PPID{" "}
                <span className="text-slate-800 dark:text-slate-400 font-bold">
                  KP2MI
                </span>
              </h4>
            </div>
            <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1] pt-20">
              <Image
                src="/assets/images/logo-color.png"
                alt=""
                priority
                width={500}
                height={200}
                className="mx-auto"
                style={{ width: "auto" }}
              />
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block relative">
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
                  <h4 className="font-medium">Sign in</h4>
                  <div className="text-slate-500 text-base">
                    Login Menuju Halaman Admin
                  </div>
                </div>
                <FormSignIn />
              </div>
              <div className="auth-footer text-center">
                Copyright 2025, Kementerian Pelindungan Pekerja Migran
                Indonesia.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
