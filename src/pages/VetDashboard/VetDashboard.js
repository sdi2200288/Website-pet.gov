// import React, { useState } from "react";
// import "./VetDashboard.css";
// import { NavLink, Outlet } from "react-router-dom";
// import { FaUser, FaFileAlt, FaBook, FaCalendarAlt, FaHistory } from "react-icons/fa";

// export default function VetDashboard() {
//   const [openMenu, setOpenMenu] = useState(null); // "declarations" ή "animal" ή null

//   const vet = JSON.parse(localStorage.getItem("user"));

//   if (vet && vet.role !== "vet") return <div>Access denied</div>; // απλή προστασία route

//   return (
//     <div className="VetDashboard">
//       <div className="dashboard-layout">
//         <aside className="sidebar">
//           <h3>Επιλογές Κτηνίατρου</h3>

//           <ul className="sidebar-menu">
//             {vet && vet.role === "vet" && (
//               <li>
//                 <NavLink
//                   to="profile-vet"
//                   className={({ isActive }) =>
//                     `sidebar-link ${isActive ? "active" : ""}`
//                   }
//                 >
//                   <FaUser className="menu-icon" />
//                   <span>Το Προφίλ μου</span>
//                 </NavLink>
//               </li>
//             )}
//             {/* Δηλώσεις */}
//             <li>
//               <button
//                 className="menu-button"
//                 onClick={() => setOpenMenu(openMenu === "declarations" ? null : "declarations")}
//               >
//                 <FaFileAlt className="menu-icon" />
//                 <span>Δηλώσεις</span>
//                 <span className={`arrow ${openMenu === "declarations" ? "open" : ""}`}>▾</span>
//               </button>
//               {openMenu === "declarations" && (
//                 <ul className="submenu">
//                   <li><NavLink to="/vet-dashboard/found2">Δήλωση Εύρεσης</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/loss2">Δήλωση Απώλειας</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/adopt">Δήλωση Υιοθεσίας</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/anadoxi">Δήλωση Αναδοχής</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/transfer">Δήλωση Μεταβίβασης</NavLink></li>
//                 </ul>
//               )}
//             </li>

//             {/* Ιστορικό Δηλώσεων */}
//             <li>
//               <NavLink
//                 to="/vet-dashboard/history-statement"
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaHistory className="menu-icon" />
//                 <span>Ιστορικό Δηλώσεων</span>
//               </NavLink>
//             </li>

//             {/* Καταγραφή Ζώου */}
//             <li>
//               <button
//                 className="menu-button"
//                 onClick={() => setOpenMenu(openMenu === "animal" ? null : "animal")}
//               >
//                 <FaFileAlt className="menu-icon" />
//                 <span>Καταγραφή Ζώου</span>
//                 <span className={`arrow ${openMenu === "animal" ? "open" : ""}`}>▾</span>
//               </button>
//               {openMenu === "animal" && (
//                 <ul className="submenu">
//                   <li><NavLink to="/vet-dashboard/identity">Καταγραφή Ταυτότητας</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/medical">Ενημέρωση Ιατρικών Πράξεων</NavLink></li>
//                   <li><NavLink to="/vet-dashboard/booklet">Προβολή Βιβλιαρίου</NavLink></li>
//                 </ul>
//               )}
//             </li>

//             {/* Ραντεβού */}
//             <li>
//               <NavLink
//                 to="/vet-dashboard/availability"
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaCalendarAlt className="menu-icon" />
//                 <span>Ενημέρωση Διαθεσιμότητας</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/vet-dashboard/history-bookings"
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaHistory className="menu-icon" />
//                 <span>Ιστορικό Ραντεβού</span>
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/vet-dashboard/future-bookings-vet"
//                 className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
//               >
//                 <FaCalendarAlt className="menu-icon" />
//                 <span>Μελλοντικά Ραντεβού</span>
//               </NavLink>
//             </li>
//           </ul>
//         </aside>



//         <main className="dashboard-content">
//           <div className="info-cards">
//             <div className="info-card">
//               <h4>Συνολικά Ζώα</h4>
//               <p>120</p>
//             </div>
//             <div className="info-card">
//               <h4>Μελλοντικά Ραντεβού</h4>
//               <p>15</p>
//             </div>
//             <div className="info-card">
//               <h4>Τελευταίες Δηλώσεις</h4>
//               <p>8</p>
//             </div>
//             <div className="info-card">
//               <h4>Υιοθεσίες Αυτόν τον Μήνα</h4>
//               <p>3</p>
//             </div>
//           </div>

//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import "./VetDashboard.css";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaUser, FaFileAlt, FaBook, FaCalendarAlt, FaHistory } from "react-icons/fa";

export default function VetDashboard() {
  const [openMenu, setOpenMenu] = useState(null);
  const [hideMainContent, setHideMainContent] = useState(false);

  const vet = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // --- Hooks πάντα στην κορυφή ---
  React.useEffect(() => {
    // Αν το path είναι ακριβώς /vet-dashboard, δείξε τα info cards
    setHideMainContent(location.pathname !== "/vet-dashboard");
  }, [location.pathname]);

  // --- Προστασία route μετά τα hooks ---
  if (vet && vet.role !== "vet") return <div>Access denied</div>;
  return (
    <div className="VetDashboard">
      <div className="dashboard-layout">
        <aside className="sidebar">
          <h3>Επιλογές Κτηνίατρου</h3>
          <ul className="sidebar-menu">
            {vet && vet.role === "vet" && (
              <li>
                <NavLink
                  to="profile-vet"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                >
                  <FaUser className="menu-icon" />
                  <span>Το Προφίλ μου</span>
                </NavLink>
              </li>
            )}
            <li>
              <button
                className="menu-button"
                onClick={() =>
                  setOpenMenu(openMenu === "declarations" ? null : "declarations")
                }
              >
                <FaFileAlt className="menu-icon" />
                <span>Δηλώσεις</span>
                <span className={`arrow ${openMenu === "declarations" ? "open" : ""}`}>▾</span>
              </button>
              {openMenu === "declarations" && (
                <ul className="submenu">
                  <li>
                    <NavLink to="/vet-dashboard/found2">Δήλωση Εύρεσης</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/loss2">Δήλωση Απώλειας</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/adopt">Δήλωση Υιοθεσίας</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/anadoxi">Δήλωση Αναδοχής</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/transfer">Δήλωση Μεταβίβασης</NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink
                to="/vet-dashboard/history-statement"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaHistory className="menu-icon" />
                <span>Ιστορικό Δηλώσεων</span>
              </NavLink>
            </li>
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
                  <li>
                    <NavLink to="/vet-dashboard/identity">Καταγραφή Ταυτότητας</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/medical">Ενημέρωση Ιατρικών Πράξεων</NavLink>
                  </li>
                  <li>
                    <NavLink to="/vet-dashboard/booklet">Προβολή Βιβλιαρίου</NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink
                to="/vet-dashboard/availability"
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
          {!hideMainContent && (
            <div className="dashboard-welcome-content">
              <section className="platform-guide">
                <h2>Πώς Λειτουργεί η Πλατφόρμα</h2>
                <div className="guide-steps">
                  <div className="guide-step">
                    <h3>Εγγραφή & Προφίλ</h3>
                    <p>Δημιουργήστε το προφίλ σας ως κτηνίατρος, προσθέστε τα στοιχεία του ιατρείου σας και τις ώρες λειτουργίας.</p>
                  </div>
                  <div className="guide-step">
                    <h3>Καταχώρηση Ζώων</h3>
                    <p>Καταχωρήστε τα ζώα που εξετάζετε με πλήρες ιατρικό ιστορικό, εμβολιασμούς και θεραπείες.</p>
                  </div>
                  <div className="guide-step">
                    <h3>Διαχείριση Ραντεβού</h3>
                    <p>Οργανώστε τα ραντεβού σας, ενημερώστε τη διαθεσιμότητά σας και λάβετε υπενθυμίσεις.</p>
                  </div>
                  <div className="guide-step">
                    <h3>Υποστήριξη Υιοθεσιών</h3>
                    <p>Συνεργαστείτε με ιδιοκτήτες για υιοθεσίες, εκδώστε πιστοποιητικά υγείας και παρακολουθήστε τη διαδικασία.</p>
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
                    <p>Υποβάλλετε δηλώσεις απώλειας,εύρεσης, δημιουργήστε την καρτέλα ενός ζώου όλα ηλεκτρονικά, χωρίς γραφειοκρατία.</p>
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
                  <h2>Είστε Κτηνίατρος ;</h2>
                  <p>Εγγραφείτε δωρεάν και αποκτήστε πρόσβαση σε όλα τα εργαλεία διαχείρισης.</p>
                  <div className="banner-buttons">
                    <button className="learn-more-btn">Μάθετε Περισσότερα</button>
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
