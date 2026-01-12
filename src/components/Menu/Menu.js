import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { FaUserCircle } from "react-icons/fa";
import flagGR from "../../images/flags/greece.png";
import flagGB from "../../images/flags/england.png";
import "./Menu.css";

export default function Menu({ isLoggedIn, onLogout, activeMenu, setActiveMenu, userRole }) {
  const [language, setLanguage] = useState("el");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveMenu(1);
    }
    else if (path.startsWith("/owner-dashboard")) {
      if (path.startsWith("/owner-dashboard/book-date") || path.startsWith("/owner-dashboard/bookprofile")) { 
        setActiveMenu(6);
      }
      else {
        setActiveMenu(2);
      }
    }
    else if (path.startsWith("/vet-dashboard")) {
      setActiveMenu(3);
    }
    else if (path.startsWith("/all-lost-pets")) {
      setActiveMenu(4);
    }
    else {
      setActiveMenu(5);
    }
  }, [location.pathname, setActiveMenu]);


  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
  };
  const handleLogout = () => {
    setShowProfileDropdown(false);
    if (onLogout) onLogout();
  };
  const profilePath = "/ProfileOwner";

  return (
    <header className="top-header">
      <div className="menu-container">
        <Link to="/" className="logo-link" aria-label="Home">
          <img src={logo} className="header-logo" alt="PetCare Logo" />
        </Link>

        <nav className="main-menu">
          <Link to="/" className={`menu-item ${activeMenu === 1 ? "active" : ""}`}>Αρχική</Link>
          <div className="menu-dropdown">
            <Link to="/owner-dashboard" className={`menu-item ${activeMenu === 2 ? "active" : ""}`}>Ιδιοκτήτης</Link>
            <div className="dropdown-panel">
              <ul>
                <li><Link to="/owner-dashboard/found" className="dropdown-link">Δήλωση εύρεσης κατοικιδίου </Link></li>
                <li><Link to="/owner-dashboard/loss" className="dropdown-link">Δήλωση απώλειας κατοικιδίου</Link></li>
                <li><Link to="/owner-dashboard/history-statement" className="dropdown-link">Ιστορικό δηλώσεων </Link></li>
                <li><Link to="/owner-dashboard/health-booklet" className="dropdown-link">Προβολή ηλεκτρονικού βιβλιαρίου</Link></li>
                <li><Link to="/owner-dashboard/book-date" className="dropdown-link">Κλείσιμο ραντεβού</Link></li>
                <li><Link to="/owner-dashboard/future-bookings" className="dropdown-link">Ιστορικό ραντεβού</Link></li>
                <li><Link to="/owner-dashboard/future-bookings" className="dropdown-link">Μελλοντικά ραντεβού</Link></li>
              </ul>
            </div>
          </div>

          <div className="menu-dropdown">
            <Link to="/vet-dashboard" className={`menu-item ${activeMenu === 3 ? "active" : ""}`}>Κτηνίατρος</Link>
            <div className="dropdown-panel">
              <ul>
                <li><Link to="/vet-dashboard/found2" className="dropdown-link">Δήλωση εύρεσης κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/loss2" className="dropdown-link">Δήλωση απώλειας κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/adopt" className="dropdown-link">Δήλωση υιοθεσίας κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/anadoxi" className="dropdown-link">Δήλωση αναδοχής κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/transfer" className="dropdown-link">Δήλωση μεταβίβασης κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/history-statement" className="dropdown-link">Ιστορικό δηλώσεων</Link></li>
                <li><Link to="/vet-dashboard/identity" className="dropdown-link">Καταχώριση ταυτότητας κατοικιδίου</Link></li>
                <li><Link to="/vet-dashboard/medical" className="dropdown-link">Ενημέρωση ιατρικών πράξεων</Link></li>
                <li><Link to="/vet-dashboard/booklet" className="dropdown-link">Προβολή ηλεκτρονικού βιβλιαρίου</Link></li>
                <li><Link to="/vet-dashboard/future-bookings-vet" className="dropdown-link">Ενημέρωση διαθεσιμότητας</Link></li>
                <li><Link to="/vet-dashboard/future-bookings-vet" className="dropdown-link">Διαχείριση ραντεβού</Link></li>
              </ul>
            </div>
          </div>
          <Link to="/owner-dashboard/book-date" className={`menu-item ${activeMenu === 6 ? "active" : ""}`}>Βρες Κτηνίατρο</Link>

          <Link to="/all-lost-pets" className={`menu-item ${activeMenu === 4 ? "active" : ""}`}>Χαμένα Κατοικίδια</Link>
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
              <Link
                to={profilePath}
                className="profile-btn"
                onClick={() => {
                  setShowProfileDropdown(false);
                }}>
                <FaUserCircle />
              </Link >

              {showProfileDropdown && (
                <div className="profile-dropdown">
                  {userRole === "owner" && (
                    <Link to="/ProfileOwner" className="profile-item" onClick={() => {
                      setShowProfileDropdown(false);
                    }}>
                      Το προφίλ μου
                    </Link>
                  )}
                  {userRole === "vet" && (
                    <Link to="/ProfileOwner" className="profile-item" onClick={() => {
                      setShowProfileDropdown(false);
                    }}>
                      Το προφίλ μου
                    </Link>
                  )}
                  <button className="profile-item logout" onClick={handleLogout}>
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