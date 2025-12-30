// App.js
import React, { useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AboutUs, FindUs, Footer, Gallery, Header, Intro, SpecialMenu, Gallery2, Login } from './container';
//                                       🔼 add Login here
import { Navbar } from './components';
import './App.css';

/* Menu page stuff… */
import Logo from "./menuTemplate/Logo";
import Mains from "./menuTemplate/Mains";
import Extras from "./menuTemplate/Extras";
import Total from "./menuTemplate/Total";
import { Provider } from "./Context";
import menuData from "./data.json";
import "./styles.css";
import TablePlanPage from "./components/TablePlan/TablePlanPage.jsx";

import { FiArrowLeft } from "react-icons/fi";

const { mains, sides, drinks } = menuData;

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

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/menu"; // hide navbar on /menu

  // 🔹 OVO JE NOVO: skrolovanje na hash (#about, #menu, ...)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // "#about" -> "about"
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // ako nema hasha, vrati se na vrh
      window.scrollTo(0, 0);
    }
  }, [location]);

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
              {/* <Gallery2 /> */}
              <Intro />
              <Gallery />
              <FindUs />
              <Footer />
            </>
          }
        />
        {/*Route for booking */}
        <Route path="/table-plan" element={<TablePlanPage />} />
        {/* 🔹 NEW LOGIN ROUTE */}
        <Route path="/login" element={<Login />} />

        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
