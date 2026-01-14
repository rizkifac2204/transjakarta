"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FilePreview from "@/components/ui/FilePreview";
import Tooltip from "@/components/ui/Tooltip";
import Icons from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { MAX_FOTO_SIZE, PATH_UPLOAD } from "@/configs/appConfig";

function ActionFotoPengguna({ pengguna }) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
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
      const res = await axios.post(
        `/api/pengguna/${pengguna.id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            setProgress(Math.round((event.loaded * 100) / event.total));
          },
        }
      );

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
    setIsUploading(true);
    try {
      const res = await axios.delete(`/api/pengguna/${pengguna.id}/upload`);
      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Terjadi kesalahan saat upload."
      );
    } finally {
      setIsUploading(false);
      router.refresh();
    }
  }

  return (
    <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
      <FilePreview
        fileUrl={
          pengguna?.foto
            ? `/api/services/file/uploads/${PATH_UPLOAD.admin}/${pengguna?.foto}`
            : null
        }
        filename={pengguna?.foto || "Pengguna"}
        isUser={true}
        className="w-full h-full object-cover rounded-full"
      />

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleUpload}
      />

      {pengguna.isManage ? (
        pengguna?.foto ? (
          <>
            <Tooltip
              content="Hapus"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="absolute right-9 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[160px] top-[100px]"
                onClick={handleDelete}
                disabled={isUploading}
              >
                <Icons icon="solar:trash-bin-2-broken" />
              </button>
            </Tooltip>
            <Tooltip
              content="Ganti"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className={`absolute ${isUploading && "bg-slate-800"}
            right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]`}
                onClick={() => uploadRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="text-xs text-white">{progress}%</span>
                ) : (
                  <Icons icon="solar:gallery-edit-bold-duotone" />
                )}
              </button>
            </Tooltip>
          </>
        ) : (
          <Tooltip
            content="Upload"
            placement="top"
            arrow
            animation="shift-away"
          >
            <button
              className={`absolute ${isUploading && "bg-slate-800"}
            right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]`}
              onClick={() => uploadRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="text-xs text-white">{progress}%</span>
              ) : (
                <Icons icon="solar:cloud-upload-broken" />
              )}
            </button>
          </Tooltip>
        )
      ) : null}
    </div>
  );
}

export default ActionFotoPengguna;
