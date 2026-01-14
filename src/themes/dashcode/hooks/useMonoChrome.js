import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleMonoChrome } from "@/themes/dashcode/store/layoutReducer";

const useMonoChrome = () => {
  const dispatch = useDispatch();
  const isMonoChrome = useSelector((state) => state.layout.isMonochrome);

  const setMonoChrome = (val) => {
    dispatch(handleMonoChrome(val));
    localStorage.setItem("monochrome", JSON.stringify(val));
  };

  useEffect(() => {
    const element = document.getElementsByTagName("html")[0];
    const storedMode = localStorage.getItem("monochrome");
    if (storedMode !== null) {
      dispatch(handleMonoChrome(JSON.parse(storedMode)));
    }

    if (isMonoChrome) {
      element.classList.add("grayscale");
    } else {
      element.classList.remove("grayscale");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMonoChrome]);

  return [isMonoChrome, setMonoChrome];
};

export default useMonoChrome;
