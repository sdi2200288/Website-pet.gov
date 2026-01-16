import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import "./HealthBookletOwner.css";
import { MEDICAL_ACTS } from "../Utils/Util";


const DEFAULT_PET_PHOTO =
  "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

export default function HealthBookletOwner() {
  const [step, setStep] = useState(0);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [medicalActions, setMedicalActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goToStep = (targetStep) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setStep(targetStep);
  };

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPets(data);
      })
      .catch(() => setPets([]));
  }, [user]);

  useEffect(() => {
    if (!selectedPetId) {
      setMedicalActions([]);
      return;
    }

    setLoading(true);
    Promise.all([
      fetch(`http://localhost:3001/medicalReports?petId=${selectedPetId}`),
      fetch(`http://localhost:3001/vets`)
    ])
      .then(([medicalRes, vetsRes]) => Promise.all([medicalRes.json(), vetsRes.json()]))
      .then(([medicalData, vetsData]) => {
        const medicalWithVet = medicalData.map(action => ({
          ...action,
          vet: vetsData.find(v => v.id === action.vetId)
        }));
        setMedicalActions(medicalWithVet);
        setLoading(false);
      })
      .catch(() => {
        setMedicalActions([]);
        setLoading(false);
      });
  }, [selectedPetId]);

  const handlePrint = () => {
    window.print();
  };
  
  const selectedMedicalAct = MEDICAL_ACTS.find((act) => act.id === medicalActions.type);

  return (
    <div className="health-booklet">
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step">
              <div className="circle">1</div>
              <span>
                Βρες το κατοικίδιο που θέλεις να δεις και να εκτυπώσεις το βιβλιάριό του.
              </span>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <span>
                Προβολή και εκτύπωση του βιβλιαρίου υγείας.
              </span>
            </div>
          </div>

          <button className="next-btn" onClick={() => goToStep(1)}>
            Συνέχεια
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <div className="stepper">
            <div className="step active">
              <div className="circle">1</div>
              <div className="step-title">Επίλεξε κατοικίδιο</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προβολή - Εκτύπωση βιβλιαρίου</div>
            </div>
          </div>

          <h3>Επιλογή κατοικιδίου</h3>

          <div className="pets-grid">
            {pets.length === 0 && <p>Δεν υπάρχουν κατοικίδια.</p>}
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-card-wrapper ${selectedPetId === pet.id ? "selected" : ""}`}
                onClick={() => setSelectedPetId(pet.id)}
              >
                <PetDetails pet={pet} mode={0} selected={selectedPetId === pet.id} />
              </div>
            ))}
          </div>

          <button
            className="next-btn"
            disabled={!selectedPetId}
            onClick={() => goToStep(2)}
          >
            Συνέχεια
          </button>
        </>
      )}

      {step === 2 && selectedPet && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επίλεξε κατοικίδιο</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">2</div>
              <div className="step-title">Προβολή - Εκτύπωση βιβλιαρίου</div>
            </div>
          </div>

          <div className="booklet-container">
            <h3>Βιβλιάριο υγείας</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img
                    src={selectedPet.photoUrl || DEFAULT_PET_PHOTO}
                    alt={selectedPet.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_PET_PHOTO;
                    }}
                  />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Στοιχεία κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                    <p><span>Ημερομηνία γέννησης:</span> {selectedPet.birthdate || "-"}</p>
                    <p><span>Ηλικία:</span> {selectedPet.age || "-"} έτη</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία ιδιοκτήτη</h4>
                    <p><span>Ονοματεπώνυμο:</span> {user.firstname} {user.lastname}</p>
                    <p><span>ΑΦΜ:</span> {user.afm}</p>
                    <p><span>Διεύθυνση:</span> {user.address}</p>
                    <p><span>Τηλέφωνο:</span> {user.phone}</p>
                  </div>
                </div>
              </div>

              <div className="booklet-bottom">
  <div className="info-box large">
    <h4>Ιστορικό πράξεων</h4>
    {loading ? (
      <p>Φόρτωση...</p>
    ) : medicalActions.length === 0 ? (
      <p className="empty">Δεν υπάρχουν καταχωρημένες πράξεις.</p>
    ) : (
      <div className="medical-actions-list">
        {medicalActions.map((action) => {
          const actLabel =
            MEDICAL_ACTS.find((a) => a.id === action.type)?.label ?? action.type ?? "—";
          const vetName = action.vet 
            ? `${action.vet.firstname} ${action.vet.lastname}` 
            : "Άγνωστος κτηνίατρος";

          return (
            <div key={action.id} className="medical-action-item">
              <div className="medical-action-header">
                <p><strong>Ημερομηνία:</strong> {action.date}</p>
                <p><strong>Είδος:</strong> {actLabel}</p>
                <p><strong>Κτηνίατρος:</strong> {vetName}</p>
              </div>
              <div className="medical-action-details">
                {action.description && (
                  <p><strong>Περιγραφή:</strong> {action.description}</p>
                )}
                {action.medications && (
                  <p><strong>Φάρμακα/Αγωγή:</strong> {action.medications}</p>
                )}
                {action.notes && (
                  <p><strong>Σημειώσεις:</strong> {action.notes}</p>
                )}
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    )}
  </div>
              </div>
            </div>

            <button className="next-btn" type="button" onClick={handlePrint}>
              Εκτύπωση
            </button>
          </div>
        </>
      )}
    </div>
  );
}
