"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Icon from "./Icon";
import {
  IMAGE_TYPES,
  PDF_TYPES,
  AUDIO_TYPES,
  WORD_TYPES,
  EXCEL_TYPES,
} from "@/configs/appConfig";

function getFileExtension(filename = "") {
  if (!filename) return "File";
  return filename.split(".").pop()?.toLowerCase();
}

export default function FilePreview({
  fileUrl,
  filename = "File",
  isUser = false,
  label,
  className,
  noLink = false,
  width,
  height,
}) {
  const ext = getFileExtension(filename);
  const [imgSrc, setImgSrc] = useState(fileUrl || "/assets/images/user.png");
  useEffect(() => {
    setImgSrc(fileUrl || "/assets/images/user.png");
  }, [fileUrl]);

  if (isUser) {
    if (noLink) {
      return (
        <Image
          src={imgSrc}
          alt={filename || "Image"}
          width={width ? width : 250}
          height={height ? height : 250}
          className={className ? className : "rounded-md object-cover"}
          onError={() => setImgSrc("/assets/images/user.png")}
          priority
        />
      );
    }
    return (
      <Link
        href={fileUrl || "#"}
        {...(fileUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <Image
          src={imgSrc}
          alt={filename || "Image"}
          width={250}
          height={250}
          className={className ? className : "rounded-md object-cover"}
          onError={() => setImgSrc("/assets/images/user.png")}
          priority
        />
      </Link>
    );
  }

  if (IMAGE_TYPES.includes(ext)) {
    return (
      <div className="flex flex-col gap-2 items-center mt-2">
        {label ? label : null}
        <Link href={fileUrl || "#"} target="_blank" rel="noopener noreferrer">
          <Image
            src={fileUrl}
            alt={filename}
            width={width ? width : 250}
            height={height ? height : 250}
            className={className ? className : "rounded-md object-cover"}
            style={{ width: "auto" }}
            onError={(e) => (e.target.src = "/assets/images/user.png")}
            priority
          />
        </Link>
      </div>
    );
  }

  if (PDF_TYPES.includes(ext)) {
    return (
      <div className="flex flex-col gap-2 items-center mt-2">
        <div className="flex gap-2 items-center">
          {label ? <>{label}</> : null}
          {fileUrl ? (
            <Link
              href={fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="solar:eye-scan-outline" />
            </Link>
          ) : null}
        </div>
        <iframe
          src={fileUrl}
          title={filename}
          className="w-full min-h-[210px] border rounded"
        />
      </div>
    );
  }

  if (AUDIO_TYPES.includes(ext)) {
    return (
      <div className="flex flex-col gap-2 items-center mt-2">
        <div className="flex gap-2 items-center">
          {label ? <>{label}</> : null}
          {fileUrl ? (
            <Link
              href={fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="solar:eye-scan-outline" />
            </Link>
          ) : null}
        </div>
        <audio controls>
          <source src={fileUrl} type={`audio/${ext}`} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (WORD_TYPES.includes(ext)) {
    return (
      <div className="flex flex-col gap-2 items-center mt-2">
        {label ? label : null}
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline text-sm"
        >
          <Icon icon="icon-park-outline:word" width="48" height="48" />
          {filename}
        </a>
      </div>
    );
  }

  if (EXCEL_TYPES.includes(ext)) {
    return (
      <div className="flex flex-col gap-2 items-center mt-2">
        {label ? label : null}
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline text-sm"
        >
          <Icon icon="icon-park-outline:excel" width="48" height="48" />
          {filename}
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon icon="solar:adhesive-plaster-broken" width="48" height="48" />
      <span>File tidak ditemukan: {filename}</span>
    </div>
  );
}
