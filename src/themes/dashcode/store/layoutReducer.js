import { createSlice } from "@reduxjs/toolkit";

// theme config import
import appConfig from "@/configs/appConfig";

const initialState = {
  isRTL: appConfig.layout.isRTL,
  darkMode: appConfig.layout.darkMode,
  customizer: appConfig.layout.customizer,
  semiDarkMode: appConfig.layout.semiDarkMode,
  skin: appConfig.layout.skin,
  contentWidth: appConfig.layout.contentWidth,
  type: appConfig.layout.type,
  isCollapsed: appConfig.layout.menu.isCollapsed,
  menuHidden: appConfig.layout.menu.isHidden,
  navBarType: appConfig.layout.navBarType,
  footerType: appConfig.layout.footerType,
  mobileMenu: appConfig.layout.mobileMenu,
  isMonochrome: appConfig.layout.isMonochrome,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    // handle dark mode
    handleDarkMode: (state, action) => {
      state.darkMode = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("darkMode", action.payload);
      }
    },
    // handle sidebar collapsed
    handleSidebarCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("sidebarCollapsed", action.payload);
      }
    },
    // handle customizer
    handleCustomizer: (state, action) => {
      state.customizer = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("customizer", action.payload);
      }
    },
    // handle semiDark
    handleSemiDarkMode: (state, action) => {
      state.semiDarkMode = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("semiDarkMode", action.payload);
      }
    },
    // handle rtl
    handleRtl: (state, action) => {
      state.isRTL = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "direction",
          JSON.stringify(action.payload)
        );
      }
    },
    // handle skin
    handleSkin: (state, action) => {
      state.skin = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("skin", JSON.stringify(action.payload));
      }
    },
    // handle content width
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "contentWidth",
          JSON.stringify(action.payload)
        );
      }
    },
    // handle type
    handleType: (state, action) => {
      state.type = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("type", JSON.stringify(action.payload));
      }
    },
    // handle menu hidden
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "menuHidden",
          JSON.stringify(action.payload)
        );
      }
    },
    // handle navbar type
    handleNavBarType: (state, action) => {
      state.navBarType = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "navBarType",
          JSON.stringify(action.payload)
        );
      }
    },
    // handle footer type
    handleFooterType: (state, action) => {
      state.footerType = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "footerType",
          JSON.stringify(action.payload)
        );
      }
    },
    handleMobileMenu: (state, action) => {
      state.mobileMenu = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem(
          "mobileMenu",
          JSON.stringify(action.payload)
        );
      }
    },
    handleMonoChrome: (state, action) => {
      state.isMonochrome = action.payload;
      if (typeof window !== "undefined") {
        window?.localStorage.setItem("monochrome", action.payload);
      }
    },
  },
});

export const {
  handleDarkMode,
  handleSidebarCollapsed,
  handleCustomizer,
  handleSemiDarkMode,
  handleRtl,
  handleSkin,
  handleContentWidth,
  handleType,
  handleMenuHidden,
  handleNavBarType,
  handleFooterType,
  handleMobileMenu,
  handleMonoChrome,
} = layoutSlice.actions;

export default layoutSlice.reducer;
