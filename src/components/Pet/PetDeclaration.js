import React from "react";
import "./PetDeclaration.css";

export default function PetDeclaration({ item, type, onDeleteDeclaration }) {
  const isLoss = type === "lost";
  const isFinal = item.status === "submitted";
  const statusLabel = isFinal ? "Οριστικοποιημένη" : "Προσωρινά Αποθηκευμένη";

  const handleDelete = () => {
    if (onDeleteDeclaration) {
      onDeleteDeclaration(item.id, item.type);
    }
  };

  return (
    <article className={`petDeclarationCard ${isFinal ? "status-final" : "status-draft"}`}>
      <div className="petDeclarationMainRow">
        <div className="petDeclarationPhoto">
          <img src={item.photo} alt={item.petName || "Κατοικίδιο"} />
        </div>

        <div className="petDeclarationInfo">
          <div className="petDeclarationField">
            <span className="label">{isLoss ? "Ημερομηνία απώλειας" : "Ημερομηνία εύρεσης"}</span>
            <span className="value">{item.date}</span>
          </div>

          <div className="petDeclarationField">
            <span className="label">{isLoss ? "Διεύθυνση απώλειας" : "Διεύθυνση εύρεσης"}</span>
            <span className="value">{item.address}</span>
          </div>

          <div className="petDeclarationField">
            <span className="label">Περιοχή (Νομός)</span>
            <span className="value">{item.region}</span>
          </div>
        </div>

        <div className="petDeclarationSide">
          <div className="petStatusRow">
            <span className="label">Κατάσταση</span>
              <span className={`petStatusBadge ${isFinal ? "petStatusBadge--final" : "petStatusBadge--draft"}`}>
                {statusLabel}
            </span>
          </div>

          <div className="petDeclarationButtonsTop">
            {isFinal ? (
              <>
                <button className="petButtonPrimary">Εκτύπωση</button>
                <button className="petButtonSecondary">Προβολή</button>
              </>
            ) : (
              <>
                <button className="petButtonDanger"  onClick={handleDelete}>Διαγραφή</button>
                <button className="petButtonPrimary">Επεξεργασία</button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
