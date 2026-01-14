"use client";

import React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FilePreview from "@/components/ui/FilePreview";
import Button from "@/components/ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";

function ActionIdentitas({ data }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadRef = useRef(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file?.size > MAX_FOTO_SIZE) {
      e.target.value = "";
      return toast.error(
        `Ukuran file maksimal ${Math.floor(MAX_FOTO_SIZE / 1024 / 1024)}MB`
      );
    }
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(`/api/pemohon/${data.id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Terjadi kesalahan saat upload."
      );
    } finally {
      setIsUploading(false);
      setProgress(0);
      e.target.value = "";
      router.refresh();
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/pemohon/${data.id}/upload`);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Terjadi kesalahan saat upload."
      );
    } finally {
      setIsDeleting(false);
      router.refresh();
    }
  }

  return (
    <>
      <FilePreview
        fileUrl={
          data?.identitas
            ? `/api/services/file/uploads/${PATH_UPLOAD.identitas}/${data?.identitas}`
            : null
        }
        filename={data?.identitas || "Pemohon"}
        isUser={true}
        className="w-full h-[300px] object-cover rounded-xl"
      />

      <div
        className={`w-full mt-2 flex ${
          data?.identitas ? "flex-row justify-center gap-4" : "flex-col"
        }`}
      >
        {data?.identitas ? (
          <>
            <Button
              className="btn-dark px-4 py-2 rounded-md text-sm transition"
              onClick={handleDelete}
              disabled={isDeleting}
              icon="solar:trash-bin-2-broken"
              text={"Hapus"}
            />
            <Button
              className="btn-dark px-4 py-2 rounded-md text-sm transition"
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
              icon="solar:gallery-edit-bold-duotone"
              text={isUploading ? `${progress}%` : "Ganti"}
            />
          </>
        ) : (
          <Button
            className="btn-gold w-full py-2 text-sm"
            onClick={() => uploadRef.current?.click()}
            disabled={isUploading}
            icon="solar:cloud-upload-broken"
            text={isUploading ? `${progress}%` : "Upload"}
          />
        )}
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />
    </>
  );
}

export default ActionIdentitas;
