import React from "react";
import appConfig from "@/configs/appConfig";
import AllDataItems from "./AllDataItems";
import { LAPORAN, INFORMASI_PUBLIK } from "../data/data";
const PERATURAN = [
  {
    kategori: "peraturan",
    link: "/peraturan",
    icon: "solar:notebook-bookmark-broken",
    label: "Peraturan",
  },
];

function AllData() {
  return (
    <section className="pb-0" id="mains">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                Klasifikasi <span className="text-primary">Informasi</span>
              </h3>
              <p>{appConfig.app.description}</p>
            </div>
          </div>
        </div>
        <AllDataItems data={[...LAPORAN, ...INFORMASI_PUBLIK, ...PERATURAN]} />
      </div>
    </section>
  );
}

export default AllData;
