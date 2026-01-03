import React, { useEffect, useState } from "react";
import arxikieikona from "../../images/Arxiki_eikona.png";
import PetDetails from "../../components/Pet/Pet";
import VetDetails from "../../components/Vet/Vet";
import owner from "../../images/owner.png";
import vet from "../../images/vet.png";
import { FiSearch } from "react-icons/fi";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { formatNumber } from "../Utils/Util";


export default function Homepage() {
  const [ownersData, setOwnersData] = useState([]);
  const [vetData, setVetData] = useState([]);
  const [petData, setPetData] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [topVets, setTopVets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownersRes = await fetch("http://localhost:3001/owners");
        const owners = await ownersRes.json();
        const vetRes = await fetch("http://localhost:3001/vets");
        const vets = await vetRes.json();
        const petRes = await fetch("http://localhost:3001/pets");
        const pets = await petRes.json();
        const recentLostPets = pets.filter(pet => pet.lost === true)
          .sort((a, b) => new Date(b.lostDate) - new Date(a.lostDate)).slice(0, 3);
        const topVetsList = vets.filter(v => v.reviewCount > 0)
          .sort((a, b) => (b.totalScore / b.reviewCount) - (a.totalScore / a.reviewCount)).slice(0, 3);
        setTopVets(topVetsList);
        setLostPets(recentLostPets);
        setOwnersData(owners);
        setVetData(vets);
        setPetData(pets);
      } catch (err) {
        console.error("Σφάλμα φόρτωσης δεδομένων", err);
      }
    };
    fetchData();
  }, []);

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
            {
              lostPets.length === 0 ? (
                <p className="empty-message">
                  Δεν υπάρχουν δηλωμένα χαμένα κατοικίδια αυτή τη στιγμή
                </p>
              ) :
                (
                  lostPets.map((pet) => (
                    <div className="lost-pet-card" key={pet.id}>
                      <PetDetails pet={pet} mode={0} />
                    </div>
                  ))
                )
            }
          </div>
          {
            lostPets.length !== 0 ? (
              <div className="lost-pets-cta">
                <Link to="/all-lost-pets" className="see-all-lost-pets-btn">
                  Δες όλα τα χαμένα κατοικίδια
                </Link>
              </div>
            ) : null
          }
        </div>

      </section>
      <section className="lost-pets-section">
        <div className="lost-pets-wrap">
          <p className="lost-pets-title">Οι καλύτεροι κτηνιατροί μας</p>
          <div className="lost-pets-grid">
            {
              topVets.length === 0 ? (
                <p className="empty-message">
                  Δεν υπάρχουν αξιολογημένοι κτηνίατροι
                </p>
              ) :
                (
                  topVets.map((vet) => (
                    <div className="lost-pet-card" key={vet.id}>
                      <VetDetails vet={vet} />
                    </div>
                  ))
                )
            }
          </div>
          {
            topVets.length !== 0 ? (
              <div className="lost-pets-cta">
                <Link to="/all-vets" className="see-all-lost-pets-btn">
                  Δες όλoυς τους κτηνιάτρους μας
                </Link>
              </div>
            ) : null
          }
        </div>

      </section >
      <section className="stats-section">
        <div className="stats-wrap">
          <div className="stats-title">Στατιστικά πλατφόρμας</div>

          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{formatNumber(vetData.length)}</div>
              <div className="stat-label">Επαγγελματίες Κτηνίατροι</div>
              <div className="stat-sub">Πιστοποιημένοι συνεργάτες σε όλη την Ελλάδα</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{formatNumber(ownersData.length)}</div>
              <div className="stat-label">Ιδιοκτήτες μας εμπιστεύονται</div>
              <div className="stat-sub">Χιλιάδες χρήστες διαχειρίζονται το προφίλ τους</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{formatNumber(petData.length)}</div>
              <div className="stat-label">Κατοικίδια</div>
              <div className="stat-sub">Δηλώσεις, βιβλιάρια και ραντεβού</div>
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
