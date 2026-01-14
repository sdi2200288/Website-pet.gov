import React, { useEffect, useState } from "react";
import "./AllLostPets.css";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import XamenaKatoikidia from "../../images/XamenaKatoikidia.png";
import PetDetails from "../../components/Pet/Pet";
import { GENDERS, SPECIES, REGIONS, dogPopular, catPopular } from "../Utils/Util";

export default function AllLostPets() {
  const [lostPets, setLostPets] = useState([]);
  const [allLostPets, setAllLostPets] = useState([]);

  const [species, setSpecies] = useState("");
  const [breedOptions, setBreedOptions] = useState([]);
  const [breed, setBreed] = useState("");
  const [region, setRegion] = useState("");
  const [gender, setGender] = useState("");
  const [chipSearch, setChipSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/pets");
        const pets = await res.json();
        const lost = pets.filter((p) => p.lost === true);
        setAllLostPets(lost);
        setLostPets(lost);
      } catch (err) {
        console.error("Σφάλμα φόρτωσης δεδομένων", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!chipSearch.trim()) {
      alert("Παρακαλώ εισάγετε τον αριθμό μικροτσίπ για αναζήτηση");
      return;
    }
    const result = allLostPets.filter(p => p.microchip?.includes(chipSearch));
    setLostPets(result);
  };

  useEffect(() => {
    setLostPets(prev => [...prev].sort((a, b) => sortOrder === "recent" ? new Date(b.lastSeenDate) - new Date(a.lastSeenDate) : new Date(a.lastSeenDate) - new Date(b.lastSeenDate)));
  }, [sortOrder]);

  const applyFiltersAndSort = () => {
    let result = [...allLostPets];
    if (region) result = result.filter(p => p.region === region);
    if (species) result = result.filter(p => p.species === species);
    if (breed) {
      if (breed === "__OTHER__") {
        const popular = new Set(breedOptions);
        result = result.filter((p) => {
          const petBreed = (p.breed ?? "").trim();
          if (!petBreed) return false;
          return !popular.has(petBreed);
        });
      } else {
        result = result.filter((p) => (p.breed ?? "") === breed);
      }
    }
    if (gender) result = result.filter(p => p.gender === gender);
    result.sort((a, b) => sortOrder === "recent" ? new Date(b.lastSeenDate) - new Date(a.lastSeenDate) : new Date(a.lastSeenDate) - new Date(b.lastSeenDate));
    setLostPets(result);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [sortOrder]);

  const doFilters = () => {
    applyFiltersAndSort();
  };

  const handleSpeciesChange = (e) => {
    const value = e.target.value;
    setSpecies(value);
    setBreed("");
    if (value === "Σκύλος") { setBreedOptions(dogPopular); }
    else if (value === "Γάτα") { setBreedOptions(catPopular); }
    else { setBreedOptions([]); }
  };

  const clearFilters = () => {
    setRegion("");
    setSpecies("");
    setBreed("");
    setGender("");
    setChipSearch("");
    setBreedOptions([]);
    const sorted = [...allLostPets].sort((a, b) => sortOrder === "recent" ? new Date(b.lastSeenDate) - new Date(a.lastSeenDate) : new Date(a.lastSeenDate) - new Date(b.lastSeenDate));
    setLostPets(sorted);
  };

  return (
    <div className="AllLostPages">
      <section className="hero-section"></section>
      <div className="hero-image-container">
        <img src={XamenaKatoikidia} alt="XamenaKatoikidia" className="main-image" />
        <div className="hero-filters-card">
          <div className="hero-filters-row">
            <div className="filter-field">
              <label>Περιοχή (Νομός)</label>
              <select value={region} className={region ? "filtered" : ""} onChange={(e) => setRegion(e.target.value)}>
                <option value="">Όλες οι περιοχές</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Φύλο</label>
              <select value={gender} className={gender ? "filtered" : ""} onChange={(e) => setGender(e.target.value)}>
                <option value="">Όλα</option>
                {GENDERS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Είδος</label>
              <select value={species} className={species ? "filtered" : ""} onChange={handleSpeciesChange}>
                <option value="">Όλα</option>
                {SPECIES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Ράτσα</label>
              <select value={breed} className={breed ? "filtered" : ""} onChange={(e) => setBreed(e.target.value)} disabled={!species}>
                <option value="">Όλες</option>
                {breedOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                {species && <option value="__OTHER__">Άλλο</option>}
              </select>
            </div>
          </div>
          <div className="hero-actions-wrapper">
            <div className="hero-buttons hero-buttons-center">
              <button type="button" className="secondary-btn" onClick={clearFilters}>
                Καθαρισμός φίλτρων
              </button>
              <button type="button" className="primary-btn" onClick={doFilters}>
                Εφαρμογή φίλτρων
              </button>
            </div>
          </div>
        </div>
      </div>
      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span> Χαμένα Κατοικίδια</span>
      </nav>

      <section className="results-section">
        <div className="results-header">
          <div className="results-left">
            <label>Ταξινόμηση</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="recent">Πιο πρόσφατα</option>
              <option value="oldest">Πιο παλιά</option>
            </select>
          </div>

          <div className="results-center">
            <h2>Αποτελέσματα ({lostPets.length})</h2>
          </div>

          <div className="results-right">
            <div className="hero-search">
              <input
                type="text"
                placeholder="Εισάγετε αριθμό μικροτσίπ..."
                value={chipSearch}
                maxLength={9}
                className="hero-input"
                onChange={(e) => setChipSearch(e.target.value)}
              />
              <button className="hero-button" aria-label="Αναζήτηση" onClick={handleSearch}>
                <FiSearch size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="lost-pets-grid">
          {lostPets.length === 0 ? (
            <p className="empty-message"></p>
          ) : (
            lostPets.map((p) => (
              <div className="lost-pet-card" key={p.id}>
                <Link to={`/all-lost-pets/PetProfile/${p.id}`}>
                  <PetDetails pet={p} mode={0} />
                </Link>
              </div>
            )))}
        </div>
      </section >
    </div >
  );
}