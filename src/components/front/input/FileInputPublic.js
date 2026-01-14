"use client";

import React, { useState, useEffect, forwardRef } from "react";
import Image from "next/image";

const FileInputPublic = forwardRef(
  (
    {
      label,
      placeholder = "Pilih file...",
      accept,
      error,
      preview = false,
      description,
      className = "",
      onChange,
      id = "fileinput",
      maxFileSize,
      resetKey,
      ...rest
    },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [sizeError, setSizeError] = useState("");

    const handleChange = (e) => {
      const file = e.target.files?.[0];
      setSizeError("");

      if (!file) return;

      if (maxFileSize && file.size > maxFileSize) {
        setSizeError(
          `Ukuran maksimal ${Math.floor(maxFileSize / 1024 / 1024)}MB`
        );
        return;
      }

      setSelectedFile(file);
      onChange?.(e);
    };

    const handleRemove = () => {
      setSelectedFile(null);
      const input = document.getElementById(id);
      if (input) input.value = "";
      onChange?.({ target: { name: id, files: [] } });
    };

    useEffect(() => {
      if (resetKey !== undefined) {
        setSelectedFile(null);
        setSizeError("");
        const input = document.getElementById(id);
        if (input) input.value = "";
      }
    }, [resetKey, id]);

    return (
      <div className={`form-group form-border ${className}`}>
        {label && (
          <label htmlFor={id} className="form-label">
            {label}
          </label>
        )}

        <input
          type="file"
          id={id}
          accept={accept}
          ref={ref}
          onChange={handleChange}
          className={`form-control ${error || sizeError ? "is-invalid" : ""}`}
          {...rest}
        />

        {description && (
          <div className="form-text text-xs text-muted small mt-1">
            {description}
          </div>
        )}

        {(error || sizeError) && (
          <div className="invalid-feedback d-block">
            {error?.message || sizeError}
          </div>
        )}

        {preview && selectedFile && (
          <div
            className="position-relative mt-3 border rounded d-inline-block"
            style={{ maxWidth: "200px" }}
          >
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-1"
              aria-label="Close"
              onClick={handleRemove}
            ></button>

            {selectedFile.type.startsWith("image/") ? (
              <Image
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                width={400}
                height={300}
                unoptimized
                className="img-fluid rounded object-contain"
                style={{ maxHeight: "200px" }}
              />
            ) : selectedFile.type === "application/pdf" ? (
              <iframe
                src={URL.createObjectURL(selectedFile)}
                title="PDF Preview"
                className="w-100"
                style={{ height: "200px" }}
              />
            ) : (
              <div className="p-4 text-muted">Preview tidak tersedia</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

FileInputPublic.displayName = "FileInputPublic";
export default FileInputPublic;
