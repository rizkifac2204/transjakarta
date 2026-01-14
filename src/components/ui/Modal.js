"use client";
import { useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function Modal({ children }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onFullScreen = () => {
    window.location.reload();
  };

  const onClick = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[95%] sm:w-10/12 md:w-8/12 lg:w-2/5
        max-h-[80vh] sm:max-h-[85vh] lg:max-h-[90vh]
        overflow-y-auto
        bg-white dark:bg-slate-800
        rounded-xl
        mb-28 sm:mb-10"
      >
        <div
          className="absolute top-4 right-12 cursor-pointer text-2xl text-slate-800 dark:text-slate-200"
          onClick={onFullScreen}
        >
          <Icon icon="solar:full-screen-circle-broken" />
        </div>
        <div
          className="absolute top-4 right-4 cursor-pointer text-2xl text-slate-800 dark:text-slate-200"
          onClick={onDismiss}
        >
          <Icon icon="solar:close-circle-broken" />
        </div>
        {children}
      </div>
    </div>
  );
}
