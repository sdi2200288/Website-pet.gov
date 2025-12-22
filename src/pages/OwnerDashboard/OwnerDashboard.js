import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import ArxikiOwner from "../../images/ArxikiOwner.png";
import "./OwnerDashboard.css";
import { Link ,Outlet} from "react-router-dom";
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
              <Link to="profile">
                <FaUser className="menu-icon" /> <span>Το προφίλ μου</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/statement-finding">
                <FaFileAlt className="menu-icon" /> <span>Δηλώσεις Εύρεσης</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/loss-declaration">
                <FaExclamationCircle className="menu-icon" /> <span>Δηλώσεις Απώλειας</span>
              </Link>
            </li>
            <li>
              <Link to="/owner/health-booklet">
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




