import React, { useState } from "react"; 
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUser,
  FaFileAlt,
  FaHistory,
  FaPaw,
  FaCalendarDay,
  FaStethoscope,
  FaExclamationTriangle
} from "react-icons/fa";
import "./VetDashboard.css";

export default function OriginalDashboardVet() {
  const [openMenu, setOpenMenu] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !["vet", "owner"].includes(user.role)) {
    return <div>Access denied</div>;
  }

  const vet = user;

  return (
    <div className="VetDashboard">
      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>Επιλογές Κτηνίατρου</h3>

          <ul className="sidebar-menu">
            {/* Προφίλ */}
            {vet && vet.role === "vet" && (
              <li>
                <NavLink to="/vet-dashboard/profile-vet" end>Το Προφίλ μου</NavLink>
              </li>
            )}

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
                  <li><NavLink to="found2">Δήλωση Εύρεσης</NavLink></li>
                  <li><NavLink to="loss2">Δήλωση Απώλειας</NavLink></li>
                  <li><NavLink to="adopt">Δήλωση Υιοθεσίας</NavLink></li>
                  <li><NavLink to="anadoxi">Δήλωση Αναδοχής</NavLink></li>
                  <li><NavLink to="transfer">Δήλωση Μεταβίβασης</NavLink></li>
                </ul>
              )}
            </li>

            {/* Ιστορικό Δηλώσεων */}
            <li>
              <NavLink
                to="history-statement"
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
                  <li><NavLink to="identity">Καταγραφή Ταυτότητας</NavLink></li>
                  <li><NavLink to="medical">Ενημέρωση Ιατρικών Πράξεων</NavLink></li>
                  <li><NavLink to="booklet">Προβολή Βιβλιαρίου</NavLink></li>
                </ul>
              )}
            </li>

            {/* Ραντεβού */}
            <li>
              <NavLink
                to="availability"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaCalendarDay className="menu-icon" />
                <span>Διαθεσιμότητα</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="history-bookings"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaHistory className="menu-icon" />
                <span>Ιστορικό Ραντεβού</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="future-bookings-vet"
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              >
                <FaCalendarDay className="menu-icon" />
                <span>Μελλοντικά Ραντεβού</span>
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dashboard-content">
          {/* Καλωσόρισμα */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Καλώς ήρθατε στο Πάνελ Διαχείρισης</h1>
            <p className="text-gray-600 mt-1">Διαχειριστείτε τα ραντεβού και τα ζώα σας εύκολα και γρήγορα.</p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[ 
              { title: "Σημερινά Ραντεβού", value: 5, icon: <FaCalendarDay />, note: "+2 από χθες", color: "text-blue-500" },
              { title: "Συνολικοί Ασθενείς", value: 128, icon: <FaPaw />, note: "Εγγεγραμμένα ζώα", color: "text-green-500" },
              { title: "Εκκρεμείς Δηλώσεις", value: 3, icon: <FaFileAlt />, note: "Χρειάζονται ενέργεια", color: "text-red-500" }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">{card.title}</h3>
                  <div className={`${card.color} h-6 w-6`}>{card.icon}</div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">{card.note}</p>
              </div>
            ))}
          </div>

          {/* Πληροφοριακά Πλαίσια / Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[
              { title: "Γενικές Πληροφορίες", icon: <FaStethoscope className="h-5 w-5 text-blue-500" />, content: "Μέσω αυτής της πλατφόρμας μπορείτε να διαχειρίζεστε τα ραντεβού σας, να καταγράφετε νέα ζώα και να ενημερώνετε τη διαθεσιμότητά σας. Όλες οι δηλώσεις που υποβάλλετε είναι σύμφωνες με την ισχύουσα νομοθεσία περί κατοικίδιων ζώων." },
              { title: "Υπενθυμίσεις", icon: <FaExclamationTriangle className="h-5 w-5 text-amber-500" />, content: ["Ενημερώστε τη διαθεσιμότητά σας για την επόμενη εβδομάδα", "Ελέγξτε τις εκκρεμείς δηλώσεις", "Επιβεβαιώστε τα αυριανά ραντεβού"] }
            ].map((box, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300">
                <div className="flex items-center gap-2 mb-4">
                  {box.icon}
                  <h3 className="font-semibold text-gray-800">{box.title}</h3>
                </div>
                {Array.isArray(box.content) ? (
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    {box.content.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">{box.content}</p>
                )}
              </div>
            ))}
          </div>

          {/* Outlet για child routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
