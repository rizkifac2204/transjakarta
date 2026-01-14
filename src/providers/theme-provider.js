"use client";

import store from "@/themes/dashcode/store";
import { Provider } from "react-redux";

const ThemeProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ThemeProvider;
