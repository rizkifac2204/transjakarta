import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleFooterType } from "@/themes/dashcode/store/layoutReducer";

const useFooterType = () => {
  const dispatch = useDispatch();
  const footerType = useSelector((state) => state.layout.footerType);
  const setFooterType = (val) => dispatch(handleFooterType(val));

  useEffect(() => {
    const stored = localStorage.getItem("footerType");
    if (stored !== null) {
      dispatch(handleFooterType(JSON.parse(stored)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [footerType, setFooterType];
};

export default useFooterType;
