import { useEffect } from "react";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/themes/dashcode/hooks/useDarkMode";

const SwitchDark = () => {
  const [isDark, setDarkMode] = useDarkMode();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("bg-slate-900");
    } else {
      document.body.classList.remove("bg-slate-900");
    }
  }, [isDark]);

  return (
    <span>
      <div
        className="lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
        onClick={() => setDarkMode(!isDark)}
      >
        {isDark ? (
          <Icon icon="heroicons-outline:sun" />
        ) : (
          <Icon icon="heroicons-outline:moon" />
        )}
      </div>
    </span>
  );
};

export default SwitchDark;
