"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import validateEmail from "@/utils/validateEmail";

function FormCek() {
  const [tiket, setTiket] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!tiket || !email) return;
    if (!validateEmail(email)) return;
    const query = new URLSearchParams({ tiket, email });
    router.push(`/form/result?${query.toString()}`);
  };

  return (
    <div className="row align-items-start justify-content-center">
      <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12">
        <div className="heroSearch style-02">
          <form onSubmit={handleSearch}>
            <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
              <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
                <div className="form-group position-relative">
                  <input
                    type="text"
                    value={tiket}
                    onChange={(e) => setTiket(e.target.value)}
                    className="form-control fs-6 fw-medium border-0 ps-md-2"
                    placeholder="Masukan Tiket Permohonan"
                    required
                  />
                </div>
              </div>

              <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12">
                <div className="form-group position-relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control fs-6 fw-medium border-0"
                    placeholder="Email Pemohon"
                    required
                  />
                  <span className="position-absolute top-50 end-0 translate-middle me-2">
                    <Icon icon="mdi-light:email" width="24" height="24" />
                  </span>
                </div>
              </div>

              <div className="col-xl-2 col-lg-2 col-md-12 col-sm-12">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary full-width fw-medium"
                  >
                    <Icon
                      icon="solar:magnifer-line-duotone"
                      width="24"
                      height="24"
                    />
                    &nbsp; Search
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormCek;
