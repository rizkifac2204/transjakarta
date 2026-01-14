import React from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "../ui/Icon";
import { LINK_FORM, INFORMASI_PUBLIK, LAPORAN } from "./data/data";
import { getInstansi } from "@/libs/instansi";

export default async function Footer() {
  const data = await getInstansi();

  return (
    <footer className="footer skin-dark-footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-5 col-lg-12 col-xl-4">
            <div className="footer-widget pe-xl-4 mb-5">
              <div className="footerLogo">
                <Image
                  src="/assets/images/brand-color.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "160px", height: "auto" }}
                  className="img-fluid"
                  alt="Footer Logo"
                />
              </div>
              <div className="footerText">
                <p>© {new Date().getFullYear()} KP2MI. All rights reserved</p>
              </div>
              <div className="footerSocialwrap">
                <ul className="footersocial">
                  <li>
                    <Link
                      href={data?.facebook || "#"}
                      target={data?.facebook ? "_blank" : undefined}
                      rel={data?.facebook ? "noopener noreferrer" : undefined}
                      className={`social-link ${
                        !data?.facebook ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Icon icon="eva:facebook-fill" width="24" height="24" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={data?.twitter || "#"}
                      target={data?.twitter ? "_blank" : undefined}
                      rel={data?.twitter ? "noopener noreferrer" : undefined}
                      className={`social-link ${
                        !data?.twitter ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Icon icon="hugeicons:twitter" width="24" height="24" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={data?.instagram || "#"}
                      target={data?.instagram ? "_blank" : undefined}
                      rel={data?.instagram ? "noopener noreferrer" : undefined}
                      className={`social-link ${
                        !data?.instagram ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Icon
                        icon="lets-icons:insta-light"
                        width="24"
                        height="24"
                      />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={data?.youtube || "#"}
                      target={data?.youtube ? "_blank" : undefined}
                      rel={data?.youtube ? "noopener noreferrer" : undefined}
                      className={`social-link ${
                        !data?.youtube ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Icon icon="iconoir:youtube" width="24" height="24" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={data?.tiktok || "#"}
                      target={data?.tiktok ? "_blank" : undefined}
                      rel={data?.tiktok ? "noopener noreferrer" : undefined}
                      className={`social-link ${
                        !data?.tiktok ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      <Icon icon="iconoir:tiktok" width="24" height="24" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 offset-md-3 col-lg-3  offset-lg-0 col-xl-2">
            <div className="footer-widget mb-5 mb-md-5 mb-lg-0">
              <h4 className="widget-title text-pri">Informasi</h4>
              <ul className="footer-menu">
                {INFORMASI_PUBLIK.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={item.link}>{item.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-3 col-xl-2">
            <div className="footer-widget mb-5 mb-md-5 mb-lg-0">
              <h4 className="widget-title">Laporan</h4>
              <ul className="footer-menu">
                {LAPORAN.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={item.link}>{item.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-3 col-xl-2">
            <div className="footer-widget">
              <h4 className="widget-title">Formulir</h4>
              <ul className="footer-menu">
                {LINK_FORM.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={item.link}>{item.label}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-3 col-xl-2">
            <div className="footer-widget">
              <h4 className="widget-title">Lokasi dan Layanan</h4>
              <div className="contactInfowrap">
                <div className="singleinfo">
                  <div className="icons">
                    <Icon icon="mynaui:location" width="24" height="24" />
                  </div>
                  <div className="caps">
                    <h5 className="title">{data?.alamat || "-"}</h5>
                  </div>
                </div>

                <div className="singleinfo">
                  <div className="icons">
                    <Icon icon="proicons:phone" width="24" height="24" />
                  </div>
                  <div className="caps">
                    <h5 className="title">{`${
                      data?.telp_1 || "-"
                    } (dalam negeri)`}</h5>
                    <h5 className="title">{`${
                      data?.telp_2 || "-"
                    } (luar negeri)`}</h5>
                    <p className="subs">Sen - Jum 8AM - 4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
