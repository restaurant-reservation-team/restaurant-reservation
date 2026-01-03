import React from "react";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { images } from "../../constants";

const Footer = () => (
  <footer className="w-full bg-blackish text-whiteish flex flex-col items-center px-8 py-20">
    
    {/* Main footer content */}
    <div className="w-full max-w-6xl flex justify-between items-start max-[1150px]:flex-col max-[1150px]:items-center">

      {/* Contact */}
      <div className="flex-1 text-center mb-8 max-[1150px]:mb-12">
        <h1 className="app__footer-headtext mb-4">Contact Us</h1>
        <p className="p__opensans">71000 BiH</p>
        <p className="p__opensans">+12345</p>
        <p className="p__opensans">+12345</p>
      </div>

      {/* Logo + text + social */}
      <div className="flex-1 text-center mb-8 max-[1150px]:mb-12">
        <img
          src={images.gericht}
          alt="footer logo"
          className="w-[200px] mx-auto mb-4"
        />

        <p className="p__opensans max-w-md mx-auto mb-4">
          The best restaurant in the city minimum city minimum best.
        </p>

        <div className="flex justify-center gap-4">
          <FiFacebook className="text-[22px] cursor-pointer hover:text-golden transition-colors" />
          <FiInstagram className="text-[22px] cursor-pointer hover:text-golden transition-colors" />
        </div>
      </div>

      {/* Working hours */}
      <div className="flex-1 text-center">
        <h1 className="app__footer-headtext mb-4">Working Hours</h1>
        <p className="p__opensans mb-2">Monday – Friday: 10.00 – 02.00</p>
        <p className="p__opensans mb-2">Saturday – Sunday: 10.00 – 02.00</p>
        <p className="p__opensans">+387 123 45 67 8910</p>
      </div>

    </div>

    {/* Divider */}
    <div className="w-full max-w-6xl h-px bg-greyish/30 my-10" />

    {/* Copyright */}
    <p className="p__opensans text-sm opacity-80 text-center">
      © 2025 Restaurant. All rights reserved.
    </p>

  </footer>
);

export default Footer;
