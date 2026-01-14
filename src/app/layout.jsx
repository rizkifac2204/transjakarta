import "simplebar-react/dist/simplebar.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../themes/dashcode/scss/app.scss";
import "./globals.css";

import Script from "next/script";
import appConfig from "@/configs/appConfig";
import AuthContextProvider from "@/providers/auth-provider";

import ThemeProvider from "@/providers/theme-provider";

export const metadata = {
  title: {
    default: appConfig.app.name,
    template: `%s | ${appConfig.app.name}`,
  },
  description: appConfig.app.description,
};

export default function RootAdminLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/assets/favicon.ico" sizes="any" />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
