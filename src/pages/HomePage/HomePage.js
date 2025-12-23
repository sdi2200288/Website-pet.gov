import React from "react";
import arxikieikona from "../../images/Arxiki_eikona.png";
import PetDetails from "../../components/Pet/Pet";
import owner from "../../images/owner.png";
import vet from "../../images/vet.png";
import { FiSearch } from "react-icons/fi";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="Home">
      <section className="hero-section" id="home">
        <div className="hero-image-container">
          <img src={arxikieikona} alt="Κατοικίδιο" className="main-image" />

          <div className="hero-card">
            <h1>Βρήκατε Κατοικίδιο;</h1>
            <p className="hero-desc">
              Είσαι ιδιοκτήτης, κτηνίατρος ή απλός πολίτης και βρήκες κάποιο κατοικίδιο;
            </p>
            <p className="hero-instr">
              Δεν χρειάζεται να συνδεθείς. Απλά βάλε το μικροτσίπ για να βρείς το κατοικίδιο
              και να δηλώσεις εύρεση.
            </p>

            <div className="hero-search">
              <input
                type="text"
                placeholder="Εισάγετε αριθμό μικροτσίπ..."
                className="hero-input"
              />
              <button className="hero-button" aria-label="Αναζήτηση">
                <FiSearch size={28} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="info-sections">
        <div className="info-block" id="vet">
          <div className="info-image-wrap">
            <img src={vet} alt="Κτηνίατρος" className="info-image" />
          </div>

          <div className="info-text">
            <Link to="/vet-dashboard" className="vet-owner-button">
              Είσαι κτηνίατρος; <span className="arrow">→</span>
            </Link>
            <p>Ως συνδεδεμένος κτηνίατρος στην πλατφόρμα μπορείς να:</p>
            <ul>
              <li>Να δημιουργήσεις/ενημερώσεις επαγγελματικό προφίλ</li>
              <li>Να καταχωρίζεις στοιχεία κατοικιδίων και συμβάντα</li>
              <li>Να καταχωρίζεις ιατρικές πράξεις και να εκτυπώνεις βιβλιάρια</li>
              <li>Να ορίζεις διαθεσιμότητα και να διαχειρίζεσαι ραντεβού</li>
              <li>Να προβάλλεις ιστορικό και αξιολογήσεις</li>
            </ul>
          </div>

        </div>

        <div className="info-block reverse" id="owner">
          <div className="info-image-wrap">
            <img src={owner} alt="Ιδιοκτήτης" className="info-image" />
          </div>

          <div className="info-text">
            <Link to="/owner-dashboard" className="vet-owner-button">
              Είσαι ιδιοκτήτης;  <span className="arrow">→</span>
            </Link>
            <p>Ως συνδεδεμένος ιδιοκτήτης στην πλατφόρμα μπορείς να:</p>
            <ul>
              <li>Να παρακολουθείς ιατρικές πράξεις και ηλεκτρονικό βιβλιάριο</li>
              <li>Να δηλώνεις απώλεια/εύρεση και να βλέπεις ιστορικό</li>
              <li>Να αναζητάς κτηνιάτρους βάσει περιοχής/διαθεσιμότητας</li>
              <li>Να κλείνεις/τροποποιείς/ακυρώνεις ραντεβού</li>
              <li>Να αξιολογείς κτηνιάτρους</li>
            </ul>
          </div>

        </div>
      </section>
      <section className="lost-pets-section">
        <div className="lost-pets-wrap">
          <p className="lost-pets-title">Πρόσφατα Χαμένα Κατοικίδια</p>

          <div className="lost-pets-grid">
            <div className="lost-pet-card">
              <PetDetails mode={0} />
            </div>

            <div className="lost-pet-card">
              <PetDetails mode={0} />
            </div>

            <div className="lost-pet-card">
              <PetDetails mode={0} />
            </div>
          </div>

          <div className="lost-pets-cta">
            <Link to="/all-lost-pets" className="see-all-lost-pets-btn">
              Δες όλα τα χαμένα κατοικίδια
            </Link>
          </div>
        </div>
      </section>
      <section className="stats-section">
        <div className="stats-wrap">
          <div className="stats-title">Στατιστικά πλατφόρμας</div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">5034</div>
              <div className="stat-label">Επαγγελματίες Κτηνίατροι</div>
              <div className="stat-sub">Πιστοποιημένοι συνεργάτες σε όλη την Ελλάδα</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">200 χιλ</div>
              <div className="stat-label">Ιδιοκτήτες μας εμπιστεύονται</div>
              <div className="stat-sub">Χιλιάδες χρήστες διαχειρίζονται το προφίλ τους</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">1+ εκατ</div>
              <div className="stat-label">Εξυπηρετήσεις χρηστών</div>
              <div className="stat-sub">Δηλώσεις, βιβλιάρια, ραντεβού και ενημερώσεις</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Πάντα διαθέσιμοι</div>
              <div className="stat-sub">Αναζήτηση microchip & βασικές λειτουργίες ανά πάσα στιγμή</div>
            </div>
          </div>
        </div>
      </section>

    </div >
  );
}
