import React, { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { images } from '../../constants/images';
import './Navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className='app__navbar'>
      <div className='app__navbar-logo'>
        <img src={images.gericht} alt='app logo' />
      </div>

      {/* DESKTOP LINKOVI */}
      <ul className='app__navbar-links'>
        <li className='p__opensans'>
          <Link to="/#home">Home</Link>
        </li>
        <li className='p__opensans'>
          <Link to="/#about">About</Link>
        </li>
        <li className='p__opensans'>
          <Link to="/#menu">Menu</Link>
        </li>
        <li className='p__opensans'>
          <Link to="/#gallery">Gallery</Link>
        </li>
        <li className='p__opensans'>
          <Link to="/#contact">Contact</Link>
        </li>
      </ul>

      <div className='app__navbar-login'>
        {/* <Link to="/login" className='p__opensans'>
          Log In / Registration
        </Link> */}
      
        {/* Ako želiš da Book Table otvara /menu, možeš: <Link to="/menu">Book Table</Link> */}
        <Link to="/table-plan" className='p__opensans'>
          Book Table
        </Link>
      </div>

      {/* MOBILNI MENI */}
      <div className='app__navbar-smallscreen'>
        <GiHamburgerMenu
          color='#fff'
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />

        {toggleMenu && (
          <div className='app__navbar-smallscreen_overlay flex__center slide-bottom'>
            <MdOutlineRestaurantMenu
              fontSize={27}
              className='overlay__close'
              onClick={() => setToggleMenu(false)}
            />

            <ul className='app__navbar-smallscreen_links'>
              <li className='p__opensans'>
                <Link to="/#home" onClick={() => setToggleMenu(false)}>Home</Link>
              </li>
              <li className='p__opensans'>
                <Link to="/#about" onClick={() => setToggleMenu(false)}>About</Link>
              </li>
              <li className='p__opensans'>
                <Link to="/#menu" onClick={() => setToggleMenu(false)}>Menu</Link>
              </li>
              <li className='p__opensans'>
                <Link to="/#contact" onClick={() => setToggleMenu(false)}>Contact</Link>
              </li>
              <li className='p__opensans'>
                <Link to="/login" onClick={() => setToggleMenu(false)}>
                  Log In / Registration
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
