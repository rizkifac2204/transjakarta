"use client";

import React from "react";
import Icon from "@/components/ui/Icon";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FilePreview from "@/components/ui/FilePreview";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE } from "@/configs/appConfig";
import setFotoPublik from "@/utils/setFotoPublik";

function ActionFotoPemohon({ data, section, path }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadRef = useRef(null);

  let fotoImage;

  if (section === "identitas") {
    fotoImage = data?.identitas
      ? `/api/services/file/uploads/identitas/${data?.identitas}`
      : null;
  } else {
    fotoImage = data?.foto
      ? `/api/services/file/uploads/pemohon/${data?.foto}`
      : null;
  }

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
    formData.append("section", section);
    formData.append("path", path);
    setIsUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(`/api/publik/dashboard/upload`, formData, {
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
      const res = await axios.delete(`/api/publik/dashboard/upload`, {
        params: {
          section: section,
          path: path,
        },
      });
      toast.success(res.data.message);
    } catch (err) {
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
      <h4 className="text-center">{section?.toUpperCase()}</h4>
      <div className="d-flex justify-content-center">
        <FilePreview
          fileUrl={fotoImage}
          filename={fotoImage}
          isUser={section !== "identitas"}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div
        className={`w-full mt-2 flex ${
          data?.[section] ? "flex-row justify-center gap-4" : "flex-col"
        }`}
      >
        {data?.[section] ? (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Icon icon="solar:trash-bin-2-broken" />
              &nbsp;Hapus
            </button>

            <button
              className="btn btn-sm btn-primary"
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
            >
              <Icon icon="solar:gallery-edit-bold-duotone" />
              &nbsp;{isUploading ? `${progress}%` : "Ganti"}
            </button>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
            >
              <Icon icon="solar:cloud-upload-broken" />
              &nbsp;
              {isUploading ? `${progress}%` : "Upload"}
            </button>
          </div>
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

export default ActionFotoPemohon;
