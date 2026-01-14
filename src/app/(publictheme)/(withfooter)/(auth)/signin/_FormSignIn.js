"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import { useAuthPublic } from "@/providers/auth-public-provider";
import GoogleAuth from "@/components/front/GoogleAuth";

function FormSignIn() {
  const { signIn } = useAuthPublic();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <div className="text-center">
        <h1 className="fs-2">Login!</h1>
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

      <form className="mt-3 text-start" onSubmit={handleSubmit(signIn)}>
        <div className="form">
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
            autoComplete="current-password"
            {...register("password", { required: "Wajib Diisi" })}
            error={errors.password}
          />

          <div className="form-group mb-4">
            <button
              type="submit"
              className="btn btn-primary full-width fw-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Sign In"}
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
          Belum Punya Akun?
          <Link href="/register" className="fw-medium text-primary">
            {" "}
            Daftar
          </Link>
        </p>
      </div>
    </>
  );
}

export default FormSignIn;
