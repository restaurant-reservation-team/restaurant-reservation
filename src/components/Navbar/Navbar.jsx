import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { Link } from "react-router-dom";

import { images } from "../../constants/images";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  const desktopLinks = [
    ["Home", "/#home"],
    ["About", "/#about"],
    ["Menu", "/#menu"],
    ["Gallery", "/#gallery"],
    ["Contact", "/#contact"],
  ];

  const mobileLinks = [
    ["Home", "/#home"],
    ["About", "/#about"],
    ["Menu", "/#menu"],
    ["Contact", "/#contact"],
    ["Log In / Registration", "/login"],
  ];

  return (
    <nav className="w-full flex justify-between items-center bg-blackish px-8 py-4 max-[650px]:px-4">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <img
          src={images.gericht}
          alt="app logo"
          className="w-[210px] max-[650px]:w-[110px]"
        />
      </div>

      {/* Desktop links */}
      <ul className="flex-1 flex items-center justify-center list-none max-[1150px]:hidden">
        {desktopLinks.map(([label, to]) => (
          <li key={to} className="mx-4 cursor-pointer">
            <Link
              to={to}
              className="p__opensans transition-all duration-300 hover:text-greyish hover:border-b hover:border-golden"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side (desktop) */}
      <div className="flex items-center justify-end max-[650px]:hidden">
        <Link
          to="/table-plan"
          className="p__opensans mx-4 no-underline transition-all duration-500 hover:border-b hover:border-golden"
        >
          Book Table
        </Link>
      </div>

      {/* Mobile menu */}
      <div className="hidden max-[1150px]:flex">
        <button
          type="button"
          onClick={() => setToggleMenu(true)}
          aria-label="Open menu"
          className="cursor-pointer"
        >
          <GiHamburgerMenu color="#fff" fontSize={27} />
        </button>

        {toggleMenu && (
          <div className="fixed inset-0 z-[5] flex flex-col items-center justify-center bg-blackish transition-all duration-500 animate-slide-bottom">
            <button
              type="button"
              onClick={() => setToggleMenu(false)}
              aria-label="Close menu"
              className="absolute top-5 right-5 cursor-pointer"
            >
              <MdOutlineRestaurantMenu fontSize={27} className="text-golden" />
            </button>

            <ul className="list-none">
              {mobileLinks.map(([label, to]) => (
                <li
                  key={to}
                  className="m-8 cursor-pointer text-golden text-[2rem] text-center font-base hover:text-whiteish"
                >
                  <Link
                    to={to}
                    onClick={() => setToggleMenu(false)}
                    className="p__opensans"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
