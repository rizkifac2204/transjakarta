import { Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Image from "next/image";

const Fileinputcontroller = ({
  control,
  accept,
  rules,
  label = "Browse",
  placeholder = "Choose a file or drop it here...",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  multiple = false,
  preview = false,
  error,
  icon,
  id,
  name,
  horizontal,
  validate,
  msgTooltip,
  description,
  maxFileSize,
  badge,
  resetKey,
  ...rest
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sizeError, setSizeError] = useState("");

  const validateFileSize = (file) => {
    if (!maxFileSize) return null;
    if (file?.size > maxFileSize) {
      return `Ukuran file maksimal ${Math.floor(maxFileSize / 1024 / 1024)}MB`;
    }
    return null;
  };

  useEffect(() => {
    if (resetKey === undefined) return;
    setSelectedFile(null);
    setSelectedFiles([]);
    setSizeError("");
  }, [resetKey]);

  return (
    <div
      className={`fromGroup ${horizontal ? "flex" : ""} ${
        validate ? "is-valid" : ""
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`mb-1 block capitalize ${classLabel} ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          }`}
        >
          {label}
        </label>
      )}

      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <>
              <input
                type="file"
                id={id}
                className="hidden"
                accept={accept}
                onChange={(e) => {
                  setSizeError("");
                  const fileList = e.target.files;

                  if (multiple) {
                    const filesArray = Array.from(fileList);
                    const oversize = filesArray.find(
                      (f) => f.size > maxFileSize
                    );
                    if (oversize) {
                      setSizeError(
                        `Ukuran file maksimal ${Math.floor(
                          maxFileSize / 1024 / 1024
                        )}MB`
                      );
                      return;
                    }
                    setSelectedFiles(filesArray);
                    field.onChange(filesArray);
                  } else {
                    const file = fileList[0];
                    const errorMsg = validateFileSize(file);
                    if (errorMsg) {
                      setSizeError(errorMsg);
                      return;
                    }
                    setSelectedFile(file);
                    field.onChange(file);
                  }
                }}
                multiple={multiple}
                {...rest}
              />
              <div
                className={`w-full h-[40px] file-control flex items-center ${className} ${
                  error || sizeError ? "border border-red-500 rounded" : ""
                }`}
                onClick={() => document.getElementById(id)?.click()}
              >
                {!multiple && (
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedFile ? (
                      <span
                        className={
                          badge
                            ? "badge-title"
                            : "text-slate-900 dark:text-white"
                        }
                      >
                        {selectedFile.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">{placeholder}</span>
                    )}
                  </span>
                )}
                {multiple && (
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {selectedFiles.length > 0 ? (
                      <span
                        className={
                          badge
                            ? "badge-title"
                            : "text-slate-900 dark:text-white"
                        }
                      >
                        {selectedFiles.length} files selected
                      </span>
                    ) : (
                      <span className="text-slate-400">{placeholder}</span>
                    )}
                  </span>
                )}

                <span className="file-name flex-none cursor-pointer border-l px-4 border-slate-200 dark:border-slate-700 h-full inline-flex items-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs rounded-tr rounded-br font-normal">
                  Browse
                </span>
              </div>

              {/* Preview */}
              {preview && !multiple && selectedFile && (
                <div className="relative w-[200px] h-[200px] mx-auto mt-6 border p-2 rounded border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      field.onChange(null);
                      document.getElementById(id).value = "";
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center z-10"
                    title="Hapus"
                  >
                    &times;
                  </button>
                  {selectedFile.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt={selectedFile.name}
                      width={400}
                      height={300}
                      unoptimized
                      className="w-full h-full block rounded object-contain"
                    />
                  ) : selectedFile.type === "application/pdf" ? (
                    <iframe
                      src={URL.createObjectURL(selectedFile)}
                      className="w-full h-full"
                      title="PDF Preview"
                    ></iframe>
                  ) : (
                    <p className="text-sm text-center text-slate-500">
                      Preview tidak tersedia
                    </p>
                  )}
                </div>
              )}

              {preview && multiple && selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-[150px] h-[150px] border rounded p-2"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = selectedFiles.filter(
                            (_, i) => i !== index
                          );
                          setSelectedFiles(updatedFiles);
                          field.onChange(updatedFiles);
                          if (updatedFiles.length === 0) {
                            document.getElementById(id).value = "";
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-10"
                        title="Hapus"
                      >
                        &times;
                      </button>
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          width={400}
                          height={300}
                          unoptimized
                          className="object-cover w-full h-full rounded"
                        />
                      ) : file.type === "application/pdf" ? (
                        <iframe
                          src={URL.createObjectURL(file)}
                          className="w-full h-full"
                          title={`PDF-${index}`}
                        ></iframe>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Preview tidak tersedia
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        />

        {/* ICON */}
        <div className="flex text-xl absolute ltr:right-[80px] rtl:left-[110px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {error && (
            <span className="text-danger-500">
              <Icon icon="heroicons-outline:information-circle" />
            </span>
          )}
          {validate && (
            <span className="text-success-500">
              <Icon icon="bi:check-lg" />
            </span>
          )}
        </div>
      </div>

      {/* PESAN ERROR / VALIDASI */}
      {error && (
        <div
          className={`${
            msgTooltip
              ? "inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-danger-500 block text-sm"
          }`}
        >
          {error.message}
        </div>
      )}

      {sizeError && (
        <div className="text-danger-500 block text-sm mt-1">{sizeError}</div>
      )}

      {validate && (
        <div
          className={`${
            msgTooltip
              ? "inline-block bg-success-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}

      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

Fileinputcontroller.displayName = "Fileinputcontroller";
export default Fileinputcontroller;
