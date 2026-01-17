import React from "react";
import "./WatchDeclaration.css";

const DEFAULT_PHOTO =
  "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

function formatDateTime(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("el-GR");
}

function labelForType(t) {
  if (t === "loss" || t === "lost") return "Δήλωση Απώλειας";
  if (t === "found") return "Δήλωση Εύρεσης";
  if (t === "foundNoAcc") return "Δήλωση Εύρεσης (χωρίς λογαριασμό)";
  if (t === "adoption") return "Δήλωση Υιοθεσίας";
  if (t === "foster") return "Δήλωση Αναδοχής";
  if (t === "transfer") return "Δήλωση Μεταβίβασης";
  return "Δήλωση";
}

function Row({ label, value }) {
  return (
    <div className="modal-row">
      <span className="modal-label">{label}</span>
      <span className="modal-value">{value ?? "-"}</span>
    </div>
  );
}

export default function DeclarationModal({ isOpen, onClose, declaration }) {
  if (!isOpen || !declaration) return null;

  const t =  declaration.type ||
    (declaration.adoptionDate ? "adoption" : null) ||
    (declaration.fosterDate ? "foster" : null) ||
    (declaration.transferDate ? "transfer" : null) ||
    (declaration.firstname || declaration.lastname || declaration.email || declaration.phone? "foundNoAcc" : null) ||"found";

  const title = labelForType(t);

  const hasPhoto = Boolean(declaration.photoUrl);

  const isLostOrFound =  t === "loss" || t === "lost" || t === "found" || t === "foundNoAcc";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>Βασικά</h4>
            <Row label="ID" value={declaration.id} />
            <Row label="Pet ID" value={declaration.petId} />
            <Row label="Status" value={declaration.status} />
            <Row label="Created At" value={formatDateTime(declaration.createdAt)} />
          </div>

          {isLostOrFound && (
            <div className="modal-section">
              <h4>Στοιχεία Δήλωσης</h4>
              <Row label="Ημερομηνία" value={formatDateTime(declaration.date)} />
              <Row label="Περιοχή" value={declaration.region} />
              <Row label="Διεύθυνση" value={declaration.address} />
              <Row label="Κατάσταση" value={declaration.condition} />

              {typeof declaration.ownerId !== "undefined" && (
                <Row label="Υποβλήθηκε από (ownerId)" value={declaration.ownerId} />
              )}
            </div>
          )}

          {t === "foundNoAcc" && (
            <div className="modal-section">
              <h4>Στοιχεία Επικοινωνίας</h4>
              <Row label="Όνομα" value={declaration.firstname} />
              <Row label="Επώνυμο" value={declaration.lastname} />
              <Row label="Email" value={declaration.email} />
              <Row label="Τηλέφωνο" value={declaration.phone} />
            </div>
          )}

          {t === "adoption" && (
            <div className="modal-section">
              <h4>Στοιχεία Υιοθεσίας</h4>
              <Row label="Κτηνίατρος (vetId)" value={declaration.vetId} />
              <Row label="Τρέχων Ιδιοκτήτης (currentOwnerId)" value={declaration.currentOwnerId} />
              <Row label="Νέος Ιδιοκτήτης (newOwnerId)" value={declaration.newOwnerId} />
              <Row label="Ημερομηνία Υιοθεσίας" value={formatDateTime(declaration.adoptionDate)} />
            </div>
          )}

          {t === "foster" && (
            <div className="modal-section">
              <h4>Στοιχεία Αναδοχής</h4>
              <Row label="Κτηνίατρος (vetId)" value={declaration.vetId} />
              <Row label="Τρέχων Ιδιοκτήτης (currentOwnerId)" value={declaration.currentOwnerId} />
              <Row label="Ανάδοχος (fosterOwnerId)" value={declaration.fosterOwnerId} />
              <Row label="Ημερομηνία Αναδοχής" value={formatDateTime(declaration.fosterDate)} />
            </div>
          )}

          {t === "transfer" && (
            <div className="modal-section">
              <h4>Στοιχεία Μεταβίβασης</h4>
              <Row label="Κτηνίατρος (vetId)" value={declaration.vetId} />
              <Row label="Τρέχων Ιδιοκτήτης (currentOwnerId)" value={declaration.currentOwnerId} />
              <Row label="Νέος Ιδιοκτήτης (newOwnerId)" value={declaration.newOwnerId} />
              <Row label="Ημερομηνία Μεταβίβασης" value={formatDateTime(declaration.transferDate)} />
            </div>
          )}

          {hasPhoto && (
            <div className="modal-section">
              <h4>Φωτογραφία</h4>
              <img
                src={declaration.photoUrl || DEFAULT_PHOTO}
                alt="Φωτογραφία δήλωσης"
                className="modal-photo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_PHOTO;
                }}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="primary-btn" onClick={onClose}>
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  );
}