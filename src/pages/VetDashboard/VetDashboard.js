import React, { useState } from "react";
import "./VetDashboard.css";
import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaFileAlt, FaBook, FaCalendarAlt, FaHistory } from "react-icons/fa";

export default function VetDashboard() {
  const [openMenu, setOpenMenu] = useState(null); // "declarations" ή "animal" ή null

  const vet = JSON.parse(localStorage.getItem("user"));

  if (vet && vet.role !== "vet") return <div>Access denied</div>; // απλή προστασία route

  return (
    <div className="VetDashboard">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Επιλογές Κτηνίατρου</h3>

          <ul className="sidebar-menu">
            <li>
              <NavLink
                  to="profile-vet"
                  className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                >
                <FaUser className="menu-icon" />
                <span>Το Προφίλ μου</span>
              </NavLink>
            </li>
            {/* Δηλώσεις */}
            <li>
              <button
                className="menu-button"
                onClick={() => setOpenMenu(openMenu === "declarations" ? null : "declarations")}
              >
                <FaFileAlt className="menu-icon" />
                <span>Δηλώσεις</span>
                <span className={`arrow ${openMenu === "declarations" ? "open" : ""}`}>▾</span>
              </button>
              {openMenu === "declarations" && (
                <ul className="submenu">
                  <li><NavLink to="/vet-dashboard/found2">Δήλωση Εύρεσης</NavLink></li>
                  <li><NavLink to="/vet-dashboard/loss2">Δήλωση Απώλειας</NavLink></li>
                  <li><NavLink to="/vet-dashboard/adopt">Δήλωση Υιοθεσίας</NavLink></li>
                  <li><NavLink to="/vet-dashboard/anadoxi">Δήλωση Αναδοχής</NavLink></li>
                  <li><NavLink to="/vet-dashboard/transfer">Δήλωση Μεταβίβασης</NavLink></li>
                </ul>
              )}
            </li>

            {/* Ιστορικό Δηλώσεων */}
            <li>
              <NavLink
                to="/vet-dashboard/history-statement"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaHistory className="menu-icon" />
                <span>Ιστορικό Δηλώσεων</span>
              </NavLink>
            </li>

            {/* Καταγραφή Ζώου */}
            <li>
              <button
                className="menu-button"
                onClick={() => setOpenMenu(openMenu === "animal" ? null : "animal")}
              >
                <FaFileAlt className="menu-icon" />
                <span>Καταγραφή Ζώου</span>
                <span className={`arrow ${openMenu === "animal" ? "open" : ""}`}>▾</span>
              </button>
              {openMenu === "animal" && (
                <ul className="submenu">
                  <li><NavLink to="/vet-dashboard/identity">Καταγραφή Ταυτότητας</NavLink></li>
                  <li><NavLink to="/vet-dashboard/medical">Ενημέρωση Ιατρικών Πράξεων</NavLink></li>
                  <li><NavLink to="/vet-dashboard/booklet">Προβολή Βιβλιαρίου</NavLink></li>
                </ul>
              )}
            </li>

            {/* Ραντεβού */}
            <li>
              <NavLink
                to="/vet-dashboard/bookings"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaCalendarAlt className="menu-icon" />
                <span>Ενημέρωση Διαθεσιμότητας</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/vet-dashboard/history-bookings"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaHistory className="menu-icon" />
                <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/vet-dashboard/future-bookings-vet"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaCalendarAlt className="menu-icon" />
                <span>Μελλοντικά Ραντεβού</span>
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
