import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate, Link } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import { FiSearch } from "react-icons/fi";
import { SPECIES, GENDERS, DAYS, dogPopular, catPopular, buildEnabledServicesByCategory, Stars, calculateMO } from "../Utils/Util";
import VetInfo from "../../components/Vet/VetInfo";
import VetPrices from "../../components/Vet/VetPrices";
import VetReview from "../../components/Vet/VetReview";


export default function Profile() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [lost, setLost] = useState("");
  const [chipInput, setChipInput] = useState("");
  const [chipSearch, setChipSearch] = useState("");

  // VET's
  const [activeTab, setActiveTab] = useState("info");
  const [reviews, setReviews] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isVet = user.role === "vet";
  const enabledServicesByCategory = buildEnabledServicesByCategory(user);

  useEffect(() => {
    if (!isVet || !user.id) return;

    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/reviews?vetId=${user.id}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const ownerIds = [...new Set(arr.map((r) => r.ownerId).filter(Boolean))];
        const owners = await Promise.all(
          ownerIds.map(async (id) => {
            const oRes = await fetch(`http://localhost:3001/owners?id=${id}`);
            const oData = await oRes.json();
            return Array.isArray(oData) ? oData[0] : null;
          })
        );

        const ownersById = {};
        owners.forEach((o) => {
          if (!o.id) return;
          ownersById[o.id] = `${o.firstname ?? ""} ${o.lastname ?? ""}`.trim();
        });
        const mapped = arr.map((r) => ({
          ...r,
          stars: Number(r.stars) || 0,
          text: r.text || "",
          author: ownersById[r.ownerId] || "Ανώνυμος",
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("el-GR") : "",
        }));
        setReviews(mapped);
      } catch (err) {
        console.error(err);
        setReviews([]);
      }
    })();
  }, [isVet, user.id]);



  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "vet")) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user === null || user === undefined || user.id === undefined) {
      return;
    }
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
    if (chipSearch && !p.microchip.includes(chipSearch)) return false;
    return true;
  });

  if (!user) return null;

  const schedule = user.schedule || {};
  const formatHours = (d) => {
    if (!d || !d.enabled) return "   Κλειστό";
    if (!d.from || !d.to) return " — ";
    return `   ${d.from} - ${d.to}`;
  };


  return (
    <div className="owner-profile">
      {/* ΚΑΡΤΑ ΠΡΟΦΙΛ */}
      {!isVet && (
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
            <button className="primary-btn"> <Link to="/updateprofile"> Ενημέρωση στοιχείων</Link></button>
            <button className="secondary-btn"> <Link to="/changecode"> Αλλαγή κωδικού</Link></button>
          </div>
        </div>
      )}

      {isVet && (<>
        <div className="profile-card profile-card-top">
          <div className="vet-top">
            <div className="vet-top-left">
              <div className="vet-avatar">
                <img src={user.photoUrl} alt="Φωτογραφία προφίλ" />
              </div>

              <div className="vet-identity">
                <div className="vet-name">
                  {user.firstname} {user.lastname}
                </div>
                <div className="vet-subtitle"> {"Κτηνίατρος"}
                </div>
              </div>
            </div>

            <div className="vet-top-actions">
              <button className="primary-btn"> <Link to="/updateprofile"> Ενημέρωση στοιχείων</Link></button>
              <button className="secondary-btn"> <Link to="/changecode">Αλλαγή κωδικού</Link> </button>
            </div>
          </div>
        </div>
        <div className="vet-tabs">
          <button className={`vet-tab ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")} type="button" > Προσωπικά στοιχεία - εκπαίδευση </button>
          <button className={`vet-tab ${activeTab === "prices" ? "active" : ""}`} onClick={() => setActiveTab("prices")} type="button"  > Τιμοκατάλογος </button>
          <button className={`vet-tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")} type="button"> Αξιολογήσεις </button>
        </div>
        <div className="profile-card vet-tab-card">
          {activeTab === "info" && <VetInfo user={user} />}
          {activeTab === "prices" && (<VetPrices schedule={schedule} days={DAYS} formatHours={formatHours} enabledServicesByCategory={enabledServicesByCategory} />)}
          {activeTab === "reviews" && (<VetReview reviews={reviews} avgRating={Number(calculateMO(user.totalScore, user.reviewCount || 0))} reviewCount={user.reviewCount || 0} Stars={Stars} />
          )}

        </div>
      </>
      )
      }

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
    </div >
  );
}
