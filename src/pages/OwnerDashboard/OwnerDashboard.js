import React, { useState } from "react";
import "./OwnerDashboard.css";
import { Link, Outlet } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaExclamationCircle,
  FaBook,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";


export default function OwnerDashboard() {
  return (
    <div className="OwnerDashboard">

      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span>Dashboard Ιδιοκτήτη</span>
      </nav>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Επιλογές Ιδιοκτήτη</h3>

          <ul className="sidebar-menu">
            <li>
              <Link to="Found">
                <FaFileAlt className="menu-icon" /> <span>Δηλώσεις Εύρεσης</span>
              </Link>
            </li>
            <li>
              <Link to="Loss">
                <FaExclamationCircle className="menu-icon" /> <span>Δηλώσεις Απώλειας</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/history-statement">
                <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώσεων</span>
              </Link>
            </li>
            <li>
              <Link to="health-booklet">
                <FaBook className="menu-icon" /> <span>Προβολή Βιβλιαρίου</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/bookings">
                <FaCalendarAlt className="menu-icon" /> <span>Κλείσιμο Ραντεβού</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/history-bookings">
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/future-bookings">
                <FaCalendarAlt className="menu-icon" /> <span>Μελλοντικά Ραντεβού</span>
              </Link>
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




