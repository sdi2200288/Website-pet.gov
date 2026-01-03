import React, { useEffect, useState } from "react";
import "./AllLostPets.css";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import XamenaKatoikidia from "../../images/XamenaKatoikidia.png";
import PetDetails from "../../components/Pet/Pet";
import { SPECIES, REGIONS, dogPopular, catPopular } from "../Utils/Util";


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

  const handleSpeciesChange = (e) => {
    const value = e.target.value;
    setSpecies(value);
    setBreed("");
    if (value === "Σκύλος") { setBreedOptions(dogPopular); }
    else if (value === "Γάτα") { setBreedOptions(catPopular); }
    else { setBreedOptions([]); }
  };

  const doFilters = () => {
    let filtered = [...allLostPets];
    if (region) filtered = filtered.filter((p) => p.region === region);
    if (species) filtered = filtered.filter((p) => p.species === species);
    if (breed) filtered = filtered.filter((p) => p.breed === breed);
    if (gender) filtered = filtered.filter((p) => p.gender === gender);
    if (chipSearch) filtered = filtered.filter((p) => p.microchipNumber.includes(chipSearch));
    if (sortOrder === "recent") { filtered.sort((a, b) => new Date(b.lostDate) - new Date(a.lostDate)); }
    else { filtered.sort((a, b) => new Date(a.lostDate) - new Date(b.lostDate)); }
    setAllLostPets(filtered);
  };

  const clearFilters = () => {
    setRegion("");
    setSpecies("");
    setBreed("");
    setGender("");
    setChipSearch("");
    setSortOrder("recent");
    setBreedOptions([]);
    setLostPets(allLostPets);
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
              <select value={region} onChange={(e) => setRegion(e.target.value)}> 
                <option value="">Όλες οι περιοχές</option> 
                {REGIONS.map((r) => ( 
                  <option key={r} value={r}>{r}</option> 
                ))}  
              </select>  
            </div>  
            <div className="filter-field">
              <label>Είδος</label>
              <select value={species} onChange={handleSpeciesChange}>
                <option value="">Όλα</option>
                {SPECIES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Φύλο</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Όλα</option>
                <option value="male">Αρσενικό</option>
                <option value="female">Θηλυκό</option>
                <option value="other">Άλλο</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Ράτσα</label>
              <select value={breed} onChange={(e) => setBreed(e.target.value)} disabled={!species}>
                <option value="">Όλες</option>
                {breedOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                {species && <option value="other">Άλλο</option>}
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
              <option value="oldest">Παλαιότερα</option>
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
                className="hero-input"
                onChange={(e) => setChipSearch(e.target.value)}
              />
              <button className="hero-button" aria-label="Αναζήτηση">
                <FiSearch size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="lost-pets-grid">
          {lostPets.length === 0 ? (
            <p className="empty-message">Δεν υπάρχουν δηλωμένα χαμένα κατοικίδια.</p>
          ) : (
            lostPets.map((p) => (
              <div className="lost-pet-card" key={p.id}>
                <Link to={`/PetProfile/${p.id}`} >
                  <PetDetails pet={p} mode={0} />
                </Link>
              </div>
            )))}
        </div>
      </section >
    </div >
  );
}