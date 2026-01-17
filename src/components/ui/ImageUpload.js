"use client";

import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import Image from "next/image";

const ImageUpload = ({
  label = "Browse",
  placeholder = "Pilih gambar atau letakkan di sini...",
  className = "",
  error,
  id,
  name,
  disabled,
  onChange,
  initialImageUrl,
  maxFileSize,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [sizeError, setSizeError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(initialImageUrl);
  }, [initialImageUrl]);

  const validateFileSize = (file) => {
    if (!maxFileSize || !file) return null;
    if (file.size > maxFileSize) {
      return `Ukuran file maksimal ${Math.floor(maxFileSize / 1024 / 1024)}MB`;
    }
    return null;
  };

  const handleFileChange = (e) => {
    setSizeError("");
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const errorMsg = validateFileSize(file);
    if (errorMsg) {
      setSizeError(errorMsg);
      setSelectedFile(null);
      setPreviewUrl(initialImageUrl);
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="form-label mb-1 block capitalize">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="file"
          id={id}
          name={name}
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <div
          className={`w-full h-[40px] file-control flex items-center ${className} ${
            error || sizeError ? "border border-red-500 rounded" : ""
          }`}
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedFile ? (
              <span className="text-slate-900 dark:text-white">
                {selectedFile.name}
              </span>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </span>

          <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs rounded-tr rounded-br font-normal">
            Browse
          </span>
        </div>
      </div>

      {sizeError && (
        <div className="text-danger-500 block text-sm mt-1">{sizeError}</div>
      )}

      {previewUrl && (
        <div className="relative w-[200px] h-[200px] mx-auto mt-6 border p-2 rounded border-slate-200">
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center z-10"
            title="Hapus"
            disabled={disabled}
          >
            &times;
          </button>
          <Image
            src={previewUrl}
            alt="Preview"
            width={400}
            height={300}
            unoptimized
            className="w-full h-full block rounded object-contain"
          />
        </div>
      )}
    </div>
  );
};

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
