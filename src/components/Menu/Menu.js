import React from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import "./Menu.css";

export default function Menu() {
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

        </nav>
      </div>
    </header>
  );
}
