import React from "react";
import "./PetDeclaration.css";

export default function PetDeclaration({ item, type, onDeleteDeclaration, onViewDeclaration, onPrintDeclaration, onEditDeclaration }) {
  const effectiveType = type === "mixed" ? item.type : type;
  const isFinal = item.status === "submitted";
  const statusLabel = isFinal ? "Οριστικοποιημένη" : "Προσωρινά αποθηκευμένη";

  const declarationTypeLabel = (() => {
    if (effectiveType === "loss" || effectiveType === "lost") return "Απώλεια";
    if (effectiveType === "found") return "Εύρεση";
    if (effectiveType === "foundNoAcc") return "Εύρεση (χωρίς λογαριασμό)";
    if (effectiveType === "adoption") return "Υιοθεσία";
    if (effectiveType === "foster") return "Φιλοξενία";
    if (effectiveType === "transfer") return "Μεταβίβαση";
    return "Δήλωση";
  })();

  const handleDelete = () => {
    if (onDeleteDeclaration) {
      onDeleteDeclaration(item.id, item.type);
    }
  };

  const handlePrint = () => {
    if (onPrintDeclaration) {
      onPrintDeclaration(item);
    }
  };

  const handleView = () => {
    if (onViewDeclaration) {
      onViewDeclaration(item);
    }
  };

  const handleEdit = () => {
    if (onEditDeclaration) {
      onEditDeclaration(item);
    }
  };


  const infoRows = (() => {
    if (
      effectiveType === "loss" ||
      effectiveType === "lost" ||
      effectiveType === "found" ||
      effectiveType === "foundNoAcc"
    ) {
      return [
        { label: "Τύπος δήλωσης", value: declarationTypeLabel },
        { label: "Ημερομηνία", value: item.date },
        { label: "Περιοχή", value: item.region },
        { label: "Διεύθυνση", value: item.address },
        { label: "Κατάσταση", value: item.condition },
      ];
    }

    if (effectiveType === "adoption" || effectiveType === "foster") {
      return [
        { label: "Τύπος δήλωσης", value: declarationTypeLabel },
        { label: "Ημερομηνία δημιουργίας", value: item.createdAt },
      ];
    }

    if (effectiveType === "transfer") {
      const currentOwner =
        item.currentOwnerName ||
        item.currentOwnerFullname ||
        item.currentOwner ||
        item.currentOwnerId;
      const newOwner =
        item.newOwnerName || item.newOwnerFullname || item.newOwner || item.newOwnerId;

      return [
        { label: "Τύπος δήλωσης", value: declarationTypeLabel },
        { label: "Τρέχων Ιδιοκτήτης", value: currentOwner },
        { label: "Νέος Ιδιοκτήτης", value: newOwner },
        { label: "Ημερομηνία δημιουργίας", value: item.createdAt },
      ];
    }

    return [
      { label: "Τύπος δήλωσης", value: declarationTypeLabel },
      { label: "Ημερομηνία δημιουργίας", value: item.createdAt },
    ];
  })();

  return (
    <article className={`petDeclarationCard ${isFinal ? "status-final" : "status-draft"}`}>
      <div className="petDeclarationMainRow">
        <div className="petDeclarationPhoto">
          <img
            src={item.photoUrl || "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
            alt="Κατοικίδιο"
            onError={(e) => {
              e.target.src = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
            }}
          />
        </div>

        <div className="petDeclarationInfo">
          {infoRows.map((row) => (
            <div className="petDeclarationField" key={row.label}>
              <span className="label">{row.label}</span>
              <span className="value">{row.value ?? "-"}</span>
            </div>
          ))}
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
                <button className="petButtonPrimary" onClick={handlePrint}>
                  Εκτύπωση
                </button>
                <button className="petButtonSecondary" onClick={handleView}>
                  Προβολή
                </button>
              </>
            ) : (
              <>
                <button className="petButtonDanger" onClick={handleDelete}>
                  Διαγραφή
                </button>
                <button className="petButtonPrimary" onClick={handleEdit}>
                  Επεξεργασία
                </button>

              </>
            )
            }
          </div >
        </div >
      </div >
    </article >
  );
}
