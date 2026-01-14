import Link from "next/link";
import AllData from "@/components/front/home/AllData";
import Testimoni from "@/components/front/home/Testimoni";
import Slider from "@/components/front/home/Slider";

import Icon from "@/components/ui/Icon";
import FormCek from "./_FormCek";
import { LINK_FORM } from "@/components/front/data/data";

export default async function Home() {
  return (
    <div className="pb-3">
      <div
        className="image-cover hero-header full-height position-relative"
        style={{ backgroundImage: `url('/front/main.jpg')` }}
        data-overlay="6"
      >
        <div className="container">
          <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
            <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
              <div className="position-relative text-center">
                <h1>PPID KP2MI</h1>
                <p className="fs-5 fw-light">
                  Kementerian Pelindungan Pekerja Migran Indonesia
                </p>
              </div>
            </div>
          </div>
          <FormCek />

          <div className="row align-items-center justify-content-center mt-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-2">
              <div className="text-center">
                <h6 className="fw-semibold">Formulir Pengajuan</h6>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-md-12 col-12">
              <div className="popularSearches d-flex align-items-center justify-content-center column-gap-3 row-gap-1 flex-wrap">
                {LINK_FORM.map((item, index) => (
                  <div className="singleItem" key={index}>
                    <Link
                      href={item.link}
                      className="badge badge-transparent rounded-pill"
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mousedrop z-1">
          <Link href="#mains" className="mousewheel center">
            <Icon icon="solar:mouse-broken" width="24" height="24" />
          </Link>
        </div>
      </div>

      <AllData />

      <Slider />

      <Testimoni />
    </div>
  );
}
