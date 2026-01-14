"use client";

import Icon from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { validateStrongPasswordPemohon } from "@/utils/strongPassword";

function FormPasswordPublik({ data }) {
  const router = useRouter();
  const isPasswordSet = Boolean(data?.password);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      password_lama: "",
      password_baru: "",
      password_confirm: "",
    },
  });

  const passwordBaru = watch("password_baru");

  async function onSubmit(data) {
    try {
      const res = await axios.patch(
        "/api/publik/dashboard/edit-password",
        data
      );
      toast.success(res?.data?.message || "Berhasil mengubah data diri");
      reset();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <div className="card rounded-3 shadow-sm">
      <div className="card-body p-4">
        <div className="row align-items-start">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <div className="cardTitle d-flex align-items-center justify-content-start mb-3">
              <h6 className="fw-semibold">Update Password</h6>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row align-items-start">
            {isPasswordSet ? (
              <div>
                <TextInputPublic
                  label="Password Lama *"
                  placeholder="Masukan Password Yang Saat Ini Digunakan"
                  type="password"
                  name="password_lama"
                  id="password_lama"
                  {...register("password_lama", { required: "Wajib Diisi" })}
                  error={errors.password_lama}
                />
              </div>
            ) : null}

            <div className="col-md-6">
              <TextInputPublic
                label="Password Baru *"
                placeholder="Masukan Password Pengganti"
                type="password"
                name="password_baru"
                id="password_baru"
                hasicon
                {...register("password_baru", {
                  required: "Wajib Diisi",
                  validate: validateStrongPasswordPemohon,
                })}
                error={errors.password_baru}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="Konfirmasi Password Baru *"
                placeholder="Masukan Ulang Password Baru"
                type="password"
                name="password_confirm"
                id="password_confirm"
                {...register("password_confirm", {
                  required: "Input Ulang Password Baru",
                  validate: (value) =>
                    value === passwordBaru || "Konfirmasi password tidak cocok",
                })}
                error={errors.password_confirm}
              />
            </div>

            <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-start flex-wrap gap-3 mt-3">
                <button
                  type="submit"
                  className="btn btn-sm fw-medium btn-primary"
                  disabled={isSubmitting}
                >
                  <Icon icon="solar:plain-2-broken" width="20" height="20" />
                  &nbsp; {isSubmitting ? "Processing..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormPasswordPublik;
