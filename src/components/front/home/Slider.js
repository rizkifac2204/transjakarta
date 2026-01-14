import React from "react";
import SliderItems from "./SliderItems";
import { getSliders } from "@/libs/slider";

async function Slider() {
  const data = await getSliders();
  return (
    <section className="pb-0" id="mains">
      <div className="container">
        <SliderItems data={data} />
      </div>
    </section>
  );
}

export default Slider;
