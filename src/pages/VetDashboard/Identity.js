import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import PetDetails from "../../components/Pet/Pet";
// import dog from "../../images/lostPet1.png";
import { SPECIES,dogPopular,catPopular } from "../Utils/Util";

import "./Identity.css";

export default function Identity() {
  // const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = φόρμα, 2 = προεπισκόπηση
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petInfo, setPetInfo] = useState({
    microchip: "",
    name: "",
    species: "",
    breed: "",
    birthdate: "", // Αλλαγή από 'age' σε 'birthdate'
    gender: "",
    forAdoption: "Όχι",
  });

  const [ownerInfo, setOwnerInfo] = useState({
    afm: "",
    email: "",
    phone: "",
  });
  
  const getBreedsBySpecies = () => {
    if (petInfo.species === "Σκύλος") return dogPopular;
    if (petInfo.species === "Γάτα") return catPopular;
    return [];
  };

  const goToStep = (targetStep) => {
    const vet = JSON.parse(localStorage.getItem("user"));

    if (!vet || vet.role !== "vet") {
      window.location.href = "/login";
      return;
    }

    setStep(targetStep);
  };

  // Επιβεβαίωση υποχρεωτικών πεδίων
  const validateForm = () => {
    if (!/^\d{9}$/.test(petInfo.microchip)) {
      alert("Το πεδίο Microchip είναι υποχρεωτικό");
      return false;
    }
    if (!petInfo.name.trim()) {
      alert("Το πεδίο Όνομα είναι υποχρεωτικό");
      return false;
    }
    if (!petInfo.species.trim()) {
      alert("Το πεδίο Είδος είναι υποχρεωτικό");
      return false;
    }
    if (!petInfo.gender) {
      alert("Το πεδίο Φύλο είναι υποχρεωτικό");
      return false;
    }
    if (petInfo.forAdoption === "Όχι") {
      if (!/^\d{9}$/.test(ownerInfo.afm)) {
        alert("Το ΑΦΜ του ιδιοκτήτη είναι υποχρεωτικό");
        return false;
      }
      if (!ownerInfo.email.trim()) {
        alert("Το Email του ιδιοκτήτη είναι υποχρεωτικό");
        return false;
      }
      if (!ownerInfo.phone.trim()) {
        alert("Το Τηλέφωνο του ιδιοκτήτη είναι υποχρεωτικό");
        return false;
      }
    }
    return true;
  };

  // Συνάρτηση για υποβολή στη βάση δεδομένων
  const submitPet = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const vet = JSON.parse(localStorage.getItem("user"));

    if (!vet) {
      alert("Πρέπει να είστε συνδεδεμένος ως κτηνίατρος");
      setIsSubmitting(false);
      return;
    }

    // Δημιουργία νέου ID για το κατοικίδιο
    const petId = "vp" + Math.random().toString(36).substr(2, 9);

    // Δημιουργία owner αν δεν υπάρχει
    let ownerId = null;
    if (petInfo.forAdoption === "Όχι" && ownerInfo.afm) {
      try {
        // Έλεγχος αν υπάρχει ήδη ο owner με αυτό το ΑΦΜ
        const response = await fetch(`http://localhost:3001/owners?afm=${ownerInfo.afm}`);
        const existingOwners = await response.json();
        
        if (existingOwners.length > 0) {
          ownerId = existingOwners[0].id;
        } else {
          // Δημιουργία νέου owner
          const newOwnerId = "own" + Math.random().toString(36).substr(2, 6);
          const newOwner = {
            id: newOwnerId,
            firstname: "",
            lastname: "",
            afm: ownerInfo.afm,
            gender: "",
            address: "",
            birthdate: "",
            phone: ownerInfo.phone,
            email: ownerInfo.email,
            password: ""
          };
          
          await fetch("http://localhost:3001/owners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOwner)
          });
          
          ownerId = newOwnerId;
        }
      } catch (err) {
        console.error("Error checking/creating owner:", err);
        alert("Σφάλμα κατά τη δημιουργία/εύρεση ιδιοκτήτη");
        setIsSubmitting(false);
        return;
      }
    }

    // Δημιουργία του νέου pet
    const newPet = {
      id: petId,
      ownerId: ownerId,
      name: petInfo.name,
      species: petInfo.species,
      breed: petInfo.breed,
      gender: petInfo.gender === "Αρσενικό" ? "male" : "female",
      microchip: petInfo.microchip,
      birthdate: petInfo.birthdate || null,
      photoUrl: "",
      region: "",
      status: petInfo.forAdoption === "Ναι" ? "adoption" : "owned",
      notes: "",
    };

    try {
      console.log("Sending pet data:", newPet);
      
      const response = await fetch("http://localhost:3001/pets", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newPet),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Success:", result);

      alert("Το κατοικίδιο καταχωρήθηκε επιτυχώς!");

      // Επαναφορά φόρμας
      setStep(0);
      setPetInfo({
        microchip: "",
        name: "",
        species: "",
        breed: "",
        birthdate: "",
        gender: "",
        forAdoption: "Όχι",
      });
      setOwnerInfo({ afm: "", email: "", phone: "" });

    } catch (err) {
      console.error("SUBMIT ERROR:", err.message);
      alert(`Σφάλμα κατά την αποστολή: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="identity">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
            <div className="stepper">
                <div className="step step-zero">
                <div className="circle">1</div>
                <span>
                    Στο πρώτο βήμα θα συμπληρώσετε τα στοιχεία του κατοικιδίου (microchip, όνομα, είδος, ράτσα, ημερομηνία γέννησης, φύλο, φωτογραφία). Αν δεν είναι προς υιοθεσία, θα συμπληρώσετε ΑΦΜ, email και τηλέφωνο ιδιοκτήτη.
                </span>
                </div>
                <div className="line" />
                
                <div className="step step-zero">
                <div className="circle">2</div>
                <span>
                    Στο δεύτερο βήμα θα δείτε την προεπισκόπηση της καταγραφής και θα μπορείτε να την υποβάλετε. Μετά την υποβολή θα δείτε το βιβλιάριο με την επιλογή εκτύπωσης.
                </span>
                </div>
            </div>

            <button className="next-btn" onClick={() => goToStep(1)}>
                Συνέχεια
            </button>
        </>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <div className="stepper">
            <div className="step active">
              <div className="circle">1</div>
              <div className="step-title">Δημιουργία προφίλ κατοικιδίου</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προεπισκόπηση και καταχώρηση</div>
            </div>
          </div>
        {/* <div className="booklet-container"> */}
            <div className="found-form">
            <h3>Εισαγωγή Στοιχείων</h3>

            <label>
              Microchip *
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={petInfo.microchip}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPetInfo({ ...petInfo, microchip: value });
                }}
                required
              />

            </label>

            <label>
              Όνομα *
              <input
                type="text"
                value={petInfo.name}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Είδος *
              <select
                value={petInfo.species}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, species: e.target.value, breed: "" })
                }
                required
              >
                <option value="">Επιλογή</option>
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

            </label>

            <label>
              Ράτσα
              {petInfo.species === "Άλλο" || petInfo.species === "" ? (
                <input
                  type="text"
                  placeholder="Εισάγετε ράτσα"
                  value={petInfo.breed}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, breed: e.target.value })
                  }
                />
              ) : (
                <select
                  value={petInfo.breed}
                  onChange={(e) =>
                    setPetInfo({ ...petInfo, breed: e.target.value })
                  }
                >
                  <option value="">Επιλογή ράτσας</option>
                  {getBreedsBySpecies().map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              )}
              </label>



            <label>
              Φύλο *
              <select
                value={petInfo.gender}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, gender: e.target.value })
                }
                required
              >
                <option value="">Επιλογή</option>
                <option value="Αρσενικό">Αρσενικό</option>
                <option value="Θηλυκό">Θηλυκό</option>
              </select>
            </label>

            <label>
              Ημερομηνία Γέννησης
              <input
                type="date"
                value={petInfo.birthdate}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, birthdate: e.target.value })
                }
              />
            </label>

            <label>
              Προς Υιοθεσία
              <select
                value={petInfo.forAdoption}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, forAdoption: e.target.value })
                }
              >
                <option value="Ναι">Ναι</option>
                <option value="Όχι">Όχι</option>
              </select>
            </label>

            {petInfo.forAdoption === "Όχι" && (
              <>
                <h3>Στοιχεία Ιδιοκτήτη</h3>

                <label>
                  ΑΦΜ *
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={ownerInfo.afm}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setOwnerInfo({ ...ownerInfo, afm: value });
                    }}
                    required
                  />
                </label>

                <label>
                  Email *
                  <input
                    type="email"
                    value={ownerInfo.email}
                    onChange={(e) =>
                      setOwnerInfo({ ...ownerInfo, email: e.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Τηλέφωνο *
                  <input
                    type="tel"
                    value={ownerInfo.phone}
                    onChange={(e) =>
                      setOwnerInfo({ ...ownerInfo, phone: e.target.value })
                    }
                    required
                  />
                </label>
                
              </>
            )}
            <div className="form-buttons">
                <button type="button" onClick={() => { if (validateForm()) setStep(2);}}>Συνέχεια</button>
            </div>
          </div>
        {/* </div> */}
          
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {/* ================= STEP 2 ================= */}
{step === 2 && (
  <>
    <div className="stepper">
      <div className="step clickable" onClick={() => setStep(1)}>
        <div className="circle">1</div>
        <div className="step-title">Δημιουργία προφίλ κατοικιδίου</div>
      </div>
      <div className="line" />
      <div className="step active">
        <div className="circle">2</div>
        <div className="step-title">Προεπισκόπηση και καταχώρηση</div>
      </div>
    </div>
    
    {/* <div className="booklet-container"> */}
      <h3>Προεπισκόπηση Στοιχείων</h3>
      
      {/* Απλοποιημένη δομή για προεπισκόπηση */}
      <div className="preview-content">
        <div className="preview-section">
          <h4>Στοιχεία Κατοικιδίου</h4>
          <div className="info-grid">
            <div className="info-pair ">
              <span className="label">Microchip:</span>
              <span className="value">{petInfo.microchip}</span>
            </div>
            <div className="info-pair ">
              <span className="label">Όνομα:</span>
              <span className="value">{petInfo.name}</span>
            </div>
            <div className="info-pair ">
              <span className="label">Είδος:</span>
              <span className="value">{petInfo.species}</span>
            </div>
            <div className="info-pair">
              <span className="label">Ράτσα:</span>
              <span className="value">{petInfo.breed}</span>
            </div>
            <div className="info-pair">
              <span className="label">Φύλο:</span>
              <span className="value">{petInfo.gender}</span>
            </div>
            <div className="info-pair">
              <span className="label">Ημερομηνία Γέννησης:</span>
              <span className="value">{petInfo.birthdate}</span>
            </div>
            <div className="info-pair">
              <span className="label">Προς Υιοθεσία:</span>
              <span className="value">{petInfo.forAdoption}</span>
            </div>
          </div>
        </div>

        {petInfo.forAdoption === "Όχι" && (
          <div className="preview-section">
            <h4>Στοιχεία Ιδιοκτήτη</h4>
            <div className="info-grid">
              <div className="info-pair">
                <span className="label">ΑΦΜ:</span>
                <span className="value">{ownerInfo.afm}</span>
              </div>
              <div className="info-pair">
                <span className="label">Email:</span>
                <span className="value">{ownerInfo.email}</span>
              </div>
              <div className="info-pair">
                <span className="label">Τηλέφωνο:</span>
                <span className="value">{ownerInfo.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-buttons">
        <button type="button" onClick={() => setStep(1)}>Ακύρωση</button>
        <button 
          type="button"  
          onClick={submitPet}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Υποβολή..." : "Οριστική Υποβολή"}
        </button>
      </div>
    {/* </div> */}
  </>
)}    </div>
  );
}