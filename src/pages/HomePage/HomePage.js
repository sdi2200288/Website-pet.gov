import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arxikieikona from "../../images/Arxiki_eikona.png";
import PetDetails from "../../components/Pet/Pet";
// import VetDetails from "../../components/Vet/Vet";
import owner from "../../images/owner.png";
import vet from "../../images/vet.png";
import { FiSearch } from "react-icons/fi";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { formatNumber } from "../Utils/Util";
import "../OwnerDashboard/BookDate";
import vetdefault from "../../images/vetdeafult.webp";

export default function Homepage() {
  const [ownersData, setOwnersData] = useState([]);
  const [vetData, setVetData] = useState([]);
  const [petData, setPetData] = useState([]);
  const [lostPets, setLostPets] = useState([]);
  const [topVets, setTopVets] = useState([]);
  const [searchChip, setSearchChip] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const ownerId = user?.id;

  const handleSearch = () => {
    const chip = searchChip.trim();
    if (!chip) {
      alert("Παρακαλώ εισάγετε τον αριθμό μικροτσίπ για αναζήτηση");
      return;
    }
    const pet = petData.find((p) => p.microchip === chip);
    if (!pet) {
      alert("Δεν βρέθηκε κατοικίδιο με αυτόν τον αριθμό μικροτσίπ");
      return;
    }
    if (!pet.lost) {
      alert("Το συγκεκριμένο κατοικίδιο δεν είναι δηλωμένο ως χαμένο");
      return;
    }
    else {
      navigate(`/all-lost-pets/PetProfile/${pet.id}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ownersRes = await fetch("http://localhost:3001/owners");
        const owners = await ownersRes.json();

        const vetRes = await fetch("http://localhost:3001/vets");
        const vets = await vetRes.json();

        const petRes = await fetch("http://localhost:3001/pets");
        const pets = await petRes.json();

        const recentLostPets = pets
          .filter((pet) => pet.lost === true)
          .sort((a, b) => new Date(b.lastSeenDate) - new Date(a.lastSeenDate))
          .slice(0, 3);

        const topVetsList = vets
          .sort((a, b) => {
            const aCount = Number(a.reviewCount || 0);
            const bCount = Number(b.reviewCount || 0);
            const aAvg = aCount ? Number(a.totalScore || 0) / aCount : 0;
            const bAvg = bCount ? Number(b.totalScore || 0) / bCount : 0;
            if (bAvg !== aAvg) return bAvg - aAvg;
            return bCount - aCount;
          })
          .slice(0, 3);

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
                maxLength={9}
                onChange={(e) => setSearchChip(e.target.value)}
              />
              <button className="hero-button" aria-label="Αναζήτηση" onClick={handleSearch}>
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
              Είσαι ιδιοκτήτης; <span className="arrow">→</span>
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

      {lostPets.length === 0 ? null : (
        <section className="lost-pets-section">
          <div className="lost-pets-wrap">
            <p className="lost-pets-title">Πρόσφατα Χαμένα Κατοικίδια</p>

            <div className="lost-pets-grid">
              {lostPets.map((p) => (
                <div className="lost-pet-card" key={p.id}>
                  <Link to={`/all-lost-pets/PetProfile/${p.id}`}> <PetDetails pet={p} mode={0} /></Link>
                </div>
              ))}
            </div>

            <div className="lost-pets-cta">
              <Link to="/all-lost-pets" className="see-all-lost-pets-btn"> Δες όλα τα χαμένα κατοικίδια </Link>
            </div>
          </div>
        </section>
      )}

      {topVets.length === 0 ? null : (
        <section className="lost-pets-section">
          <div className="lost-pets-wrap">
            <p className="lost-pets-title">Οι καλύτεροι κτηνιατροί μας</p>

            <div className="lost-pets-grid">
              {topVets.map((v) => {
                const fullName = `${v.firstname} ${v.lastname}`;
                const rating = v.reviewCount ? (Number(v.totalScore) / Number(v.reviewCount)).toFixed(1) : "0.0";

                return (
                  <div className="veterinarian-card" key={v.id}>
                    <div
                      className="vet-card-content"
                      onClick={() => navigate(`/owner-dashboard/bookprofile/${v.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigate(`/owner-dashboard/bookprofile/${v.id}`);
                        }
                      }}
                    >
                      <div className="pet-image">
                        <img src={v.photoUrl || vetdefault}
                          onError={(e) => {
                            e.target.src = vetdefault;
                          }} />
                      </div>

                      <div className="vet-info">
                        <h3>{fullName}</h3>
                        <p><strong>Περιοχή:</strong> {v.region}</p>
                        <p>
                          <strong>Ειδίκευση:</strong>{" "}
                          {Array.isArray(v.specializations) && v.specializations.length
                            ? v.specializations.join(", ")
                            : "—"}
                        </p>
                        <p><strong>Εμπειρία:</strong> {v.experience || 0} χρόνια</p>
                        <p><strong>Βαθμολογία:</strong> ⭐ {rating} ({v.reviewCount || 0})</p>
                      </div>

                      <button
                        className="book-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/owner-dashboard/book-date?vetId=${v.id}`);
                        }}
                      >
                        Κλείστε Ραντεβού
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lost-pets-cta">
              <Link to={`/owner-dashboard/book-date?ownerId=${ownerId}`} className="see-all-lost-pets-btn">
                Δες όλoυς τους κτηνιάτρους μας
              </Link>
            </div>
          </div>
        </section>
      )}

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
              <div className="stat-sub">Καταχωρημένα και διαθέσιμα για όλες τις λειτουργίες </div>
            </div>

            <div className="stat-box">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Πάντα διαθέσιμοι</div>
              <div className="stat-sub">Αναζήτηση microchip & βασικές λειτουργίες ανά πάσα στιγμή</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
