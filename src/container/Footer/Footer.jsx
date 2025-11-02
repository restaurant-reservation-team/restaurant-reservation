import React from 'react';


import { images } from '../../constants'
import { FiFacebook, FiInstagram } from 'react-icons/fi';
import { FooterOverlay } from '../../components'
import './Footer.css';

const Footer = () => (
  <div className='app__footer section__padding'>
    <FooterOverlay />
    <div className='app__footer-links'>
      <div className='app__footer-links_contact'>
        <h1 className='app__footer-headtext'> CONTACT US</h1>
        <p className='p__opensans'>71000 BiH</p>
        <p className='p__opensans'>+12345</p>
        <p className='p__opensans'>+12345</p>
      </div>

      <div className='app__footer-links_logo'>
        <img src={images.gericht} alt="footer_logo" />
        <p className='p__opensans'>The best restaurant in the city minimum city minimum best.</p>
        <img src={images.spoon} alt="spoon" className='spoon__img' style={{ marginTop: 15 }} />
      </div>

      <div className='app__footer-links_icons'>
        <FiFacebook />
        <FiInstagram />
      </div>
      <div className='app__footer-links_work'>
        <h1 className='app__footer-headtext'> Working Hours</h1>
        <p className='p__opensans'>Monday - Petak: 10.00 - 02.00</p>
        <p className='p__opensans'>Saturday - Sunday: 10.00 - 02.00</p>
        <p className='p__opensans'>+387 123 45 67 8910</p>
      </div>

      
    </div>


    <div className='app__footer-copyright'>
        <p className='p__opensans'>2025 Restaurant Copyright</p>
      </div>
  </div>
);

export default Footer;
