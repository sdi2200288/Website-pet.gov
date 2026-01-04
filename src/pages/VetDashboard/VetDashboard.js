import React, { useEffect, useState } from "react";
import "./VetDashboard.css";
import { NavLink, Link, Outlet, useNavigate  } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaBook,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";

export default function VetDashboard() {
  const navigate = useNavigate();
  const [openDeclarations, setOpenDeclarations] = useState(false);
  const [openAnimalRegister, setOpenAnimalRegister] = useState(false);

  const vet = JSON.parse(localStorage.getItem("user"));

  // Προστασία route - μόνο για κτηνιάτρους
  useEffect(() => {
    if (!vet || vet.role !== "vet") {
      navigate("/login");
    }
  }, [vet, navigate]);

  // Συνάρτηση logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!vet) return null;

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
              <button
                className="menu-button"
                onClick={() => setOpenDeclarations(!openDeclarations)}
              >
                <FaFileAlt className="menu-icon" />
                <span>Δηλώσεις</span>
                <span className={`arrow ${openDeclarations ? "open" : ""}`}>▾</span>
              </button>
              {openDeclarations && (
                <ul className="submenu">
                  <li><NavLink  to="found2" className={({ isActive }) => isActive ? "active" : ""}>Δήλωση Εύρεσης</NavLink ></li>
                  <li><NavLink  to="loss2" className={({ isActive }) => isActive ? "active" : ""}>Δήλωση Απώλειας</NavLink ></li>
                  <li><NavLink  to="adopt" className={({ isActive }) => isActive ? "active" : ""}>Δήλωση Υιοθεσίας</NavLink ></li>
                  <li><NavLink  to="anadoxi" className={({ isActive }) => isActive ? "active" : ""}>Δήλωση Αναδοχής</NavLink ></li>
                  <li><NavLink  to="transfer" className={({ isActive }) => isActive ? "active" : ""}>Δήλωση Μεταβίβασης</NavLink ></li>
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/vet/history-statements"  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώσεων</span>
              </NavLink>
            </li>

            <li>
              <button
                className="menu-button"
                onClick={() => setOpenAnimalRegister(!openAnimalRegister)}
              >
                <FaFileAlt className="menu-icon" />
                <span>Καταγραφή Ζώου</span>
                <span className={`arrow ${openAnimalRegister ? "open" : ""}`}>▾</span>
              </button>
              {openAnimalRegister && (
                <ul className="submenu">
                  <li><NavLink  to="identity"  className={({ isActive }) => isActive ? "active" : ""}>Καταγραφή Ταυτότητας</NavLink ></li>
                  <li><NavLink  to="/vet/declarations/loss" className={({ isActive }) => isActive ? "active" : ""}>Ενημέρωση Ιατρικών Πράξεων</NavLink ></li>
                  <li><NavLink  to="/vet/declarations/import" className={({ isActive }) => isActive ? "active" : ""}>Προβολή Βιβλιαρίου</NavLink ></li>
                </ul>
              )}
            </li>

            <li>
              <NavLink
                to="/vet/bookings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaCalendarAlt className="menu-icon" /> <span>Ενημέρωση Διαθεσιμότητας</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/vet/history-bookings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/vet/future-bookings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaCalendarAlt className="menu-icon" /> <span>Μελλοντικά Ραντεβού</span>
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

