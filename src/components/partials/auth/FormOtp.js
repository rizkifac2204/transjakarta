"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/providers/auth-provider";

export default function FormOtp() {
  const { submitOtp } = useAuthContext();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const tempToken = searchParams.get("token");

  const [user, setUser] = useState(null);
  const [tokenValid, setTokenValid] = useState(true); // state validasi token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tempToken) {
      fetch(`/api/auth/otp?token=${tempToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userData) {
            setUser(data.userData);
            setTokenValid(true);
          } else {
            setTokenValid(false); // token tidak valid / expired
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setTokenValid(false);
          setLoading(false);
        });
    } else {
      setTokenValid(false);
      setLoading(false);
    }
  }, [tempToken]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (loading) return <p>Loading...</p>;

  if (!tokenValid) {
    return (
      <div className="text-center text-red-600">
        Token tidak valid atau sudah kadaluarsa. Silakan ulangi{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
        .
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitOtp)} className="space-y-4">
      {user && <h4>Login Sebagai {user.nama}</h4>}

      <Textinput
        id="otp"
        type="text"
        inputMode="numeric"
        pattern="\d{6}"
        maxLength={6}
        label="One-time code"
        {...register("otp", { required: true })}
        error={errors?.otp}
      />

      {error && (
        <div className="text-red-500 flex">
          <p className="mx-auto">Invalid</p>
        </div>
      )}

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}
