import React from "react";
import Icon from "../ui/Icon";

export default function FooterTop() {
  return (
    <section
      className="bg-cover bg-primary-2 position-relative py-5"
      style={{ backgroundImage: `url('/front/brand-section.png')` }}
    >
      <div className="container">
        <div className="row align-items-center justify-content-between g-4">
          <div className="col-xl-5 col-lg-5 col-md-5">
            <div className="callsTitles">
              <h4 className="text-white mb-0 lh-base">
                Berlangganan Buletin Kami!
              </h4>
              <p className="text-white opacity-75 m-0">
                Dapatkan informasi terbaru dari platform kami secara langsung.
              </p>
            </div>
          </div>

          <div className="col-xl-5 col-lg-6 col-md-6">
            <div className="subscribeForm">
              <div className="inputGroup">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Masukan Email Anda Disini..."
                />
                <div>
                  <button className="btn btn-xs btn-whites px-3">
                    <Icon icon="solar:plain-2-broken" width="20" height="20" />
                    Berlangganan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
