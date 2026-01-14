"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import TextAreaPublic from "@/components/front/input/TextAreaPublic";
import { useAuthPublic } from "@/providers/auth-public-provider";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { toast } from "react-toastify";
import { Rating, Star } from "@smastrom/react-rating";
import getRecaptchaToken from "@/utils/getRecaptchaToken";
import "@smastrom/react-rating/style.css";

function FormTestimoni({ data, isPenelitian }) {
  const router = useRouter();
  const { userPublik } = useAuthPublic();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      tiket: data?.tiket || "",
      email: data?.email || userPublik?.email || "",
      permohonan_id: isPenelitian ? "" : data?.id,
      penelitian_id: isPenelitian ? data?.id : "",
      rating: 0,
      komentar: "",
    },
  });

  async function onSubmit(data) {
    try {
      const token = await getRecaptchaToken();
      const res = await axios.post("/api/publik/testimoni", {
        ...data,
        token: token,
      });
      toast.success(res?.data?.message || "Berhasil mengirim testimoni");
      router.refresh();
      const modalEl = document.getElementById("testimoniModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  useEffect(() => {
    const modalEl = document.getElementById("testimoniModal");

    const handleShown = () => {
      reset({
        tiket: data?.tiket || "",
        email: data?.email || "",
        permohonan_id: isPenelitian ? "" : data?.id,
        penelitian_id: isPenelitian ? data?.id : "",
        rating: 0,
        komentar: "",
      });
    };

    const handleHidden = () => {
      reset();
    };

    modalEl?.addEventListener("shown.bs.modal", handleShown);
    modalEl?.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      modalEl?.removeEventListener("shown.bs.modal", handleShown);
      modalEl?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, [data, isPenelitian, reset]);

  return (
    <div
      className="modal fade"
      id="testimoniModal"
      tabIndex="-1"
      aria-labelledby="testimoniModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h5 className="modal-title" id="testimoniModalLabel">
                Kirim Testimoni
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: "Wajib beri rating" }}
                  render={({ field }) => (
                    <Rating
                      value={field.value}
                      onChange={field.onChange}
                      style={{ maxWidth: 180 }}
                      itemStyles={{
                        itemShapes: Star,
                        activeFillColor: "#ffc107",
                        inactiveFillColor: "#e4e5e9",
                      }}
                    />
                  )}
                />

                {errors.rating && (
                  <div className="invalid-feedback d-block">
                    {errors.rating.message}
                  </div>
                )}
              </div>

              <div>
                <TextAreaPublic
                  label="Komentar"
                  placeholder="Tulis kesan dan saran kamu di sini..."
                  name="komentar"
                  id="komentar"
                  {...register("komentar")}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-sm fw-medium btn-primary"
                disabled={isSubmitting}
              >
                <Icon icon="solar:plain-2-broken" width="20" height="20" />
                &nbsp; {isSubmitting ? "Processing..." : "Kirim Testimoni"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormTestimoni;
