import React, { useState } from "react";
import "./HealthBooklet.css";

export default function HealthBooklet() {
  const [step, setStep] = useState(1);

  return (
    <div className="health-booklet">
      {/* STEPPER */}
      <div className="stepper">
        <div
          className={`step ${step === 1 ? "active" : ""} ${step > 1 ? "clickable" : ""}`}
          onClick={() => {
            if (step > 1) setStep(1);
          }}
        >
          <div className="circle">1</div>
          <span>Επιλογή κατοικιδίου</span>
        </div>

        <div className="line" />

        <div className={`step ${step === 2 ? "active" : ""}`}>
          <div className="circle">2</div>
          <span>Προβολή και εκτύπωση βιβλιαρίου</span>
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <p className="step-description">
            Στο πρώτο βήμα, θα επιλέξετε το κατοικίδιο που θέλετε να δείτε ή να
            εκτυπώσετε το βιβλιάριο του και βρίσκεται υπό την προστασία σας.
          </p>

          <button className="next-btn" onClick={() => setStep(2)}>
            Συνέχεια
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h3 style={{ marginTop: "40px" }}>Επιλέξτε κατοικίδιο</h3>

          <button className="next-btn" onClick={() => setStep(3)}>
            Συνέχεια
          </button>
        </>
      )}
    </div>
  );
}
