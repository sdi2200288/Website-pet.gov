import React, { useState } from "react";
import "./VetDashboard.css";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaExclamationCircle,
  FaBook,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";


export default function VetDashboard() {
  const [openDeclarations, setOpenDeclarations] = useState(false);
  const [openAnimalRegister, setOpenAnimalRegister] = useState(false);
  return (
    <div className="VetDashboard">

      <nav className="breadcrumb">
        <Link to="/">Αρχική</Link>
        <span className="separator"> &gt; </span>
        <span>Dashboard Κτηνίατρου</span>
      </nav>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Επιλογές Κτηνίατρου</h3>

          <ul className="sidebar-menu">
            <li>
              <Link to="/vet/profile">
                <FaUser className="menu-icon" /> <span>Το προφίλ μου</span>
              </Link>
            </li>
            <li>
              <button className="menu-button" onClick={() => setOpenDeclarations(!openDeclarations)}>
                <FaFileAlt className="menu-icon" />
                <span>Δηλώσεις</span>
                <span className={`arrow ${openDeclarations ? "open" : ""}`}>▾</span>
              </button>
              {openDeclarations && (
                <ul className="submenu">
                  <li>
                    <Link to="/vet/declarations/finding"> Δήλωση Εύρεσης </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/loss"> Δήλωση Απώλειας </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/import"> Δήλωση Υιοθεσίας </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/import"> Δήλωση Αναδοχής </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/import"> Δήλωση Μεταβίβασης </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/vet/history-Statements">
                <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώεων</span>
              </Link>
            </li>
            <li>
              <button className="menu-button" onClick={() => setOpenAnimalRegister(!openAnimalRegister)}>
                <FaFileAlt className="menu-icon" />
                <span>Καταγραφή Ζώου</span>
                <span className={`arrow ${openAnimalRegister ? "open" : ""}`}>▾</span>
              </button>
              {openAnimalRegister && (
                <ul className="submenu">
                  <li>
                    <Link to="/vet/declarations/finding"> Καταγραφή Ταυτότητας </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/loss"> Ενημέρωση Ιατρικών Πράξεων </Link>
                  </li>
                  <li>
                    <Link to="/vet/declarations/import"> Προβολή Βιβλιαρίου</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link to="/vet/bookings">
                <FaCalendarAlt className="menu-icon" /> <span>Ενημέρωση Διαθεσιμότητας</span>
              </Link>
            </li>
            <li>
              <Link to="/vet/history-bookings">
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </Link>
            </li>
            <li>
              <Link to="/vet/future-bookings">
                <FaCalendarAlt className="menu-icon" /> <span>Μελλοντικά Ραντεβού</span>
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>

  );
}
