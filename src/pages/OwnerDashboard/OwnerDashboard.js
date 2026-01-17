// import "./OwnerDashboard.css";
// import React from "react";
// import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaFileAlt,
//   FaExclamationCircle,
//   FaBook,
//   FaCalendarAlt,
//   FaHistory,
//   FaSignOutAlt
// } from "react-icons/fa";


// export default function OwnerDashboard() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   return (
//     <div className="OwnerDashboard">

//       {/* <nav className="breadcrumb">
//         <Link to="/">Αρχική /</Link>
//         <span>Dashboard Ιδιοκτήτη</span>
//       </nav> */}

//       <div className="dashboard-layout">
//         <aside className="sidebar">
//           <h3>Επιλογές Ιδιοκτήτη</h3>

//           <ul className="sidebar-menu">
//             {user && (
//               <li>
//                 <NavLink
//                   to={`profile?ownerId=${user.id}`}
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? "active" : ""}`
//                   }
//                 >
//                   <FaUser className="menu-icon" />
//                   <span>Το Προφίλ μου</span>
//                 </NavLink>
//               </li>
//             )}

//             <li>
//               <NavLink
//                 to={`found?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? "active" : ""}`
//                 }
//               >
//                 <FaFileAlt className="menu-icon" /> <span>Δηλώσεις Εύρεσης</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to={`loss?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? "active" : ""}`
//                 }
//               >
//                 <FaExclamationCircle className="menu-icon" /> <span>Δηλώσεις Απώλειας</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to={`history-statement?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaHistory className="menu-icon" /> <span>Ιστορικό Δηλώσεων</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to={`health-booklet?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? "active" : ""}`
//                 }
//               >
//                 <FaBook className="menu-icon" /> <span>Προβολή Βιβλιαρίου</span>
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to={`book-date?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? "active" : ""}`
//                 }
//               >
//                 <FaCalendarAlt className="menu-icon" /> <span>Κλείσιμο Ραντεβού</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to={`future-bookings?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? "active" : ""}`
//                 }
//               >
//                 <FaCalendarAlt className="menu-icon" /> <span>Μελλοντικά Ραντεβού</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to={`history-bookings-owner?ownerId=${user?.id || ""}`}
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
//               </NavLink>

//             </li>

//           </ul>
//         </aside>
//         <main className="dashboard-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>

//   );
// }




import "./OwnerDashboard.css"; 
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaExclamationCircle,
  FaBook,
  FaCalendarAlt,
  FaHistory
} from "react-icons/fa";

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [hideMainContent, setHideMainContent] = useState(false);

  useEffect(() => {
    // Αν είμαστε στο βασικό dashboard path, δείχνουμε τα info cards
    // Αν είναι κάποιο από τα children routes, κρύβουμε τα info cards
    setHideMainContent(location.pathname !== "/owner-dashboard");
  }, [location.pathname]);

  return (
    <div className="OwnerDashboard">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Επιλογές Ιδιοκτήτη</h3>
          <ul className="sidebar-menu">
            {user && (
              <li>
                <NavLink
                  to={`profile?ownerId=${user.id}`}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <FaUser className="menu-icon" />
                  <span>Το Προφίλ μου</span>
                </NavLink>
              </li>
            )}
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
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
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
                to={`future-bookings?ownerId=${user?.id || ""}`}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <FaCalendarAlt className="menu-icon" /> <span>Μελλοντικά Ραντεβού</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`history-bookings-owner?ownerId=${user?.id || ""}`}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaHistory className="menu-icon" /> <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="dashboard-content">
                 {!hideMainContent && (
                   <div className="dashboard-welcome-content">
                     <section className="platform-guide">
                       <h2>Πώς Λειτουργεί η Πλατφόρμα</h2>
                       <div className="guide-steps">
                         <div className="guide-step">
                           <h3>Εγγραφή & Προφίλ</h3>
                           <p> Δημιουργήστε τον λογαριασμό σας και προσθέστε τα κατοικίδιά σας με όλες τις πληροφορίες τους.</p>
                         </div>
                         <div className="guide-step">
                           <h3>Αναζήτηση Κτηνιάτρου</h3>
                           <p>Βρείτε κτηνιάτρους κοντά σας, δείτε αξιολογήσεις και διαθεσιμότητα σε πραγματικό χρόνο.</p>
                         </div>
                         <div className="guide-step">
                           <h3>Κλείστε Ραντεβού</h3>
                           <p>Προγραμματίστε επισκέψεις online, επιλέξτε ημερομηνία και ώρα που σας βολεύει.</p>
                         </div>
                         <div className="guide-step">
                           <h3>Ιατρικό Ιστορικό</h3>
                           <p>Έχετε πρόσβαση στο πλήρες ιστορικό υγείας των κατοικιδίων σας, εμβολιασμούς και θεραπείες.</p>
                         </div>
                       </div>
                     </section>
       
                     <section className="new-services-section">
                       <div className="section-header">
                         <h2> Υπηρεσίες</h2>
                       </div>
                       <div className="services-grid">
                         <div className="service-card">
                           <h3>Αυτόματες Υπενθυμίσεις</h3>
                           <p>Λάβετε αυτόματες ειδοποιήσεις για επαναληπτικούς εμβολιασμούς, αποπαραστώσεις και προγραμματισμένα check-ups απο τους πελάτες σας.</p>
                          
                         </div>
                         <div className="service-card">
                           <h3>Ψηφιακές Δηλώσεις</h3>
                           <p>Δηλώστε απώλεια ή εύρεση κατοικιδίου και ειδοποιήστε αυτόματα κτηνιάτρους και καταφύγια στην περιοχή σας.</p>
                           <div className="service-stat">
                             <span className="stat-highlight">Εξοικονόμηση χρόνου 80%</span>
                           </div>
                         </div>
                         <div className="service-card ">
                           <h3>Πιστοποίηση Υγείας</h3>
                           <p>Εκδώστε ψηφιακά τα πιστοποιητικά υγείας των ζώων με επίσημη ψηφιακή υπογραφή.</p>
                           <div className="service-stat">
                             <span className="stat-highlight">Άμεση έκδοση</span>
                           </div>
                         </div>
                       </div>
                     </section>
                      <div className="vet-banner">
                       <div className="banner-content">
                         <h2>Έχετε Κατοικίδιο ;</h2>
                         <p>Εγγραφείτε δωρεάν και διαχειριστείτε την υγεία των κατοικιδίων σας εύκολα.</p>
                         <div className="banner-buttons">
                           <button className="register-btn">Εγγραφή</button>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
       
                 <Outlet />
               </main>
             </div>
           </div>
         );
       }
       