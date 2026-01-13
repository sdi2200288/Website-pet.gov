import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";
import DeclarationModal from "../../pages/Owner-Vet/WatchDeclaration";


export default function HistoryDeclaration() {
  const navigate = useNavigate();
  // Filters
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("recent"); // recent | old
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Data
  const [allPets, setAllPets] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [lossDeclarations, setLossDeclarations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const isOwner = user?.role === "owner";
  const isVet = user?.role === "vet";

  // Φόρτωση κατοικιδίων (διαφορετικά για owner και vet)
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const petsReq = fetch("http://localhost:3001/pets").then(r => r.json());

        const foundUrl = isOwner
          ? `http://localhost:3001/foundReports?ownerId=${user.id}`
          : `http://localhost:3001/foundReports?vetId=${user.id}`;

        const lostUrl = isOwner
          ? `http://localhost:3001/lostReports?ownerId=${user.id}`
          : `http://localhost:3001/lostReports?vetId=${user.id}`;

        const [pets, found, lost] = await Promise.all([
          petsReq,
          fetch(foundUrl).then(r => r.json()),
          fetch(lostUrl).then(r => r.json()),
        ]);

        setAllPets(pets);
        setFoundDeclarations(found);
        setLossDeclarations(lost);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, isOwner, isVet]);

  const handleViewDeclaration = (declaration) => {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDeclaration(null);
    setIsModalOpen(false);
  };
  // Συνάρτηση για εύρεση κατοικίδιου με βάση το petId
  const findPetById = (petId) => {
    return allPets.find(p => p.id === petId) || null;
  };


  // Δημιουργία ιστορικού δηλώσεων με σωστά δεδομένα
  const historyDeclarations = useMemo(() => {
    const combined = [];

    lossDeclarations.forEach(r => {
      const pet = findPetById(r.petId);
      combined.push({
        ...r,
        type: "lost",
        petName: pet?.name || "Άγνωστο",
        microchip: pet?.microchip || "Άγνωστο",
        species: pet?.species || "Άγνωστο",
        breed: pet?.breed || "Άγνωστο",
        gender: pet?.gender || "Άγνωστο",
        photo: pet?.photoUrl || "",
        region: r.region || pet?.region || "Άγνωστο",
      });
    });

    foundDeclarations.forEach(r => {
      const pet = findPetById(r.petId);
      combined.push({
        ...r,
        type: "found",
        petName: pet?.name || "Άγνωστο",
        microchip: pet?.microchip || "Άγνωστο",
        species: pet?.species || "Άγνωστο",
        breed: pet?.breed || "Άγνωστο",
        gender: pet?.gender || "Άγνωστο",
        photo: pet?.photoUrl || "",
        region: r.region || pet?.region || "Άγνωστο",
      });
    });

    return combined;
  }, [lossDeclarations, foundDeclarations, allPets]);

  const breeds = selectedSpecies === "Σκύλος" ? dogPopular : selectedSpecies === "Γάτα" ? catPopular : [...dogPopular, ...catPopular];

  const filteredDeclarations = useMemo(() => {
    return historyDeclarations

      .filter((d) => {
        if (selectedChip && d.microchip !== selectedChip) return false;
        if (selectedSpecies && d.species !== selectedSpecies) return false;
        if (selectedBreed && d.breed !== selectedBreed) return false;
        if (selectedGender && normalizeGender(d.gender) !== selectedGender) return false;
        if (selectedRegion && !d.region?.includes(selectedRegion) && !selectedRegion.includes(d.region)) return false;
        if (dateFrom && new Date(d.date) < new Date(dateFrom)) return false;
        if (dateTo && new Date(d.date) > new Date(dateTo)) return false;

        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.createdAt || a.date);
        const db = new Date(b.createdAt || b.date);

        return sortOrder === "recent" ? db - da : da - db;
      });

  }, [
    historyDeclarations,
    selectedChip,
    selectedSpecies,
    selectedBreed,
    selectedGender,
    selectedRegion,
    dateFrom,
    dateTo,
    sortOrder
  ]);

  const normalizeGender = (g) => {
    if (!g) return "";
    if (g === "male") return "Αρσενικό";
    if (g === "female") return "Θηλυκό";
    return g;
  };


  // Μοναδικά microchips για το dropdown
  const uniqueMicrochips = [...new Set(historyDeclarations.map(d => d.microchip))];

  // Συνάρτηση διαγραφής δήλωσης
  const handleDeleteDeclaration = async (id, type) => {
    if (!window.confirm("Σίγουρα διαγραφή;")) return;

    const map = {
      lost: "lostReports",
      found: "foundReports",
    };

    await fetch(`http://localhost:3001/${map[type]}/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Φόρτωση ιστορικού...</p>;
  }

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
          <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
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
          {/* <input type="date" /> */}
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία έως:</span>
          {/* <input type="date" /> */}
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>

        <div className="filter-item history-chip-filter">
          <span className="filter-label">Κατοικίδιο:</span>
          <select value={selectedChip} onChange={(e) => setSelectedChip(e.target.value)}>
            <option value="">Όλα</option>
            {uniqueMicrochips.map(microchip => {
              const pet = allPets.find(p => p.microchip === microchip);
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
        <PetDeclarationsList
          declarations={filteredDeclarations}
          onDeleteDeclaration={handleDeleteDeclaration}
          onViewDeclaration={handleViewDeclaration} 
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
                />
        <DeclarationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          declaration={selectedDeclaration}
        />
      </div>
    </div>
  );
}
