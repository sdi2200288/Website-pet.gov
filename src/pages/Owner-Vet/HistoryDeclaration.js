import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES,GENDERS,dogPopular,catPopular} from "../Utils/Util";

export default function HistoryDeclaration() {
  const navigate = useNavigate();
  // Filters
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChip, setSelectedChip] = useState("");

  // Data
  const [allPets, setAllPets] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [lossDeclarations, setLossDeclarations] = useState([]);
  const [adoptionDeclarations, setAdoptionDeclarations] = useState([]);
  const [fosterDeclarations, setFosterDeclarations] = useState([]);
  const [transferDeclarations, setTransferDeclarations] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [user] = useState(() =>JSON.parse(localStorage.getItem("user")));
  const isOwner = user?.role === "owner";
  const isVet = user?.role === "vet";

  /* ===================== PETS ===================== */
  // useEffect(() => {
  //   if (!user) return;

  //   fetch("http://localhost:3001/pets")
  //     .then(res => res.json())
  //     .then(data => setAllPets(data))
  //     .catch(() => setAllPets([]));
  // }, [user]);

   // Φόρτωση κατοικιδίων (διαφορετικά για owner και vet)
   useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const petsReq = fetch("http://localhost:3001/pets").then(r => r.json());

        if (isOwner) {
          const [pets, found, lost] = await Promise.all([
            petsReq,
            fetch(`http://localhost:3001/foundReports?ownerId=${user.id}`).then(r => r.json()),
            fetch(`http://localhost:3001/lostReports?ownerId=${user.id}`).then(r => r.json()),
          ]);

          setAllPets(pets);
          setFoundDeclarations(found);
          setLossDeclarations(lost);
        }

        if (isVet) {
          const [
            pets,
            found,
            lost,
            adoption,
            foster,
            transfer
          ] = await Promise.all([
            petsReq,
            fetch("http://localhost:3001/foundReports").then(r => r.json()),
            fetch("http://localhost:3001/lostReports").then(r => r.json()),
            fetch("http://localhost:3001/adoptionReports").then(r => r.json()),
            fetch("http://localhost:3001/fosterReports").then(r => r.json()),
            fetch("http://localhost:3001/transferReports").then(r => r.json()),
          ]);

          setAllPets(pets);
          setFoundDeclarations(found.filter(r => r.vetId === user.id));
          setLossDeclarations(lost.filter(r => r.vetId === user.id));
          setAdoptionDeclarations(adoption.filter(r => r.vetId === user.id));
          setFosterDeclarations(foster.filter(r => r.vetId === user.id));
          setTransferDeclarations(transfer.filter(r => r.vetId === user.id));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []); 

  // // Φόρτωση δηλώσεων (διαφορετικά για owner και vet) και auto-refresh
  // const fetchDeclarations = () => {
  //   if (!user) return;
    
  //   if (isOwner) {
  //     fetch(`http://localhost:3001/foundReports?ownerId=${user.id}`)
  //     .then(res => res.json())
  //     .then(data => setFoundDeclarations(data))
  //     .catch(() => setFoundDeclarations([]));

  //     fetch(`http://localhost:3001/lostReports?ownerId=${user.id}`)
  //     .then(res => res.json())
  //     .then(data => setLossDeclarations(data))
  //     .catch(() => setLossDeclarations([]));
  //   }
  //   // Για VET: βρες reports με vetId
  //   else if (isVet) {
  //     // Found reports με vetId
  //     fetch(`http://localhost:3001/foundReports`)
  //       .then(res => res.json())
  //       .then(data => {
  //         const vetFound = data.filter(report => report.vetId === user.id);
  //         setFoundDeclarations(vetFound);
  //       })
  //       .catch(() => setFoundDeclarations([]));

  //     // Lost reports με vetId
  //     fetch(`http://localhost:3001/lostReports`)
  //       .then(res => res.json())
  //       .then(data => {
  //         const vetLost = data.filter(report => report.vetId === user.id);
  //         setLossDeclarations(vetLost);
  //       })
  //       .catch(() => setLossDeclarations([]));

  //     // Adoption reports
  //     fetch(`http://localhost:3001/adoptionReports`)
  //       .then(res => res.json())
  //       .then(data => {
  //         const vetAdoption = data.filter(report => report.vetId === user.id);
  //         setAdoptionDeclarations(vetAdoption);
  //       })
  //       .catch(() => setAdoptionDeclarations([]));

  //     // Foster reports
  //     fetch(`http://localhost:3001/fosterReports`)
  //       .then(res => res.json())
  //       .then(data => {
  //         const vetFoster = data.filter(report => report.vetId === user.id);
  //         setFosterDeclarations(vetFoster);
  //       })
  //       .catch(() => setFosterDeclarations([]));

  //     // Transfer reports
  //     fetch(`http://localhost:3001/transferReports`)
  //       .then(res => res.json())
  //       .then(data => {
  //         const vetTransfer = data.filter(report => report.vetId === user.id);
  //         setTransferDeclarations(vetTransfer);
  //       })
  //       .catch(() => setTransferDeclarations([]));
  //   }
  // };

  // useEffect(() => {
  //   fetchDeclarations();
  // }, [user, isOwner, isVet]);

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

    if (isVet) {
      const extra = [
        { list: adoptionDeclarations, type: "adoption" },
        { list: fosterDeclarations, type: "foster" },
        { list: transferDeclarations, type: "transfer" },
      ];

      extra.forEach(({ list, type }) => {
        list.forEach(r => {
          const pet = findPetById(r.petId);
          combined.push({
            ...r,
            type,
            petName: pet?.name || "Άγνωστο",
            microchip: pet?.microchip || "Άγνωστο",
            species: pet?.species || "Άγνωστο",
            breed: pet?.breed || "Άγνωστο",
            gender: pet?.gender || "Άγνωστο",
            photo: pet?.photoUrl || "",
            region: pet?.region || "Άγνωστο",
          });
        });
      });
    }

    return combined;
  }, [
    lossDeclarations,
    foundDeclarations,
    adoptionDeclarations,
    fosterDeclarations,
    transferDeclarations,
    allPets,
    isVet
  ]);

  const breeds = selectedSpecies === "Σκύλος"? dogPopular: selectedSpecies === "Γάτα"? catPopular: [...dogPopular, ...catPopular];
//  const historyDeclarations = [
//   ...lossDeclarations.map(d => ({ ...d, type: "lost" })),
//   ...foundDeclarations.map(d => ({ ...d, type: "found" }))
// ];

  // const filteredDeclarations = selectedChip? historyDeclarations.filter((d) => String(d.microchip || "") === String(selectedChip)) : historyDeclarations;
   // Φιλτράρισμα ανά microchip
  const filteredDeclarations = historyDeclarations.filter((d) => {
    if (selectedChip && d.microchip !== selectedChip) return false;
    if (selectedSpecies && d.species !== selectedSpecies) return false;
    if (selectedBreed && d.breed !== selectedBreed) return false;
    if (selectedGender && d.gender !== selectedGender) return false;
    if (selectedRegion && d.region !== selectedRegion) return false;
    return true;
  });

  // Μοναδικά microchips για το dropdown
  const uniqueMicrochips = [...new Set(historyDeclarations.map(d => d.microchip))];

  // Συνάρτηση διαγραφής δήλωσης
  const handleDeleteDeclaration = async (id, type) => {
    if (!window.confirm("Σίγουρα διαγραφή;")) return;

    const map = {
      lost: "lostReports",
      found: "foundReports",
      adoption: "adoptionReports",
      foster: "fosterReports",
      transfer: "transferReports",
    };

    await fetch(`http://localhost:3001/${map[type]}/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Φόρτωση ιστορικού...</p>;
  }

  return (

    <div className="history-page">
      <h3 className="history-title">Ιστορικό Δηλώσεων {isVet && "(Κτηνίατρος)"}</h3>

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
        <PetDeclarationsList declarations={filteredDeclarations}  onDeleteDeclaration={handleDeleteDeclaration}  isVet={isVet}/>
      </div>
    </div>
  );
}
// import React, { useEffect, useState, useMemo } from "react";
// import "./HistoryDeclaration.css";
// import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
// import { REGIONS, SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";

// export default function HistoryDeclaration() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isVet = user?.role === "vet";

//   const [selectedSpecies, setSelectedSpecies] = useState("");
//   const [selectedBreed, setSelectedBreed] = useState("");
//   const [selectedGender, setSelectedGender] = useState("");
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [selectedChip, setSelectedChip] = useState("");
  

//   const [pets, setPets] = useState([]);
//   const [reports, setReports] = useState([]);

//   /* =========================
//      ΦΟΡΤΩΣΗ ΚΑΤΟΙΚΙΔΙΩΝ
//      ========================= */
//   useEffect(() => {
//     if (!user) return;

//     const url = isVet
//       ? "http://localhost:3001/pets"
//       : `http://localhost:3001/pets?ownerId=${user.id}`;

//     fetch(url)
//       .then(res => res.json())
//       .then(setPets)
//       .catch(() => setPets([]));
//   }, [user, isVet]);

//   /* =========================
//      ΦΟΡΤΩΣΗ ΟΛΩΝ ΤΩΝ ΔΗΛΩΣΕΩΝ
//      ========================= */
//   const fetchDeclarations = () => {
//     if (!user) return;

//     const query = isVet
//       ? `vetId=${user.id}`
//       : `ownerId=${user.id}`;

//     const endpoints = [
//       { type: "lost", url: "lostReports" },
//       { type: "found", url: "foundReports" },
//       { type: "adoption", url: "adoptionReports" },
//       { type: "foster", url: "fosterReports" },
//       { type: "transfer", url: "transferReports" }
//     ];

//      Promise.all(
//       endpoints.map(e => {
//         let query = "";
//         if (!isVet) {
//           // owners βλέπουν μόνο τις δικές τους δηλώσεις
//           if (["lost", "found"].includes(e.type)) {
//             query = `?ownerId=${user.id}`;
//           } else {
//             return Promise.resolve([]); // owners δεν βλέπουν adoption/foster/transfer
//           }
//         } else {
//           query = `?vetId=${user.id}`;
//         }

//         return fetch(`http://localhost:3001/${e.url}${query}`)
//           .then(res => res.json())
//           .then(data => data.map(r => ({ ...r, type: e.type })))
//           .catch(() => []);
//       })
//     ).then(results => setReports(results.flat()));
//   };

//   useEffect(() => {
//     fetchDeclarations();
//     // const interval = setInterval(fetchDeclarations, 10000);
//     // return () => clearInterval(interval);
//   }, [user, isVet]);

//   /* =========================
//      HELPERS
//      ========================= */
//   const findPetById = (petId) =>
//     pets.find(p => p.id === petId) || null;

//   /* =========================
//      ΕΝΩΜΕΝΟ ΙΣΤΟΡΙΚΟ
//      ========================= */
//   const historyDeclarations = useMemo(() => {
//     return reports.map(report => {
//       const pet = findPetById(report.petId);

//       return {
//         ...report,
//         microchip: pet?.microchip || "—",
//         species: pet?.species,
//         breed: pet?.breed,
//         gender: pet?.gender,
//         photo: pet?.photoUrl,
//         petName: pet?.name || "Άγνωστο",
//         region: report.region || pet?.region
//       };
//     });
//   }, [reports, pets]);

//   /* =========================
//      FILTERS
//      ========================= */
//   const breeds =
//     selectedSpecies === "Σκύλος"
//       ? dogPopular
//       : selectedSpecies === "Γάτα"
//       ? catPopular
//       : [...dogPopular, ...catPopular];

//   const filteredDeclarations = historyDeclarations.filter(d => {
//     if (selectedChip && String(d.microchip) !== String(selectedChip)) return false;
//     if (selectedSpecies && d.species !== selectedSpecies) return false;
//     if (selectedBreed && d.breed !== selectedBreed) return false;
//     if (selectedGender && d.gender !== selectedGender) return false;
//     if (selectedRegion && d.region !== selectedRegion) return false;
//     return true;
//   });

//   const uniqueMicrochips = useMemo(() => {
//     const chips = new Set();
//     historyDeclarations.forEach(d => {
//       if (d.microchip && d.microchip !== "—") chips.add(d.microchip);
//     });
//     return Array.from(chips);
//   }, [historyDeclarations]);

//   /* =========================
//      DELETE
//      ========================= */
//   const handleDeleteDeclaration = async (id, type) => {
//     if (!window.confirm("Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή τη δήλωση;")) return;

//     const endpointMap = {
//       lost: "lostReports",
//       found: "foundReports",
//       adoption: "adoptionReports",
//       foster: "fosterReports",
//       transfer: "transferReports"
//     };

//     try {
//       const res = await fetch(
//         `http://localhost:3001/${endpointMap[type]}/${id}`,
//         { method: "DELETE" }
//       );

//       if (!res.ok) throw new Error();

//       setReports(prev => prev.filter(r => r.id !== id));
//       alert("Η δήλωση διαγράφηκε επιτυχώς!");
//     } catch {
//       alert("Σφάλμα κατά τη διαγραφή της δήλωσης.");
//     }
//   };

//   /* =========================
//      RENDER
//      ========================= */
//   return (
//     <div className="history-page">
//       <h3 className="history-title">Ιστορικό Δηλώσεων</h3>

//       <div className="pets-filters history-filters-panel">

//         <div className="filter-item">
//           <span className="filter-label">Είδος:</span>
//           <select value={selectedSpecies} onChange={e => setSelectedSpecies(e.target.value)}>
//             <option value="">Όλα</option>
//             {SPECIES.map(sp => <option key={sp}>{sp}</option>)}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Ράτσα:</span>
//           <select value={selectedBreed} onChange={e => setSelectedBreed(e.target.value)}>
//             <option value="">Όλες</option>
//             {breeds.map(b => <option key={b}>{b}</option>)}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Φύλο:</span>
//           <select value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
//             <option value="">Όλα</option>
//             {GENDERS.map(g => <option key={g}>{g}</option>)}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Περιοχή:</span>
//           <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
//             <option value="">Όλες</option>
//             {REGIONS.map(r => <option key={r}>{r}</option>)}
//           </select>
//         </div>

//         <div className="filter-item history-chip-filter">
//           <span className="filter-label">Κατοικίδιο:</span>
//           <select value={selectedChip} onChange={e => setSelectedChip(e.target.value)}>
//             <option value="">Όλα</option>
//             {uniqueMicrochips.map(chip => {
//               const pet = pets.find(p => p.microchip === chip);
//               return (
//                 <option key={chip} value={chip}>
//                   {chip} - {pet?.name || "Χωρίς όνομα"} - {pet?.breed || "Άγνωστη ράτσα"}
//                 </option>
//               );
//             })}
//           </select>
//         </div>

//       </div>

//       <div className="history-list-panel">
//         <PetDeclarationsList
//           declarations={filteredDeclarations}
//           onDeleteDeclaration={handleDeleteDeclaration}
//         />
//       </div>
//     </div>
//   );
// }
