import React,{useState} from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import "./Menu.css";

export default function Menu() {
  // Προσθήκη state variables
  const [language, setLanguage] = useState("el");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Συνάρτηση για αλλαγή γλώσσας
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageDropdown(false);
    // Εδώ θα προσθέσεις λογική αλλαγής γλώσσας (i18n)
  };
  return (
    <header className="top-header">
      <div className="menu-container">
        <Link to="/" className="logo-link" aria-label="Home">
          <img src={logo} className="header-logo" alt="PetCare Logo" />
        </Link>

        <nav className="main-menu">
          <Link to="/" className="menu-item active">Αρχική</Link> 

          <div className="menu-dropdown">
            <Link to="/owner-dashboard" className="menu-item">Ιδιοκτήτης</Link>
            <div className="dropdown-panel">
              <ul>
                <li>Δήλωση εύρεσης κατοικιδίου</li>
                <li>Δήλωση απώλειας κατοικιδίου</li>
                <li>Ιστορικό δηλώσεων</li>
                <li>Προβολή ηλεκτρονικού βιβλιαρίου</li>
                <li>Κλείσιμο ραντεβού</li>
                <li>Ιστορικό ραντεβού</li>
                <li>Μετακίνηση ραντεβού</li>
              </ul>
            </div>
          </div>

          <div className="menu-dropdown">
            <Link to="/vet-dashboard" className="menu-item">Κτηνίατρος</Link>
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

          <Link to="/all-lost-pets" className="menu-item">Χαμένα Κατοικίδια</Link>
          <Link to="/adoption" className="menu-item">Προς Υιοθεσία</Link>

          <div className="menu-actions">
            <a href="#register" className="menu-btn menu-btn--register">Εγγραφή</a>
            <a href="#login" className="menu-btn menu-btn--login">Σύνδεση</a>
          </div>

        <div className="language-selector">
          <button 
            className="language-button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            aria-label="Επιλογή γλώσσας"
          >
            🌐
            <span className="current-language">
              {language === "el" ? "ΕΛ" : "EN"}
            </span>
          </button>
          
          {showLanguageDropdown && (
            <div className="language-dropdown">
              <button 
                className={`language-option ${language === "el" ? "active" : ""}`}
                onClick={() => handleLanguageChange("el")}
              >
                🇬🇷 Ελληνικά
              </button>
              <button 
                className={`language-option ${language === "en" ? "active" : ""}`}
                onClick={() => handleLanguageChange("en")}
              >
                🇬🇧 English
              </button>
            </div>
          )}
        </div>
        </nav>
      </div>
    </header>
  );
}
