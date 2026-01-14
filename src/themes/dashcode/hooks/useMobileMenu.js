import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleMobileMenu } from "@/themes/dashcode/store/layoutReducer";

const useMobileMenu = () => {
  const dispatch = useDispatch();
  const mobileMenu = useSelector((state) => state.layout.mobileMenu);

  // ** Toggles Mobile Menu
  const setMobileMenu = (val) => dispatch(handleMobileMenu(val));

  return [mobileMenu, setMobileMenu];
};

export default useMobileMenu;
