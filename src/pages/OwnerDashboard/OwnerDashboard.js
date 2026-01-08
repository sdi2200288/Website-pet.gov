import "./OwnerDashboard.css";
import React from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaExclamationCircle,
  FaBook,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt
} from "react-icons/fa";


export default function OwnerDashboard() {
  // const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // useEffect(() => {
  //   if(!user || user.role != "owner"){
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  // if (!user) return null;

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
              <NavLink
                to={`profile?ownerId=${user?.id || ""}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaUser className="menu-icon" />
                <span>Το Προφίλ μου</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`found?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              >
                <FaFileAlt className="menu-icon" /> <span>Δηλώσεις Εύρεσης</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`loss?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              >
                <FaExclamationCircle className="menu-icon" /> <span>Δηλώσεις Απώλειας</span>
              </NavLink>
            </li>
            <li>
              <NavLink
               to={`history-statement?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώσεων</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`health-booklet?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              >
                <FaBook className="menu-icon" /> <span>Προβολή Βιβλιαρίου</span>
              </NavLink>
            </li>
            <li>
              <NavLink
               to={`book-date?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              >
                <FaCalendarAlt className="menu-icon" /> <span>Κλείσιμο Ραντεβού</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`history-bookings?ownerId=${user?.id || ""}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>
            <li>
              <NavLink
               to={`future-bookings?ownerId=${user?.id || ""}`}
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




