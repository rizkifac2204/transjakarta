import React from "react";
import Icon from "@/components/ui/Icon";
import { formatedDate } from "@/utils/formatDate";
import { maskEmail } from "@/utils/validateEmail";
import LinkAuth from "@/components/front/LinkAuth";

function SuccessPage({ data, isPenelitian }) {
  return (
    <section
      className="bg-cover"
      style={{
        backgroundColor: `#f5e4c1`,
        backgroundImage: `url('/front/auth-bg.png')`,
      }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-6 col-lg-7 col-md-9">
            <div className="confirmsWrap">
              <div className="confirmsbody d-black mb-4">
                <div className="card rounded-4 p-sm-5 p-4">
                  <div className="card-body p-0">
                    <div className="checkBox">
                      <span className="check">
                        <Icon
                          icon="solar:check-circle-broken"
                          width="50"
                          height="50"
                        />
                      </span>
                    </div>
                    <div className="confirmsHeads">
                      <h3 className="successTitle">Berhasil!</h3>
                      <p className="successSubtitle">
                        Mengajukan Permohanan{" "}
                        {isPenelitian ? "Penelitian" : "Informasi"} dengan data
                        berikut
                      </p>
                    </div>
                    <div className="confirmsInfo">
                      <ul>
                        <li>
                          <span className="headTitle">Tiket</span>
                          <span className="headCaps">
                            <strong>{data?.tiket}</strong>
                          </span>
                        </li>
                        <li>
                          <span className="headTitle">Tanggal</span>
                          <span className="headCaps">
                            {formatedDate(data?.tanggal)}
                          </span>
                        </li>
                        <li>
                          <span className="headTitle">Oleh</span>
                          <span className="headCaps">
                            {maskEmail(data?.email)}
                          </span>
                        </li>
                        <li>
                          <span className="headTitle">
                            Status Permohonan{" "}
                            {isPenelitian ? "Penelitian" : "Informasi"}
                          </span>
                          <span className="headCaps">{data?.status}</span>
                        </li>
                      </ul>

                      <LinkAuth section="permohonan" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuccessPage;
