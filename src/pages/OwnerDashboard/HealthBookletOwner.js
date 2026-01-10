import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import "./HealthBookletOwner.css";


export default function HealthBookletOwner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = βιβλιάριο
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

    useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
   window.scrollTo({ top: 0, behavior: "smooth"});
  }, [step]);

  const goToStep = (targetStep) => {
    if (!user) {
      window.location.href = "/login"; // redirect αν δεν υπάρχει user
      return;
    }
    setStep(targetStep);
  };

  // Fetch pets του ιδιοκτήτη
  useEffect(() => {
  if (!user) return;

  fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
    .then((res) => res.json())
    .then((data) => {
      setPets(data);
    })
    .catch(() => setPets([]));
  }, [user]);

  return (
    <div className="health-booklet">
       {/* Breadcrumb */}
      <nav className="breadcrumb">
        {[
          { label: "Αρχική", path: "/", step: null },
          { label: "Προβολή Βιβλιαρίου", step: 0 }, // εδώ θέλουμε να πάει στο step 0 του component
          ...(step >= 1 ? [{ label: "Επιλογή Κατοικιδίου", step: 1 }] : []),
          ...(step >= 2 ? [{ label: "Προβολή Βιβλιαρίου", step: 2 }] : []),
        ].map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          return (
            <span key={index}>
              <span
                style={{
                  color: isLast ? "black" : "blue",
                  cursor: isLast ? "default" : "pointer",
                  textDecoration: isLast ? "none" : "underline",
                }}
                onClick={() => {
                  if (!isLast) {
                    if (item.step !== null) goToStep(item.step);
                    else if (item.path) navigate(item.path);
                  }
                }}
              >
                {item.label}
              </span>
              {!isLast && " / "}
            </span>
          );
        })}
      </nav>

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

          <div className="pets-grid">
            {pets.length === 0 && <p>Δεν έχετε κατοικίδια.</p>}
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-card-wrapper ${selectedPetId === pet.id ? "selected" : "" }`}
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

      {/* ================= STEP 2 ================= */}
      {step === 2 && selectedPet && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
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
                   <img src={selectedPet.photoUrl} alt={selectedPet.name} />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Βασικά Στοιχεία</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span>{user.firstname} {user.lastname}</p>
                    <p><span>ΑΦΜ:</span> {user.afm}</p>
                    <p><span>Διεύθυνση:</span> {user.address}</p>
                    <p><span>Τηλέφωνο:</span> {user.phone}</p>
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
