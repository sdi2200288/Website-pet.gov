import React, { useState } from "react";
import "./AllLostPets.css";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import XamenaKatoikidia from "../../images/XamenaKatoikidia.png";
import PetDetails from "../../components/Pet/Pet";
import { REGIONS, dogPopular, catPopular } from "../Utils/Util";


export default function AllLostPets() {
  const pets = [1, 2, 3, 4];
  const [species, setSpecies] = useState("");
  const [breedOptions, setBreedOptions] = useState([]);

  const handleSpeciesChange = (e) => {
    const value = e.target.value;
    setSpecies(value);

    if (value === "Σκύλος") {
      setBreedOptions(dogPopular);
    } else if (value === "Γάτα") {
      setBreedOptions(catPopular);
    } else {
      setBreedOptions([]);
    }
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
              <select>
                <option>Όλες οι περιοχές</option>
                {REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Είδος</label>
              <select value={species} onChange={handleSpeciesChange}>
                <option value="">Όλα</option>
                <option value="Σκύλος">Σκύλος</option>
                <option value="Γάτα">Γάτα</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Φύλο</label>
              <select>
                <option>Όλα</option>
                <option>Αρσενικό</option>
                <option>Θηλυκό</option>
                <option>Άλλο</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Ράτσα</label>
              <select disabled={!species}>
                <option>Όλες</option>
                {breedOptions.map((b) => (
                  <option key={b}>{b}</option>
                ))}
                {species && <option value="other">Άλλο</option>}
              </select>
            </div>
          </div>
          <div className="hero-actions-wrapper">
            <div className="hero-buttons hero-buttons-center">
              <button type="button" className="secondary-btn">
                Καθαρισμός φίλτρων
              </button>
              <button type="button" className="primary-btn">
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
            <select>
              <option>Πιο πρόσφατα</option>
              <option>Παλαιότερα</option>
            </select>
          </div>

          <div className="results-center">
            <h2>Αποτελέσματα ({pets.length})</h2>
          </div>

          <div className="results-right">
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
        </div>

        <div className="lost-pets-grid">
          {pets.map((p) => (
            <div className="lost-pet-card" key={p}>
              <Link to="/PetProfile">
              <PetDetails mode={0} />
            </Link>
            </div>
          ))}
    </div>
      </section >
    </div >
  );
}