import React, { useState } from "react";  
import PetDetails from "../../components/Pet/Pet";
import dog from "../../images/lostPet1.png";
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
      {/* STEP 0 – Γενική περιγραφή */}
      {step === 0 && (
        <div className="stepper">
          <div className="step">
            <div className="circle">1</div>
            <span>
              Το πρώτο βήμα, θα επιλέξετε το κατοικίδιο που θέλετε να δείτε ή
              να εκτυπώσετε το βιβλιάριο του και βρίσκεται υπό την προστασία σας.
            </span>
          </div>

          <div className="line" />

          <div className="step">
            <div className="circle">2</div>
            <span>
              Στο δεύτερο και τελευταίο βήμα θα δείτε το βιβλιάριο και θα
              υπάρχει διαθέσιμη η επιλογή της εκτύπωσης.
            </span>
          </div>
        </div>
      )}

      {/* STEP 1 – Επιλογή κατοικιδίου */}
      {step === 1 && (
        <div className="stepper">
          <div className="step active">
            <div className="circle">1</div>
            <div className="step-title">Επιλογή κατοικιδίου</div>
          </div>

          <div className="line" />

          <div className="step">
            <div className="circle">2</div>
            <div className="step-title">Προβολή-Εκτύπωση Βιβλιαρίου</div>
          </div>
        </div>
      )}

      {/* STEP 2 – Προβολή βιβλιαρίου */}
      {step === 2 && (
        <div className="stepper">
          <div
            className="step completed clickable"
            onClick={() => setStep(1)}
          >
            <div className="circle">1</div>
            <div className="step-title">Επιλογή κατοικιδίου</div>
          </div>

          <div className="line" />

          <div className="step active">
            <div className="circle">2</div>
            <div className="step-title">Προβολή-Εκτύπωση Βιβλιαρίου</div>
          </div>
        </div>
      )}


      {/* ΠΕΡΙΕΧΟΜΕΝΟ  */}

      {step === 0 && (
        <button className="next-btn" onClick={() => setStep(1)}>
          Συνέχεια
        </button>
      )}

      {step === 1 && (
        <>
          <h3>Επιλέξτε κατοικίδιο</h3>
          <div className="pets-grid">
            <PetDetails mode={0} />
            <PetDetails mode={1} />
          </div>
          <button className="next-btn" onClick={() => setStep(2)}>
            Συνέχεια
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="booklet-container">
            <h3>Βιβλιάριο Κατοικιδίου</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img src={dog} alt="dog" />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Βασικά Στοιχεία</h4>
                    <p><span>Όνομα:</span> {pet.name}</p>
                    <p><span>Είδος:</span> {pet.type}</p>
                    <p><span>Ράτσα:</span> {pet.breed}</p>
                    <p><span>Ηλικία:</span> {pet.age} ετών</p>
                    <p><span>Ημ. Γέννησης:</span> {pet.birthDate}</p>
                    <p><span>Microchip:</span> {pet.microchip}</p>
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
                  {pet.medicalActions.map((action, i) => (
                    <div key={i} className="medical-item">
                      <span>{action}</span>
                      <button className="medical-btn">Προβολή</button>
                    </div>
                  ))}
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
