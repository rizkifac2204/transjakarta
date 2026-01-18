"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Textinput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

function ProfileMfaContent({ secret }) {
  const router = useRouter();
  const [qrImage, setQrImage] = useState("");
  const otpauthUrl = secret?.otpauth_url;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!otpauthUrl) return;

    let isMounted = true;
    QRCode.toDataURL(otpauthUrl)
      .then((dataUrl) => {
        if (isMounted) setQrImage(dataUrl);
      })
      .catch(() => isMounted && setQrImage(""));

    return () => {
      isMounted = false;
    };
  }, [otpauthUrl]);

  async function onSubmit(data) {
    try {
      const res = await axios.post(`/api/profile/mfa`, { token: data.otp });
      toast.success(res?.data?.message || "Berhasil");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <>
      {qrImage ? (
        <div className="flex flex-col items-center mb-4">
          <Image
            src={qrImage}
            alt="QR Code"
            width={256}
            height={256}
            className="w-64 h-64 mb-2"
          />
          <p className="text-sm">
            Scan QR ini di aplikasi Google Authenticator atau aplikasi sejenis.
          </p>
        </div>
      ) : null}

      {secret?.base32 && (
        <p className="mb-4 text-center">
          <span className="font-mono border px-2 py-1 rounded">
            {secret.base32}
          </span>
          <br />
          <span className="text-xs text-gray-500">
            Gunakan kode ini jika tidak bisa scan QR
          </span>
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <Textinput
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          placeholder="Masukkan 6 digit OTP"
          {...register("otp", {
            required: "Masukan 6 Digit OTP",
          })}
          error={errors?.otp}
        />

        <Button
          type="submit"
          className="btn-gold w-full"
          isLoading={isSubmitting}
          icon="hugeicons:sent"
        >
          Submit
        </Button>
      </form>
    </>
  );
}

export default ProfileMfaContent;
