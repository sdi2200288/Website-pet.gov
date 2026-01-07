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
          fetch(`http://localhost:3001/foundReports?vetId=${user.id}`).then(r => r.json()),
          fetch(`http://localhost:3001/lostReports?vetId=${user.id}`).then(r => r.json()),
          fetch(`http://localhost:3001/adoptionReports?vetId=${user.id}`).then(r => r.json()),
          fetch(`http://localhost:3001/fosterReports?vetId=${user.id}`).then(r => r.json()),
          fetch(`http://localhost:3001/transferReports?vetId=${user.id}`).then(r => r.json()),
        ]);

        setAllPets(pets);
        setFoundDeclarations(found);
        setLossDeclarations(lost);
        setAdoptionDeclarations(adoption);
        setFosterDeclarations(foster);
        setTransferDeclarations(transfer);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAll();
}, []);

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
//   // Filters
//   const [selectedSpecies, setSelectedSpecies] = useState("");
//   const [selectedBreed, setSelectedBreed] = useState("");
//   const [selectedGender, setSelectedGender] = useState("");
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [selectedChip, setSelectedChip] = useState("");

//   // Data
//   const [allPets, setAllPets] = useState([]);
//   const [foundDeclarations, setFoundDeclarations] = useState([]);
//   const [lossDeclarations, setLossDeclarations] = useState([]);
//   const [adoptionDeclarations, setAdoptionDeclarations] = useState([]);
//   const [fosterDeclarations, setFosterDeclarations] = useState([]);
//   const [transferDeclarations, setTransferDeclarations] = useState([]);
  
//   const [loading, setLoading] = useState(true);

//   const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
//   const isOwner = user?.role === "owner";
//   const isVet = user?.role === "vet";

//   // Χάρτης για gender αντιστοίχιση
//   const mapGender = (gender) => {
//     if (gender === "male") return "Αρσενικό";
//     if (gender === "female") return "Θηλυκό";
//     return gender;
//   };

//   // Συνάρτηση για εύρεση κατοικίδιου
//   const findPetById = (petId) => {
//     return allPets.find(p => p.id === String(petId)) || null;
//   };

//   // Βοηθητική συνάρτηση για εύρεση κατοικίδιων ανά ιδιοκτήτη
//   const findPetsByOwner = (ownerId) => {
//     return allPets.filter(pet => pet.ownerId === ownerId);
//   };

//   // Φόρτωση δεδομένων
//   useEffect(() => {
//     if (!user) return;

//     const fetchAll = async () => {
//       try {
//         // Φόρτωση όλων των κατοικιδίων
//         const pets = await fetch("http://localhost:3001/pets").then(r => r.json());
//         setAllPets(pets);

//         if (isOwner) {
//           // Ιδιοκτήτης: βρες τα κατοικίδιά του
//           const ownerPets = findPetsByOwner(user.id);
//           const ownerPetIds = ownerPets.map(p => p.id);
          
//           // Φόρτωση lostReports για τα κατοικίδιά του
//           const lostRes = await fetch("http://localhost:3001/lostReports").then(r => r.json());
//           const ownerLost = lostRes.filter(report => 
//             ownerPetIds.includes(String(report.petId)) || report.ownerId === user.id
//           );
//           setLossDeclarations(ownerLost);
          
//           // Φόρτωση foundReports για τα κατοικίδιά του
//           const foundRes = await fetch("http://localhost:3001/foundReports").then(r => r.json());
//           const ownerFound = foundRes.filter(report => 
//             ownerPetIds.includes(String(report.petId)) || report.ownerId === user.id
//           );
//           setFoundDeclarations(ownerFound);
//         }

//         if (isVet) {
//           // Κτηνίατρος: βρες ΟΛΕΣ τις δηλώσεις που ΕΚΑΝΕ ο ίδιος
          
//           // Φόρτωση lostReports που έκανε ο κτηνίατρος
//           const lostRes = await fetch(`http://localhost:3001/lostReports?vetId=${user.id}`).then(r => r.json());
//           setLossDeclarations(lostRes);
          
//           // Φόρτωση foundReports που έκανε ο κτηνίατρος
//           const foundRes = await fetch(`http://localhost:3001/foundReports?vetId=${user.id}`).then(r => r.json());
//           setFoundDeclarations(foundRes);
          
//           // Φόρτωση adoptionReports που έκανε ο κτηνίατρος
//           const adoptionRes = await fetch(`http://localhost:3001/adoptionReports?vetId=${user.id}`).then(r => r.json());
//           setAdoptionDeclarations(adoptionRes);
          
//           // Φόρτωση fosterReports που έκανε ο κτηνίατρος
//           const fosterRes = await fetch(`http://localhost:3001/fosterReports?vetId=${user.id}`).then(r => r.json());
//           setFosterDeclarations(fosterRes);
          
//           // Φόρτωση transferReports που έκανε ο κτηνίατρος
//           const transferRes = await fetch(`http://localhost:3001/transferReports?vetId=${user.id}`).then(r => r.json());
//           setTransferDeclarations(transferRes);
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [user, isOwner, isVet]);

//   // Δημιουργία ιστορικού δηλώσεων
//   const historyDeclarations = useMemo(() => {
//     const combined = [];

//     // Lost declarations
//     lossDeclarations.forEach(r => {
//       const pet = findPetById(r.petId);
//       combined.push({
//         ...r,
//         type: "lost",
//         displayDate: r.date || r.createdAt,
//         petName: pet?.name || "Άγνωστο",
//         microchip: pet?.microchip || r.microchip || "Άγνωστο",
//         species: pet?.species || "Άγνωστο",
//         breed: pet?.breed || "Άγνωστο",
//         gender: mapGender(pet?.gender) || "Άγνωστο",
//         photo: pet?.photoUrl || "",
//         region: r.region || pet?.region || "Άγνωστο",
//         address: r.address || pet?.lastSeenAddress || "",
//       });
//     });

//     // Found declarations
//     foundDeclarations.forEach(r => {
//       const pet = findPetById(r.petId);
//       combined.push({
//         ...r,
//         type: "found",
//         displayDate: r.date || r.createdAt,
//         petName: pet?.name || "Άγνωστο",
//         microchip: pet?.microchip || "Άγνωστο",
//         species: pet?.species || "Άγνωστο",
//         breed: pet?.breed || "Άγνωστο",
//         gender: mapGender(pet?.gender) || "Άγνωστο",
//         photo: pet?.photoUrl || "",
//         region: r.region || pet?.region || "Άγνωστο",
//         address: r.address || "",
//       });
//     });

//     if (isVet) {
//       // Adoption declarations
//       adoptionDeclarations.forEach(r => {
//         const pet = findPetById(r.petId);
//         combined.push({
//           ...r,
//           type: "adoption",
//           displayDate: r.createdAt,
//           petName: pet?.name || "Άγνωστο",
//           microchip: pet?.microchip || r.microchip || "Άγνωστο",
//           species: pet?.species || "Άγνωστο",
//           breed: pet?.breed || "Άγνωστο",
//           gender: mapGender(pet?.gender) || "Άγνωστο",
//           photo: pet?.photoUrl || "",
//           region: pet?.region || "Άγνωστο",
//           address: "", // Δεν υπάρχει για adoption
//         });
//       });

//       // Foster declarations
//       fosterDeclarations.forEach(r => {
//         const pet = findPetById(r.petId);
//         combined.push({
//           ...r,
//           type: "foster",
//           displayDate: r.startDate || r.createdAt,
//           petName: pet?.name || "Άγνωστο",
//           microchip: pet?.microchip || r.microchip || "Άγνωστο",
//           species: pet?.species || "Άγνωστο",
//           breed: pet?.breed || "Άγνωστο",
//           gender: mapGender(pet?.gender) || "Άγνωστο",
//           photo: pet?.photoUrl || "",
//           region: pet?.region || "Άγνωστο",
//           address: "", // Δεν υπάρχει για foster
//         });
//       });

//       // Transfer declarations
//       transferDeclarations.forEach(r => {
//         const pet = findPetById(r.petId);
//         combined.push({
//           ...r,
//           type: "transfer",
//           displayDate: r.transferDate || r.createdAt,
//           petName: pet?.name || "Άγνωστο",
//           microchip: pet?.microchip || r.microchip || "Άγνωστο",
//           species: pet?.species || "Άγνωστο",
//           breed: pet?.breed || "Άγνωστο",
//           gender: mapGender(pet?.gender) || "Άγνωστο",
//           photo: pet?.photoUrl || "",
//           region: pet?.region || "Άγνωστο",
//           address: "", // Δεν υπάρχει για transfer
//         });
//       });
//     }

//     // Ταξινόμηση από νεότερο προς παλαιότερο
//     return combined.sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));
//   }, [
//     lossDeclarations,
//     foundDeclarations,
//     adoptionDeclarations,
//     fosterDeclarations,
//     transferDeclarations,
//     allPets,
//     isVet
//   ]);

//   const breeds = selectedSpecies === "Σκύλος" 
//     ? dogPopular 
//     : selectedSpecies === "Γάτα" 
//     ? catPopular 
//     : [...dogPopular, ...catPopular];

//   // Φιλτράρισμα δηλώσεων
//   const filteredDeclarations = historyDeclarations.filter((d) => {
//     if (selectedChip && String(d.microchip) !== String(selectedChip)) return false;
//     if (selectedSpecies && d.species !== selectedSpecies) return false;
//     if (selectedBreed && d.breed !== selectedBreed) return false;
//     if (selectedGender && d.gender !== selectedGender) return false;
//     if (selectedRegion && d.region !== selectedRegion) return false;
//     return true;
//   });

//   // Μοναδικά microchips για το dropdown
//   const uniqueMicrochips = [...new Set(
//     historyDeclarations
//       .map(d => d.microchip)
//       .filter(m => m && m !== "Άγνωστο")
//   )];

//   // Συνάρτηση διαγραφής δήλωσης
//   const handleDeleteDeclaration = async (id, type) => {
//     if (!window.confirm("Σίγουρα θέλετε να διαγράψετε αυτή τη δήλωση;")) return;

//     const endpointMap = {
//       lost: "lostReports",
//       found: "foundReports",
//       adoption: "adoptionReports",
//       foster: "fosterReports",
//       transfer: "transferReports",
//     };

//     try {
//       await fetch(`http://localhost:3001/${endpointMap[type]}/${id}`, {
//         method: "DELETE"
//       });
//       window.location.reload();
//     } catch (error) {
//       console.error("Error deleting declaration:", error);
//       alert("Σφάλμα κατά τη διαγραφή της δήλωσης");
//     }
//   };

//   if (loading) {
//     return <div className="loading-container">Φόρτωση ιστορικού...</div>;
//   }

//   if (!user) {
//     return <div className="error-container">Πρέπει να συνδεθείτε για να δείτε το ιστορικό</div>;
//   }

//   return (
//     <div className="history-page">
//       <h3 className="history-title">
//         Ιστορικό Δηλώσεων {isVet ? "(Κτηνίατρος)" : "(Ιδιοκτήτης)"}
//       </h3>

//       {/* Φίλτρα */}
//       <div className="pets-filters history-filters-panel">
//         <div className="filter-item">
//           <span className="filter-label">Είδος:</span>
//           <select
//             value={selectedSpecies}
//             onChange={(e) => setSelectedSpecies(e.target.value)}
//           >
//             <option value="">Όλα</option>
//             {SPECIES.map((sp) => (
//               <option key={sp} value={sp}>{sp}</option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Ράτσα:</span>
//           <select 
//             value={selectedBreed} 
//             onChange={(e) => setSelectedBreed(e.target.value)}
//             disabled={!selectedSpecies && !breeds.length}
//           >
//             <option value="">Όλες</option>
//             {breeds.map((b) => (
//               <option key={b} value={b}>{b}</option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Φύλο:</span>
//           <select 
//             value={selectedGender} 
//             onChange={(e) => setSelectedGender(e.target.value)}
//           >
//             <option value="">Όλα</option>
//             {GENDERS.map((g) => (
//               <option key={g} value={g}>{g}</option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Περιοχή:</span>
//           <select 
//             value={selectedRegion} 
//             onChange={(e) => setSelectedRegion(e.target.value)}
//           >
//             <option value="">Όλες</option>
//             {REGIONS.map((r) => (
//               <option key={r} value={r}>{r}</option>
//             ))}
//           </select>
//         </div>

//         <div className="filter-item">
//           <span className="filter-label">Κατοικίδιο:</span>
//           <select 
//             value={selectedChip} 
//             onChange={(e) => setSelectedChip(e.target.value)}
//           >
//             <option value="">Όλα</option>
//             {uniqueMicrochips.map(microchip => {
//               const pet = allPets.find(p => p.microchip === microchip);
//               return (
//                 <option key={microchip} value={microchip}>
//                   {microchip} - {pet?.name || "Άγνωστο όνομα"}
//                 </option>
//               );
//             })}
//           </select>
//         </div>
//       </div>

//       {/* Λίστα δηλώσεων */}
//       <div className="history-list-panel">
//         <PetDeclarationsList 
//           declarations={filteredDeclarations} 
//           onDeleteDeclaration={handleDeleteDeclaration} 
//           isVet={isVet}
//         />
//       </div>
//     </div>
//   );
// }