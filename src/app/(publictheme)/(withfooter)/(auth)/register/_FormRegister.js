"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import { useAuthPublic } from "@/providers/auth-public-provider";
import GoogleAuth from "@/components/front/GoogleAuth";

function FormRegister() {
  const { registerUser } = useAuthPublic();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  return (
    <>
      <div className="text-center">
        <h1 className="fs-2">Buat Akun!</h1>
      </div>

      <div className="text-center">
        <Link href="/">
          <Image
            className="img-fluid"
            src="/assets/images/logo-color.png"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "55px", height: "auto" }}
            alt="logo"
          />
        </Link>
      </div>

      <form className="mt-3 text-start" onSubmit={handleSubmit(registerUser)}>
        <div className="form">
          <TextInputPublic
            label="Email *"
            name="email"
            type="email"
            id="email"
            {...register("email", {
              required: "Wajib Diisi",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Format email tidak valid",
              },
            })}
            error={errors.email}
          />

          <TextInputPublic
            label="Username *"
            name="username"
            id="username"
            {...register("username", { required: "Wajib Diisi" })}
            error={errors.username}
          />

          <TextInputPublic
            label="Password *"
            name="password"
            type="password"
            id="password"
            hasicon
            autoComplete="new-password"
            {...register("password", { required: "Wajib Diisi" })}
            error={errors.password}
          />

          <TextInputPublic
            label="Confirm Password *"
            name="password_confirm"
            type="password"
            id="password_confirm"
            autoComplete="new-password"
            {...register("password_confirm", {
              required: "Input Ulang Password Baru",
              validate: (value) =>
                value === password || "Konfirmasi password tidak cocok",
            })}
            error={errors.password_confirm}
          />

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary full-width fw-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Buat Akun"}
            </button>
          </div>
        </div>
      </form>

      <div className="prixer my-4">
        <div className="devider-wraps position-relative">
          <div className="devider-text text-muted text-md">
            Atau Login Otomatis Pakai
          </div>
        </div>
      </div>

      <GoogleAuth />

      <div className="text-center">
        <p className="text-dark mt-3 mb-0">
          Sudah Punya Akun?
          <Link href="/signin" className="fw-medium text-primary">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </>
  );
}

export default FormRegister;
