import React, { useState } from "react";
import PetDetails from "../../components/Pet/Pet";
import dog from "../../images/lostPet1.png";
import "./HealthBooklet.css";
import { pets } from "../Utils/Util"


export default function HealthBooklet() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = βιβλιάριο
  const [selectedPetId, setSelectedPetId] = useState(pets?.[0]?.id ?? null);
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  return (
    <div className="health-booklet">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βήμα επιλέγετε το κατοικίδιο που θέλετε να δείτε ή να
                εκτυπώσετε το βιβλιάριό του.
              </span>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <span>
                Στο δεύτερο βήμα προβάλλεται το βιβλιάριο υγείας.
              </span>
            </div>
          </div>

          <button className="next-btn" onClick={() => setStep(1)}>
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
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">
                Προβολή-Εκτύπωση Βιβλιαρίου
              </div>
            </div>
          </div>

          <h3>Επιλέξτε κατοικίδιο</h3>

          <div className="pet-grid">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`pet-card-wrapper ${selectedPetId === pet.id ? "selected" : ""
                  }`}
              >
                <PetDetails
                  pet={pet}
                  mode={0}
                  selected={selectedPetId === pet.id}
                />
              </div>
            ))}
          </div>

          <button
            className="next-btn"
            disabled={!selectedPetId}
            onClick={() => setStep(2)}
          >
            Συνέχεια
          </button>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && selectedPet && (
        <>
          <div className="stepper">
            <div
              className="step clickable"
              onClick={() => setStep(1)}
            >
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>

            <div className="line" />

            <div className="step active">
              <div className="circle">2</div>
              <div className="step-title">
                Προβολή-Εκτύπωση Βιβλιαρίου
              </div>
            </div>
          </div>

          <div className="booklet-container">
            <h3>Βιβλιάριο Κατοικιδίου</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img
                    src={selectedPet.photoUrl}
                    alt={selectedPet.name}
                  />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Βασικά Στοιχεία</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                    <p><span>Ημερομηνία:</span> {selectedPet.lastSeenDate}</p>
                    <p><span>Περιοχή:</span> {selectedPet.region}</p>
                    <p><span>Διεύθυνση:</span> {selectedPet.lastSeenAddress}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> Ελένη Τόντου</p>
                    <p><span>ΑΦΜ:</span> 123456789</p>
                    <p><span>Διεύθυνση:</span> Ζωγράφου 6, Αττική</p>
                    <p><span>Τηλέφωνο:</span> 123456789</p>
                  </div>
                </div>
              </div>

              <div className="booklet-bottom">
                <div className="info-box large">
                  <h4>Ιατρικές Πράξεις</h4>
                  <p className="empty">— Δεν υπάρχουν καταχωρήσεις —</p>
                </div>

                <div className="info-box large">
                  <h4>Τυχόν Συμβάντα</h4>
                  <p className="empty">— Δεν υπάρχουν καταχωρήσεις —</p>
                </div>
              </div>
            </div>

            <button className="next-btn">Εκτύπωση</button>
          </div>
        </>
      )}
    </div>
  );
}
