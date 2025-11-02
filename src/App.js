import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AboutUs, FindUs, Footer, Gallery, Header, Intro, SpecialMenu, Gallery2 } from './container';
import { Navbar } from './components';
import './App.css';

/* Menu page */
import Logo from "./menuTemplate/Logo";
import Mains from "./menuTemplate/Mains";
import Extras from "./menuTemplate/Extras";
import Total from "./menuTemplate/Total";
import { Provider } from "./Context";
import menuData from "./data.json";
import "./styles.css";

import { FiArrowLeft } from "react-icons/fi"; // 👈 icon for back arrow

const { mains, sides, drinks } = menuData;

// ---------------------------
// Menu Page Component
// ---------------------------
const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <Provider>
      <div className="menu app__bg">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={22} /> Back
        </button>

        <Mains meals={mains} />
        <aside className="aside">
          <Extras type="Sides" items={sides} />
          <Extras type="Drinks" items={drinks} />
        </aside>
      </div>
    </Provider>
  );
};

// ---------------------------
// Wrapper to control navbar visibility
// ---------------------------
const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/menu"; // hide navbar on /menu

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <AboutUs />
              <SpecialMenu />
              <Gallery2 />
              <Intro />
              <Gallery />
              <FindUs />
              <Footer />
            </>
          }
        />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </>
  );
};

// ---------------------------
// App Router
// ---------------------------
const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
