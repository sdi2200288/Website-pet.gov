import React, { useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";

export default function Profile() {
  const navigate = useNavigate();

  const [selectedSpecies, setSelectedSpecies] = useState("");

  const getBreeds = () => {
    if (!selectedSpecies) {
      return [...dogPopular, ...catPopular];
    }
    if (selectedSpecies === "Σκύλος") {
      return dogPopular;
    }
    if (selectedSpecies === "Γάτα") {
      return catPopular;
    }
    return [];
  };
  const breeds = getBreeds();

  return (

    <div className="owner-profile">

      {/* ΚΑΡΤΑ ΠΡΟΦΙΛ */}
      <div className="profile-card">

        <div className="profile-columns">

          {/* Αριστερή στήλη */}
          <div className="profile-section">
            <h3>Προσωπικά στοιχεία</h3>
            <ul>
              <li><span>Όνομα</span><p>Μαρία</p></li>
              <li><span>Επώνυμο</span><p>Παπαδοπούλου</p></li>
              <li><span>Φύλο</span><p>Γυναίκα</p></li>
              <li><span>ΑΦΜ</span><p>123456789</p></li>
              <li><span>Ημερομηνία γέννησης</span><p>12/05/1998</p></li>
            </ul>
          </div>

          {/* Δεξιά στήλη */}
          <div className="profile-section">
            <h3>Στοιχεία επικοινωνίας</h3>
            <ul>
              <li><span>Διεύθυνση</span><p>Αθήνα</p></li>
              <li><span>Τηλέφωνο</span><p>6900000000</p></li>
              <li><span>Email</span><p>maria@email.com</p></li>
            </ul>
          </div>

        </div>

        {/* Κουμπιά */}
        <div className="profile-actions">
          <button className="secondary-btn"> <Link to="/changecode"> Αλλαγή κωδικού</Link></button>
          <button className="primary-btn">Ενημέρωση στοιχείων</button>
        </div>
      </div>

      {/* ΚΑΤΟΙΚΙΔΙΑ */}
      <div className="pets-section">
        <h3>Τα κατοικίδιά μου (2)</h3>

        <div className="pets-filters">
          <div className="filter-item">
            <span className="filter-label">Ταξινόμηση:</span>
            <select>
              <option value="">Αλφαβητικά</option>
              <option value="name">Όνομα (Α-Ω)</option>
              <option value="age">Ηλικία (Μικρότερο-Μεγαλύτερο)</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Είδος:</span>
            <select value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}>
              <option value="">Όλα</option>
              {SPECIES.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Ράτσα:</span>
            <select>
              <option value="">Όλες</option>
              {breeds.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="">Άλλο</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Φύλο:</span>
            <select>
              <option value="">Όλα</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Εξαφανισμένο:</span>
            <select>
              <option value="">Όλα</option>
              <option value="0">Όχι</option>
              <option value="1">Ναι</option>
            </select>
          </div>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Εισάγετε αριθμό μικροτσίπ..."
              className="hero-input"
            />
            <button className="hero-button" aria-label="Αναζήτηση">
              <FiSearch size={18} />
            </button>

          </div>
        </div>

        <div className="pets-grid">
          <div
            className="pet-card-wrapper"
            onClick={() => navigate("/ProfilePetOwner")}
          >
            <PetDetails mode={0} />
          </div>

          <div
            className="pet-card-wrapper"
            onClick={() => navigate("/ProfilePetOwner")}
          >
            <PetDetails mode={1} />
          </div>
        </div>

      </div>
    </div>
  );
}
