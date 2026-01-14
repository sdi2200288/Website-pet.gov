import React from "react";
import "./PetDeclaration.css";

export default function PetDeclaration({ item, type, onDeleteDeclaration, onViewDeclaration }) {
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
          <img src={item.photoUrl || "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
            alt={"Κατοικίδιο"}
            onError={(e) => {
              e.target.src = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
            }} />
        </div>

        <div className="petDeclarationInfo">
          <div className="petDeclarationField">
            <span className="label">
              {isLoss ? "Ημερομηνία απώλειας" : "Ημερομηνία εύρεσης"}
            </span>
            <span className="value">{item.date}</span>
          </div>

          <div className="petDeclarationField">
            <span className="label">
              {isLoss ? "Διεύθυνση απώλειας" : "Διεύθυνση εύρεσης"}
            </span>
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
            <span
              className={`petStatusBadge ${isFinal ? "petStatusBadge--final" : "petStatusBadge--draft"
                }`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="petDeclarationButtonsTop">
            {isFinal ? (
              <>
                <button className="petButtonPrimary">Εκτύπωση</button>
                <button
                  className="petButtonSecondary"
                  onClick={() => onViewDeclaration(item)}
                >
                  Προβολή
                </button>
              </>
            ) : (
              <>
                <button className="petButtonDanger" onClick={handleDelete}>
                  Διαγραφή
                </button>
                <button className="petButtonPrimary">Επεξεργασία</button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
