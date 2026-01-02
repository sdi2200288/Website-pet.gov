import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate, Link } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import { FiSearch } from "react-icons/fi";
import { SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";

export default function Profile() {
  const navigate = useNavigate();

  //logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  //προστασια σελιδας
  useEffect(() => {
    if(! user || user.role != "owner"){
      navigate("/login");
    }
  }, [user, navigate]);

  //pets
  const [pets, setPets] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState("");

  useEffect(() => {
    if(!user) return;

    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch(() => setPets([]));
  }, [user]);

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

  if (!user) return null;

  return (

    <div className="owner-profile">

      {/* ΚΑΡΤΑ ΠΡΟΦΙΛ */}
      <div className="profile-card">

        <div className="profile-columns">

          {/* Αριστερή στήλη */}
          <div className="profile-section">
            <h3>Προσωπικά στοιχεία</h3>
            <ul>
  
              <li className="profile-row"><span>Όνομα</span><p>{user.firstname}</p></li>
              <li className="profile-row"><span>Επώνυμο</span><p>{user.lastname}</p></li>
              <li className="profile-row"><span>Φύλο</span><p>{user.gender}</p></li>
              <li className="profile-row"><span>ΑΦΜ</span><p>{user.afm}</p></li>
              <li className="profile-row"><span>Ημερομηνία γέννησης</span><p>{user.birthdate}</p></li>
            </ul>
          </div>

          {/* Δεξιά στήλη */}
          <div className="profile-section">
            <h3>Στοιχεία επικοινωνίας</h3>
            <ul>
              <li className="profile-row"><span>Διεύθυνση</span><p>{user.address}</p></li>
              <li className="profile-row"><span>Τηλέφωνο</span><p>{user.phone}</p></li>
              <li className="profile-row"><span>Email</span><p>{user.email}</p></li>
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
        <h3>Τα κατοικίδιά μου ({pets.length})</h3>

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
          {pets.length === 0 && (
            <p>Δεν έχετε καταχωρίσει κατοικίδια.</p>
          )}
          {pets.map((pet) => (
            <div
            key = {pet.id}
            className="pet-card-wrapper"
            onClick={() => navigate(`/ProfilePetOwner/${pet.id}`)}
          >
            <PetDetails pet={pet} />
          </div>
          ))}
          {/* <div
            className="pet-card-wrapper"
            onClick={() => navigate("/ProfilePetOwner")}
          >
            <PetDetails mode={1} />
          </div> */}
        </div>

      </div>
    </div>
  );
}
