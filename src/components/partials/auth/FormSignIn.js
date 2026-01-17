"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/providers/auth-provider";

export default function FormSignIn() {
  const { signIn } = useAuthContext();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data, callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        type="text"
        name="username"
        label="username"
        placeholder="Username"
        {...register("username", { required: true })}
        error={errors?.username}
      />

      <Textinput
        type="password"
        name="password"
        label="password"
        placeholder="password"
        {...register("password", { required: true })}
        error={errors?.password}
        hasicon
      />

      {error && (
        <div className="text-red-500 flex">
          <p className="mx-auto">Gagal Login</p>
        </div>
      )}

      <Button type="submit" className="btn-gold w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}
