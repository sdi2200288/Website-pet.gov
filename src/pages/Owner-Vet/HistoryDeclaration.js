import React, { useEffect, useState, useMemo } from "react";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES,GENDERS,dogPopular,catPopular} from "../Utils/Util";

export default function HistoryDeclaration() {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChip, setSelectedChip] = useState(""); 
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [lossDeclarations, setLossDeclarations] = useState([]);
  const[pets, setPets]= useState([]);
 
  const user = JSON.parse(localStorage.getItem("user"));

   // Φόρτωση κατοικιδίων του χρήστη
  useEffect(() => {
    if (!user) return;
    
    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setPets(data))
      .catch(() => setPets([]));
  }, [user]);

  // Φόρτωση δηλώσεων και auto-refresh
  const fetchDeclarations = () => {
     if (!user) return;

    fetch(`http://localhost:3001/foundReports?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setFoundDeclarations(data))
      .catch(() => setFoundDeclarations([]));

    fetch(`http://localhost:3001/lostReports?ownerId=${user.id}`)
      .then(res => res.json())
      .then(data => setLossDeclarations(data))
      .catch(() => setLossDeclarations([]));
  };

  useEffect(() => {
    fetchDeclarations();

    // Προαιρετικά: κάθε 10 δευτ. auto-refresh
    const interval = setInterval(fetchDeclarations, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Συνάρτηση για εύρεση κατοικίδιου με βάση το petId
  const findPetById = (petId) => {
    return pets.find(pet => pet.id === petId) || null;
  };

  // Δημιουργία ιστορικού δηλώσεων με σωστά δεδομένα
  const historyDeclarations = useMemo(() => {
    const combined = [];
    
    // Χαμένες δηλώσεις
    lossDeclarations.forEach(report => {
      const pet = findPetById(report.petId);
      if (pet) {
        combined.push({
          ...report,
          type: "lost",
          microchip: pet.microchip,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          photo: pet.photoUrl,
          petName: pet.name,
          // Χρησιμοποιούμε την περιοχή από το report, όχι από το pet
          region: report.region || pet.region
        });
      }
    });
    
    // Βρεμένες δηλώσεις
    foundDeclarations.forEach(report => {
      const pet = findPetById(report.petId);
      if (pet) {
        combined.push({
          ...report,
          type: "found",
          microchip: pet.microchip,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          photo: pet.photoUrl,
          petName: pet.name,
          region: report.region || pet.region
        });
      }
    });
    
    return combined;
  }, [lossDeclarations, foundDeclarations, pets]);

  const breeds = selectedSpecies === "Σκύλος"? dogPopular: selectedSpecies === "Γάτα"? catPopular: [...dogPopular, ...catPopular];
//  const historyDeclarations = [
//   ...lossDeclarations.map(d => ({ ...d, type: "lost" })),
//   ...foundDeclarations.map(d => ({ ...d, type: "found" }))
// ];

  // const filteredDeclarations = selectedChip? historyDeclarations.filter((d) => String(d.microchip || "") === String(selectedChip)) : historyDeclarations;
   // Φιλτράρισμα ανά microchip
  const filteredDeclarations = historyDeclarations.filter((d) => {
    if (selectedChip && String(d.microchip || "") !== String(selectedChip)) return false;
    if (selectedSpecies && d.species !== selectedSpecies) return false;
    if (selectedBreed && d.breed !== selectedBreed) return false;
    if (selectedGender && d.gender !== selectedGender) return false;
    if (selectedRegion && d.region !== selectedRegion) return false;
    return true;
  });

  // Μοναδικά microchips για το dropdown
  const uniqueMicrochips = useMemo(() => {
    const chips = new Set();
    historyDeclarations.forEach(d => {
      if (d.microchip) chips.add(d.microchip);
    });
    return Array.from(chips);
  }, [historyDeclarations]);

   // Συνάρτηση διαγραφής δήλωσης
  const handleDeleteDeclaration = async (id, type) => {
    if (!window.confirm("Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή τη δήλωση;")) {
      return;
    }

    try {
      const endpoint = type === "lost" ? "lostReports" : "foundReports";
      const response = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Ενημέρωση κατάστασης
        if (type === "lost") {
          setLossDeclarations(prev => prev.filter(item => item.id !== id));
        } else {
          setFoundDeclarations(prev => prev.filter(item => item.id !== id));
        }
        alert("Η δήλωση διαγράφηκε επιτυχώς!");
      } else {
        alert("Σφάλμα κατά τη διαγραφή της δήλωσης.");
      }
    } catch (error) {
      console.error("Σφάλμα:", error);
      alert("Σφάλμα κατά τη διαγραφή της δήλωσης.");
    }
  };

  return (

    <div className="history-page">
      <h3 className="history-title">Ιστορικό Δηλώσεων</h3>

      <div className="pets-filters history-filters-panel">
        <div className="filter-item">
          <span className="filter-label">Είδος:</span>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
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
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
            <option value="">Όλες</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Φύλο:</span>
          `<select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
            <option value="">Όλα</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Περιοχή:</span>
           <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">Όλες</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία από:</span>
          <input type="date" />
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία έως:</span>
          <input type="date" />
        </div>

        <div className="filter-item history-chip-filter">
          <span className="filter-label">Κατοικίδιο:</span>
          <select value={selectedChip} onChange={(e) => setSelectedChip(e.target.value)}>
            <option value="">Όλα</option>
            {uniqueMicrochips.map(microchip => {
              const pet = pets.find(p => p.microchip === microchip);
              return (
                <option key={microchip} value={microchip}>
                  {microchip} - {pet?.name || "Χωρίς όνομα"} - {pet?.breed || "Άγνωστη ράτσα"}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="history-list-panel">
        <PetDeclarationsList declarations={filteredDeclarations}  onDeleteDeclaration={handleDeleteDeclaration}/>
      </div>
    </div>
  );
}
