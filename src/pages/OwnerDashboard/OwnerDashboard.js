import "./OwnerDashboard.css";
import { NavLink, Link, Outlet } from "react-router-dom";
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
              <NavLink
                to="found"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaFileAlt className="menu-icon" /> <span>Δηλώσεις Εύρεσης</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="loss"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaExclamationCircle className="menu-icon" /> <span>Δηλώσεις Απώλειας</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="history-statement"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώσεων</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="health-booklet"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaBook className="menu-icon" /> <span>Προβολή Βιβλιαρίου</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/owner/bookings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaCalendarAlt className="menu-icon" /> <span>Κλείσιμο Ραντεβού</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/owner/history-bookings"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="future-bookings"
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




