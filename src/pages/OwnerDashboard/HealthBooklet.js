import React from "react";
import "./HealthBooklet.css";

export default function HealthBooklet() {
  return (
    <div className="health-booklet">
      <h2>Προβολή - Εκτύπωση Βιβλιαρίου</h2>

      <div className="steps">
        <div className="step">
          <div className="circle">1</div>
          <p>
            Στο πρώτο βήμα, θα επιλέξετε το κατοικίδιο που θέλετε να δείτε ή να
            εκτυπώσετε το βιβλιάριο του και βρίσκεται υπό την προστασία σας.
          </p>
        </div>

        <div className="line" />

        <div className="step">
          <div className="circle">2</div>
          <p>
            Στο δεύτερο και τελευταίο βήμα θα δείτε το βιβλιάριο και θα υπάρχει
            διαθέσιμη η επιλογή της εκτύπωσης.
          </p>
        </div>
      </div>

      <button className="next-btn">Συνέχεια</button>
    </div>
  );
}
