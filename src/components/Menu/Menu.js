import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { FaUserCircle } from "react-icons/fa";
import flagGR from "../../images/flags/greece.png";
import flagGB from "../../images/flags/england.png";

import "./Menu.css";

export default function Menu({ isLoggedIn, onLogout, activeMenu, setActiveMenu }) {
  const [language, setLanguage] = useState("el");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };
  const handleLogout = () => {
    setShowProfileDropdown(false);
    if (onLogout) onLogout();
  };



  return (
    <header className="top-header">
      <div className="menu-container">
        <Link to="/" className="logo-link" aria-label="Home" onClick={() => setActiveMenu(1)}>
          <img src={logo} className="header-logo" alt="PetCare Logo" />
        </Link>

        <nav className="main-menu">
          <Link to="/" className={`menu-item ${activeMenu === 1 ? "active" : ""}`}
            onClick={() => setActiveMenu(1)}>Αρχική</Link>

          <div className="menu-dropdown">
            <Link to="/owner-dashboard" className={`menu-item ${activeMenu === 2 ? "active" : ""}`}
              onClick={() => setActiveMenu(2)}>Ιδιοκτήτης</Link>
            <div className="dropdown-panel">
              <ul>
                <li>Δήλωση εύρεσης κατοικιδίου</li>
                <li>Δήλωση απώλειας κατοικιδίου</li>
                <li>Ιστορικό δηλώσεων</li>
                <li>Προβολή ηλεκτρονικού βιβλιαρίου</li>
                <li>Κλείσιμο ραντεβού</li>
                <li>Ιστορικό ραντεβού</li>
                <li>Μελλοντικά ραντεβού</li>
              </ul>
            </div>
          </div>

          <div className="menu-dropdown">
            <Link to="/vet-dashboard" className={`menu-item ${activeMenu === 3 ? "active" : ""}`}
              onClick={() => setActiveMenu(3)}>Κτηνίατρος</Link>
            <div className="dropdown-panel">
              <ul>
                <li>Δήλωση εύρεσης κατοικιδίου</li>
                <li>Δήλωση απώλειας κατοικιδίου</li>
                <li>Δήλωση υιοθεσίας κατοικιδίου</li>
                <li>Δήλωση αναδοχής κατοικιδίου</li>
                <li>Δήλωση μεταβίβασης κατοικιδίου</li>
                <li>Ιστορικό δηλώσεων</li>
                <li>Καταχώριση ταυτότητας κατοικιδίου</li>
                <li>Ενημέρωση ιατρικών πράξεων</li>
                <li>Προβολή ηλεκτρονικού βιβλιαρίου</li>
                <li>Ενημέρωση διαθεσιμότητας</li>
                <li>Διαχείριση ραντεβού</li>
              </ul>
            </div>
          </div>

          <Link to="/all-lost-pets" className={`menu-item ${activeMenu === 4 ? "active" : ""}`}
            onClick={() => setActiveMenu(4)}>Χαμένα Κατοικίδια</Link>

          {!isLoggedIn && (
            <div className="menu-actions">
              <Link to="/register/owner" className="menu-btn menu-btn--register">
                Εγγραφή
              </Link>
              <Link to="/login" className="menu-btn menu-btn--login">
                Σύνδεση
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div
              className="profile-menu"
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <button className="profile-btn">
                <FaUserCircle />
              </button>

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/profile"
                    className="profile-item"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Το προφίλ μου
                  </Link>

                  <button
                    type="button"
                    className="profile-item logout"
                    onClick={handleLogout}
                  >
                    Αποσύνδεση
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="language-selector">
            <button
              type="button"
              className="language-button"
              onClick={() => setShowLanguageDropdown((v) => !v)}
              aria-label="Επιλογή γλώσσας"
            >
              <span className="current-language">
                <img
                  src={language === "el" ? flagGR : flagGB}
                  alt="language flag"
                  className="flag-icon"
                />
              </span>
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <button
                  className={`language-option ${language === "el" ? "active" : ""}`}
                  onClick={() => handleLanguageChange("el")}
                >
                  <img src={flagGR} alt="GR" className="flag-icon" />
                  Ελληνικά
                </button>
                <button
                  className={`language-option ${language === "en" ? "active" : ""}`}
                  onClick={() => handleLanguageChange("en")}
                >
                  <img src={flagGB} alt="GB" className="flag-icon" />
                  English
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}