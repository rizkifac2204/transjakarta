import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleType } from "@/themes/dashcode/store/layoutReducer";

const useMenuLayout = () => {
  const dispatch = useDispatch();
  const menuType = useSelector((state) => state.layout.type);

  const setMenuLayout = (value) => {
    dispatch(handleType(value));
  };

  useEffect(() => {
    const storedType = localStorage.getItem("type");
    if (storedType !== null) {
      dispatch(handleType(JSON.parse(storedType)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [menuType, setMenuLayout];
};

export default useMenuLayout;
