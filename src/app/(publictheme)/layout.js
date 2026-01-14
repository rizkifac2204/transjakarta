import "bootstrap/dist/css/bootstrap.css";
import "../../themes/listing/scss/style.scss";
import "animate.css/animate.css";
import "../globals.css";

import appConfig from "@/configs/appConfig";
import AuthContextProvider from "@/providers/auth-provider";
import AuthPublicProvider from "@/providers/auth-public-provider";
import WhatsappProvider from "@/providers/whatsapp-provider";
import { NotFoundProvider } from "@/providers/not-found-context";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/front/navbar/Navbar";
import BackToTop from "@/components/front/BackToTop";
import Script from "next/script";

export const metadata = {
  title: {
    default: appConfig.app.name,
    template: `%s | ${appConfig.app.name}`,
  },
  description: appConfig.app.description,
};

export default function RootPublicLayout({ children, modal }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.ico" sizes="any" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <Script
          src="https://cdn.userway.org/widget.js"
          data-account="VgGKGAYujO"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <NotFoundProvider>
          <AuthContextProvider>
            <AuthPublicProvider>
              <WhatsappProvider>
                <Navbar />

                <main role="main" id="main-content">
                  {children}
                </main>

                <BackToTop />

                <ToastContainer
                  autoClose={5000}
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  aria-live="polite"
                  style={{
                    position: "fixed",
                    zIndex: 9999,
                    top: "1rem",
                    right: "1rem",
                  }}
                />
              </WhatsappProvider>
            </AuthPublicProvider>
          </AuthContextProvider>
        </NotFoundProvider>
      </body>
    </html>
  );
}
