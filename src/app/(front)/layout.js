"use client";

import { ToastContainer } from "react-toastify";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";
import useRtl from "@/themes/dashcode/hooks/useRtl";
import useSkin from "@/themes/dashcode/hooks/useSkin";

export default function AuthLayout({ children, modalFormSurvey }) {
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const [skin] = useSkin();
  return (
    <>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={`app-warp ${isDark ? "dark" : ""} ${
          skin === "bordered" ? "skin--bordered" : "skin--default"
        }
      `}
      >
        <ToastContainer
          position={isRtl ? "top-left" : "top-right"}
          autoClose={5000}
          closeOnClick
          rtl={isRtl ? true : false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? "dark" : "light"}
        />
        {modalFormSurvey}
        {children}
      </div>
    </>
  );
}
