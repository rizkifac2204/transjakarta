import { useEffect, useState } from "react";
import { handleSemiDarkMode } from "@/themes/dashcode/store/layoutReducer";
import { useSelector, useDispatch } from "react-redux";

const useSemiDark = () => {
  const dispatch = useDispatch();
  const isSemiDark = useSelector((state) => state.layout.semiDarkMode);
  const setSemiDark = (val) => {
    dispatch(handleSemiDarkMode(val));
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("semiDarkMode");
    if (storedMode !== null) {
      dispatch(handleSemiDarkMode(JSON.parse(storedMode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [isSemiDark, setSemiDark];
};

export default useSemiDark;
