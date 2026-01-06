import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate, Link } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import { FiSearch } from "react-icons/fi";
import { SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";

export default function Profile() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [lost, setLost] = useState("");
  const [chipInput, setChipInput] = useState("");
  const [chipSearch, setChipSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "owner" && user.role !== "vet") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch(console.error);
  }, []);

  const handleSpeciesChange = (e) => {
    setSpecies(e.target.value);
    setBreed("");
  };

  const breedOptions = species === "Σκύλος" ? dogPopular : species === "Γάτα" ? catPopular : [];


  const filteredPets = pets.filter((p) => {
    if (species && p.species !== species) return false;
    if (breed && p.breed !== breed) return false;
    if (gender && p.gender !== gender) return false;

    if (lost) {
      if (lost === "1" && !p.lost) return false;
      if (lost === "0" && p.lost) return false;
    }
    if (chipSearch && !p.microchip?.includes(chipSearch)) return false;
    return true;
  });

  if (!user) return null;

  return (

    <div className="owner-profile">

      {/* ΚΑΡΤΑ ΠΡΟΦΙΛ */}
      <div className="profile-card">

        <h2 className="profile-title">
          {user.role === "vet" ? "Προφίλ Κτηνιάτρου" : "Προφίλ Ιδιοκτήτη"}
        </h2>
        
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
        <h3>Τα κατοικίδιά μου ({filteredPets.length})</h3>

        <div className="pets-filters">
          <div className="filter-item">
            <span className="filter-label">Είδος:</span>
            <select value={species} onChange={handleSpeciesChange}>
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
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              disabled={!species}
            >
              <option value="">Όλες</option>
              {breedOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="">Άλλο</option>
            </select>
          </div>

          <div className="filter-item">
            <span className="filter-label">Φύλο:</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
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
            <select value={lost} onChange={(e) => setLost(e.target.value)}>
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
              value={chipInput}
              onChange={(e) => setChipInput(e.target.value)}
            />
            <button className="hero-button" aria-label="Αναζήτηση"
              onClick={() => {
                const q = chipInput.trim();
                setSpecies("");
                setBreed("");
                setGender("");
                setLost("");
                setChipSearch(q);
              }}
            >
              <FiSearch size={18} />
            </button>

          </div>
        </div>

        <div className="pets-grid">
          {filteredPets.length === 0 && (
            <p>Δεν έχετε καταχωρίσει κατοικίδια.</p>
          )}
          {filteredPets.map((pet) => (
            <div key={pet.id} className="pet-card-wrapper" onClick={() => navigate(`/ProfilePetOwner/${pet.id}`)} >
              <PetDetails pet={pet} mode={pet.lost ? 0 : 1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
