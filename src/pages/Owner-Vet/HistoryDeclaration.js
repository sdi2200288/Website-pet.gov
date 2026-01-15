import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";
import DeclarationModal from "../../pages/Owner-Vet/WatchDeclaration";

export default function HistoryDeclaration() {

  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [allPets, setAllPets] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [lossDeclarations, setLossDeclarations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const isOwner = user?.role === "owner";
  const isVet = user?.role === "vet";

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const petsReq = fetch("http://localhost:3001/pets").then((r) => r.json());

        const foundUrl = isOwner
          ? `http://localhost:3001/foundReports?ownerId=${user.id}`
          : `http://localhost:3001/foundReports?vetId=${user.id}`;

        const lostUrl = isOwner
          ? `http://localhost:3001/lostReports?ownerId=${user.id}`
          : `http://localhost:3001/lostReports?vetId=${user.id}`;

        const [pets, found, lost] = await Promise.all([
          petsReq,
          fetch(foundUrl).then((r) => r.json()),
          fetch(lostUrl).then((r) => r.json()),
        ]);

        const nameCache = new Map();
        const fetchPersonName = async (personId) => {
          if (!personId) return null;
          if (nameCache.has(personId)) return nameCache.get(personId);

          const tryFetch = async (url) => {
            const res = await fetch(url);
            if (!res.ok) return null;
            return res.json();
          };

          let person = await tryFetch(`http://localhost:3001/owners/${personId}`);
          if (!person || !person.id) {
            person = await tryFetch(`http://localhost:3001/vets/${personId}`);
          }

          const fullName = person
            ? [person.firstname, person.lastname].filter(Boolean).join(" ").trim()
            : "";
          const value = fullName || null;
          nameCache.set(personId, value);
          return value;
        };

        const ownerIds = new Set();
        (Array.isArray(found) ? found : []).forEach((r) => r.ownerId && ownerIds.add(r.ownerId));
        (Array.isArray(lost) ? lost : []).forEach((r) => r.ownerId && ownerIds.add(r.ownerId));

        const nameMap = {};
        await Promise.all(
          [...ownerIds].map(async (personId) => {
            nameMap[personId] = await fetchPersonName(personId);
          })
        );

        const foundWithNames = (Array.isArray(found) ? found : []).map((r) => ({
          ...r,
          ownerName: nameMap[r.ownerId] || null,
        }));
        const lostWithNames = (Array.isArray(lost) ? lost : []).map((r) => ({
          ...r,
          ownerName: nameMap[r.ownerId] || null,
        }));

        setAllPets(pets);
        setFoundDeclarations(foundWithNames);
        setLossDeclarations(lostWithNames);
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

  const labelForType = (t) => {
    if (t === "loss" || t === "lost") return "Δήλωση Απώλειας";
    if (t === "found") return "Δήλωση Εύρεσης";
    if (t === "foundNoAcc") return "Δήλωση Εύρεσης (χωρίς λογαριασμό)";
    if (t === "adoption") return "Δήλωση Υιοθεσίας";
    if (t === "foster") return "Δήλωση Φιλοξενίας";
    if (t === "transfer") return "Δήλωση Μεταβίβασης";
    return "Δήλωση";
  };

  const handlePrintDeclaration = (declaration) => {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 0);
  };

  const findPetById = (petId) => {
    return allPets.find((p) => p.id === petId) || null;
  };

  const historyDeclarations = useMemo(() => {
    const combined = [];

    lossDeclarations.forEach((r) => {
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

    foundDeclarations.forEach((r) => {
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


  const normalizeGender = (g) => {
    if (!g) return "";
    if (g === "male") return "Αρσενικό";
    if (g === "female") return "Θηλυκό";
    return g;
  };
  
  const breeds = selectedSpecies === "Σκύλος"
    ? dogPopular
    : selectedSpecies === "Γάτα"
      ? catPopular
      : [...dogPopular, ...catPopular];

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
    sortOrder,
  ]);



  const uniqueMicrochips = [...new Set(historyDeclarations.map((d) => d.microchip))];

  const handleDeleteDeclaration = async (declId, declType) => {
    if (!window.confirm("Είσαι σίγουρος/η ότι θέλεις να διαγράψεις τη δήλωση;")) return;

    const map = {
      lost: "lostReports",
      found: "foundReports",
    };

    await fetch(`http://localhost:3001/${map[declType]}/${declId}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Φόρτωση...</p>;
  }

  return (
    <div className="history-page">
      <h3 className="history-title">Ιστορικό Δηλώσεων</h3>

      <div className="pets-filters history-filters-panel">
        <div className="filter-item">
          <span className="filter-label">Είδος:</span>
          <select value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value)}>
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
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία έως:</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <div className="filter-item history-chip-filter">
          <span className="filter-label">Κατοικίδιο:</span>
          <select value={selectedChip} onChange={(e) => setSelectedChip(e.target.value)}>
            <option value="">Όλα</option>
            {uniqueMicrochips.map((microchip) => {
              const pet = allPets.find((p) => p.microchip === microchip);
              return (
                <option key={microchip} value={microchip}>
                  {microchip} - {pet?.name || "Άγνωστο"} - {pet?.breed || "Άγνωστο"}
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
          onPrintDeclaration={handlePrintDeclaration}
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
