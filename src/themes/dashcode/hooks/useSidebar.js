import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleSidebarCollapsed } from "@/themes/dashcode/store/layoutReducer";

const useSidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.layout.isCollapsed);

  // ** Toggles Menu Collapsed
  const setMenuCollapsed = (val) => dispatch(handleSidebarCollapsed(val));

  useEffect(() => {
    const storedMode = localStorage.getItem("sidebarCollapsed");
    if (storedMode !== null) {
      dispatch(handleSidebarCollapsed(JSON.parse(storedMode)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [collapsed, setMenuCollapsed];
};

export default useSidebar;
