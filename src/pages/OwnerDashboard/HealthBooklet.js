import React, { useState } from "react";  
import "./HealthBooklet.css";

export default function HealthBooklet() {
  const [step, setStep] = useState(0); // 0 = Αρχική οθόνη
  const pet = {
    name: "Μπέλα",
    type: "Σκύλος",
    age: 3,
    breed: "Λαμπραντόρ",
    birthDate: "22/05/2020",
    microchip: "123456789",
    medicalActions: [
      "Εμβόλιο κατά της λύσσας - 01/03/2021",
      "Εμβόλιο κατά της σκωλήκωσης - 15/04/2021",
      "Τακτικός έλεγχος υγείας - 10/01/2022"
    ]
  };

  return (
    <div className="health-booklet">
      {/* STEPPER */}
      <div className="stepper">
        <div className={`step ${step === 1 ? "active" : ""}`}>
          <div className="circle">1</div>
          <span>Το πρώτο βήμα, θα επιλέξετε το κατοικίδιο που θέλετε να δείτε ή να εκτυπώσετε το βιβλιάριο του και βρίσκεται υπό την προστασία σας.</span>
        </div>

        <div className="line" />

        <div className={`step ${step === 2 ? "active" : ""}`}>
          <div className="circle">2</div>
          <span>Στο δεύτερο και τελευταίο βήμα θα δείτε το βιβλιάριο και θα υπάρχει διαθέσιμη η επιλογή της εκτύπωσης.</span>
        </div>
      </div>

      {/* STEP CONTENT */}
      {step === 0 && (
        <>
          <button className="next-btn" onClick={() => setStep(1)}>
            Συνέχεια
          </button>
        </>
      )}

    {step === 1 && (
      <>
        <h3>Επιλέξτε κατοικίδιο</h3>
        <div className="pet-card">
          <div className="pet-info">
            <h4>{pet.name}</h4>
            <p><strong>Τύπος:</strong> {pet.type}</p>
            <p><strong>Ηλικία:</strong> {pet.age} ετών</p>
            <p><strong>Φυλή:</strong> {pet.breed}</p>
          </div>
        </div>
        <button className="next-btn" onClick={() => setStep(2)}>
          Συνέχεια
        </button>
      </>
    )}
    {step === 2 && (
      <>
        <h3>Βιβλιάριο κατοικιδίου</h3>
        <div className="booklet-card">
          <div className="booklet-row">
            <div className="booklet-label">Όνομα:</div>
            <div className="booklet-value">{pet.name}</div>
          </div>
          <div className="booklet-row">
            <div className="booklet-label">Ράτσα:</div>
            <div className="booklet-value">{pet.breed}</div>
          </div>
          <div className="booklet-row">
            <div className="booklet-label">Ηλικία:</div>
            <div className="booklet-value">{pet.age} ετών</div>
          </div>
          <div className="booklet-row">
            <div className="booklet-label">Ημερομηνία γέννησης:</div>
            <div className="booklet-value">{pet.birthDate}</div>
          </div>
          <div className="booklet-row">
            <div className="booklet-label">Microchip:</div>
            <div className="booklet-value">{pet.microchip}</div>
          </div>
          <div className="medical-actions-box">
            <h4>Ιατρικές πράξεις</h4>
            <ul>
              {pet.medicalActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="next-btn">Εκτύπωση</button>
      </>
    )}



    </div>
  );
}
