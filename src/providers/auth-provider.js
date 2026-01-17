"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import getRecaptchaToken from "@/utils/getRecaptchaToken";

const AuthContext = createContext({
  user: null,
  isLoading: true,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const signIn = async (data, callbackUrl) => {
    try {
      const token = await getRecaptchaToken("login");
      const res = await axios.post("/api/auth", { ...data, token: token });

      if (res.data.status === "success") {
        if (callbackUrl) {
          window.open(callbackUrl, "_self");
        } else {
          window.open("/admin", "_self");
        }
      } else if (res.data.status === "mfa_required") {
        const tempToken = res.data.tempToken;
        router.push(`/login/otp?token=${tempToken}`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Terjadi kesalahan",
      );
    }
  };

  const signOut = async () => {
    try {
      const res = await axios.delete(`/api/auth`);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.log("Error Something");
    }
  };

  const submitOtp = async (data) => {
    const tempToken = new URLSearchParams(window.location.search).get("token");
    if (!tempToken) {
      toast.error("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
    try {
      const res = await axios.post("/api/auth/otp", {
        otp: data.otp,
        tempToken,
      });

      if (res.data.status === "success") {
        router.push("/admin");
      } else {
        toast.error(res.data.message || "Terjadi kesalahan");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "OTP salah atau kadaluarsa",
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();
    axios
      .get(`/api/auth`, { signal: controller.signal })
      .then((res) => {
        setUser(res.data.payload);
      })
      .catch((error) => {
        setUser(null);
      })
      .then(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [router]);

  const context = { user, isLoading, signIn, signOut, submitOtp };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
