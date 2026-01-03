import React from "react";
import {
  BsInstagram,
  BsArrowLeftShort,
  BsArrowRightShort,
} from "react-icons/bs";

import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Gallery.css";

const galleryImages = [
  images.gallery01,
  images.gallery02,
  images.gallery03,
  images.gallery04,
];

const Gallery = () => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    if (direction === "left") {
      scrollRef.current.scrollLeft -= 300;
    } else {
      scrollRef.current.scrollLeft += 300;
    }
  };

  return (
    <div className="app__gallery flex__center" id="gallery">
      {/* Text content */}
      <div className="app__gallery-content">
        <SubHeading title="Kakav ba instagram ?" />
        <h1 className="headtext__cormorant">Photo Gallery</h1>

        <p
          className="p__opensans"
          style={{ color: "#AAA", marginTop: "2rem" }}
        >
          Take a look inside our kitchen and dining space. From sizzling plates
          to smiling faces, every photo captures the warmth and flavor of what
          we do best.
        </p>

        {/* <button type="button" className="custom__button">
          View More
        </button> */}
      </div>

      {/* Images */}
      <div className="app__gallery-images">
        <div
          className="app__gallery-images_container"
          ref={scrollRef}
        >
          {galleryImages.map((image, index) => (
            <div
              className="app__gallery-images_card flex__center"
              key={`gallery_image_${index + 1}`}
            >
              <img src={image} alt="gallery" />

              {/* Instagram overlay icon */}
              <BsInstagram className="gallery__image-icon" />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="app__gallery-images_arrows">
          <BsArrowLeftShort
            className="gallery__arrow-icon"
            onClick={() => scroll("left")}
          />
          <BsArrowRightShort
            className="gallery__arrow-icon"
            onClick={() => scroll("right")}
          />
        </div>
      </div>
    </div>
  );
};

export default Gallery;
