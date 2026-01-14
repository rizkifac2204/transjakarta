import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleDarkMode } from "@/themes/dashcode/store/layoutReducer";

const useDarkmode = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.layout.darkMode);

  const setDarkMode = (mode) => {
    dispatch(handleDarkMode(mode));
    localStorage.setItem("darkMode", JSON.stringify(mode));
  };

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");

    if (storedDarkMode !== null) {
      dispatch(handleDarkMode(JSON.parse(storedDarkMode)));
    } else {
      // Deteksi dari sistem jika tidak ada setting disimpan
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(handleDarkMode(systemPrefersDark));
    }
  }, [dispatch]);

  return [isDark, setDarkMode];
};

export default useDarkmode;
