import React from "react";
import appConfig from "@/configs/appConfig";
import TestimoniItems from "./TestimoniItems";
import { getTestimoni } from "@/libs/testimoni";

export const dynamic = "force-dynamic";

async function Testimoni() {
  const data = await getTestimoni(true);
  return (
    <section className="pb-0" id="mains">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                Review <span className="text-primary">Layanan</span>
              </h3>
              <p>{appConfig.app.description}</p>
            </div>
          </div>
        </div>
        <TestimoniItems data={data} />
      </div>
    </section>
  );
}

export default Testimoni;
