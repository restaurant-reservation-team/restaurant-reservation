import React from "react";
import { images } from "../../constants";

const AboutUs = () => (
  <div
    className="relative app__bg flex items-center justify-center section__padding"
    id="about"
  >
    {/* Overlay (empty but kept for structure) */}
    <div className="absolute inset-0 flex items-center justify-center" />

    <div className="w-full z-[2] flex items-center justify-center max-[900px]:flex-col">
      {/* About */}
      <div className="flex-1 flex flex-col justify-end items-end text-justify">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans my-8 text-greyish max-[2000px]:my-16">
          At our restaurant, we believe that food is more than just sustenance;
          it's an experience that brings people together. Our culinary team is
          dedicated to crafting dishes that not only tantalize your taste buds
          but also tell a story of tradition and innovation.
        </p>
      </div>

      {/* Knife */}
      <div className="flex items-center justify-center my-8 mx-16 max-[900px]:my-16 max-[900px]:mx-0">
        <img
          src={images.knife}
          alt="about_knife"
          className="w-full max-w-[300px] h-auto max-h-[600px] max-[2000px]:h-[1110px]"
        />
      </div>

      {/* History */}
      <div className="flex-1 flex flex-col justify-start items-start text-justify">
        <h1 className="headtext__cormorant">Our History</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans my-8 text-greyish max-[2000px]:my-16">
          At our restaurant, we believe that food is more than just sustenance;
          it's an experience that brings people together. Our culinary team is
          dedicated to crafting dishes that not only tantalize your taste buds
          but also tell a story of tradition and innovation.
        </p>
      </div>
    </div>
  </div>
);

export default AboutUs;
