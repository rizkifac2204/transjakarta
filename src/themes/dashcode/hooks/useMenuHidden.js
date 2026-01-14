import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleMenuHidden } from "@/themes/dashcode/store/layoutReducer";

const useMenuHidden = () => {
  const dispatch = useDispatch();
  const menuHidden = useSelector((state) => state.layout.menuHidden);

  const setMenuHidden = (value) => {
    dispatch(handleMenuHidden(value));
  };

  useEffect(() => {
    const storedMode = localStorage.getItem("menuHidden");
    if (storedMode !== null) {
      dispatch(handleMenuHidden(JSON.parse(storedMode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [menuHidden, setMenuHidden];
};

export default useMenuHidden;
