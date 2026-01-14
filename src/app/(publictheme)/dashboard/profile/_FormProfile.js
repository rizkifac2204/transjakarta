"use client";

import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import TextInputPublic from "@/components/front/input/TextInputPublik";
import SelectInputPublic from "@/components/front/input/SelectInputPublic";
import TextAreaPublic from "@/components/front/input/TextAreaPublic";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

function FormProfilePublik({ data }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: data?.email || "",
      nama: data?.nama || "",
      telp: data?.telp || "",
      nomor_identitas: data?.nomor_identitas || "",
      jenis_kelamin: data?.jenis_kelamin || "",
      pekerjaan: data?.pekerjaan || "",
      pendidikan: data?.pendidikan || "",
      universitas: data?.universitas || "",
      jurusan: data?.jurusan || "",
      nim: data?.nim || "",
      alamat: data?.alamat || "",
      username: data?.username || "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await axios.patch("/api/publik/dashboard", data);
      toast.success(res?.data?.message || "Berhasil mengubah data diri");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <div className="card rounded-3 shadow-sm mb-lg-5 mb-4">
      <div className="card-body p-4">
        <div className="row align-items-start">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <div className="cardTitle d-flex align-items-center justify-content-start mb-3">
              <h6 className="fw-semibold">Formulir Edit Data Diri</h6>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row align-items-start">
            <div className="col-md-6">
              <TextInputPublic
                label="Email Pemohon *"
                name="email"
                type="email"
                id="email"
                {...register("email", { required: "Wajib Diisi" })}
                disabled
                description={"Tidak Bisa Edit"}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="Nama Lengkap *"
                name="nama"
                id="nama"
                {...register("nama", { required: "Wajib Diisi" })}
                error={errors.nama}
              />
            </div>

            <div>
              <TextInputPublic
                label="No. Identitas *"
                name="nomor_identitas"
                id="nomor_identitas"
                {...register("nomor_identitas", { required: "Wajib Diisi" })}
                error={errors.nomor_identitas}
                description={`(KTP/SIM/Paspor)`}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="No. HP *"
                name="telp"
                id="telp"
                {...register("telp", { required: "Wajib Diisi" })}
                error={errors.telp}
              />
            </div>

            <div className="col-md-6">
              <SelectInputPublic
                label="Jenis Kelamin *"
                name="jenis_kelamin"
                id="jenis_kelamin"
                options={[
                  { value: "Pria", label: "Pria" },
                  { value: "Wanita", label: "Wanita" },
                ]}
                {...register("jenis_kelamin", { required: "Wajib Dipilih" })}
                error={errors.jenis_kelamin}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="Pekerjaan *"
                name="pekerjaan"
                id="pekerjaan"
                {...register("pekerjaan", { required: "Wajib Diisi" })}
                error={errors.pekerjaan}
              />
            </div>

            <div className="col-md-6">
              <SelectInputPublic
                label="Pendidikan *"
                name="pendidikan"
                id="pendidikan"
                options={[
                  {
                    value: "Tidak/Belum Sekolah",
                    label: "Tidak/Belum Sekolah",
                  },
                  {
                    value: "Tidak Tamat SD/Sederajat",
                    label: "Tidak Tamat SD/Sederajat",
                  },
                  {
                    value: "SD / MI / Paket A / Sederajat",
                    label: "SD / MI / Paket A / Sederajat",
                  },
                  {
                    value: "SMP / MTs / Paket B / Sederajat",
                    label: "SMP / MTs / Paket B / Sederajat",
                  },
                  {
                    value: "SMA / MA / SMK / Paket C / Sederajat",
                    label: "SMA / MA / SMK / Paket C / Sederajat",
                  },
                  {
                    value: "D1 / D2 / D3 (Diploma)",
                    label: "D1 / D2 / D3 (Diploma)",
                  },
                  { value: "S1 / D4 (Sarjana)", label: "S1 / D4 (Sarjana)" },
                  { value: "S2 (Magister)", label: "S2 (Magister)" },
                  { value: "S3 (Doktor)", label: "S3 (Doktor)" },
                ]}
                {...register("pendidikan", { required: "Wajib Dipilih" })}
                error={errors.pendidikan}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="Lembaga/Universitas"
                name="universitas"
                id="universitas"
                {...register("universitas")}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="Jurusan/Prodi"
                name="jurusan"
                id="jurusan"
                {...register("jurusan")}
              />
            </div>

            <div className="col-md-6">
              <TextInputPublic
                label="No. Induk Mahasiswa"
                name="nim"
                id="nim"
                {...register("nim")}
              />
            </div>

            <div>
              <TextAreaPublic
                label="Alamat Lengkap *"
                name="alamat"
                id="alamat"
                {...register("alamat", { required: "Wajib Diisi" })}
                error={errors.alamat}
              />
            </div>

            <div>
              <TextInputPublic
                label="Username *"
                name="username"
                id="username"
                {...register("username", { required: "Wajib Diisi" })}
                error={errors.username}
              />
            </div>

            {Boolean(data?.password) ? (
              <div>
                <TextInputPublic
                  label="Password *"
                  placeholder="Masukan Password Yang Saat Ini Digunakan"
                  type="password"
                  name="password"
                  id="password"
                  {...register("password", { required: "Wajib Diisi" })}
                  error={errors.password}
                />
              </div>
            ) : null}

            <div>
              <div className="form-group form-border">
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
export default FormProfilePublik;
