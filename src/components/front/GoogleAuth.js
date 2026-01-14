"use client";

import { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

export default function GoogleAuth() {
  const initializedRef = useRef(false);

  const handleLogin = async (response) => {
    const decoded = jwtDecode(response.credential);
    try {
      const res = await axios.post(`/api/publik/auth/check-email`, {
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
      });
      console.log(res);
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Kegagalan");
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;

    const initializeGoogle = () => {
      if (!window.google || initializedRef.current) return;

      initializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleLogin,
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {
          size: "large",
          shape: "pill",
        }
      );

      window.google.accounts.id.prompt();
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogle;
    script.async = true;
    script.id = "google-client-script";
    document.querySelector("body")?.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, []);

  return (
    <div className="d-flex justify-content-center">
      <div id="signInDiv"></div>
    </div>
  );
}
