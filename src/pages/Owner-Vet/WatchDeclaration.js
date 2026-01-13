import React from "react";
import "./WatchDeclaration.css";

export default function DeclarationModal({ isOpen, onClose, declaration }) {
    if (!isOpen || !declaration) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Κουμπί × πάνω αριστερά */}
                <button className="modal-close-x" onClick={onClose}>×</button>

                <h2 className="modal-title">Στοιχεία Δήλωσης</h2>

                {/* ΦΩΤΟΓΡΑΦΙΑ ΖΩΟΥ */}
                {declaration.photo && (
                    <div className="modal-photo-wrapper">
                        <img
                            src={declaration.photo || "./images/pet-placeholder.png"}
                            alt={declaration.petName || "Κατοικίδιο"}
                            className="modal-pet-photo"
                        />
                    </div>
                )}

                {/* ===== ΣΤΟΙΧΕΙΑ ΖΩΟΥ ===== */}
                <section className="modal-section">
                    <h3>Στοιχεία Ζώου</h3>
                    <div className="modal-grid">
                        <div className="modal-field">
                            <span className="modal-label">Κατάσταση Ζώου</span>
                            <span className="modal-value">{declaration.type === "lost" ? "Έχει χαθεί" : "Έχει βρεθεί"}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Microchip</span>
                            <span className="modal-value">{declaration.microchip}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Όνομα</span>
                            <span className="modal-value">{declaration.petName}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Ημερομηνία Γέννησης</span>
                            <span className="modal-value">{declaration.birthDate || "—"}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Ηλικία</span>
                            <span className="modal-value">{declaration.age || "—"}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Είδος</span>
                            <span className="modal-value">{declaration.species}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Ράτσα</span>
                            <span className="modal-value">{declaration.breed}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Φύλο</span>
                            <span className="modal-value">{declaration.gender}</span>
                        </div>
                    </div>
                </section>

                {/* ===== ΣΤΟΙΧΕΙΑ ΑΠΩΛΕΙΑΣ ===== */}
                <section className="modal-section">
                    <h3>Στοιχεία Απώλειας</h3>
                    <div className="modal-grid">
                        <div className="modal-field">
                            <span className="modal-label">Ημερομηνία</span>
                            <span className="modal-value">{declaration.date}</span>
                        </div>
                        <div className="modal-field">
                            <span className="modal-label">Περιοχή (Νομός)</span>
                            <span className="modal-value">{declaration.region}</span>
                        </div>
                        <div className="modal-field full">
                            <span className="modal-label">Διεύθυνση</span>
                            <span className="modal-value">{declaration.address}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
