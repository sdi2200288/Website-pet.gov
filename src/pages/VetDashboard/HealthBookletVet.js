import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../OwnerDashboard/HealthBookletOwner.css";
import { MEDICAL_ACTS } from "../Utils/Util";

const DEFAULT_PET_PHOTO = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

export default function MedicalActions() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [currentOwner, setCurrentOwner] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [errors, setErrors] = useState({});

  const vet = JSON.parse(localStorage.getItem("user"));
  // const selectedPet = pets.find((p) => p.id === selectedPetId);

  const goToStep = (targetStep) => {
    if (!vet) {
      window.location.href = "/login";
      return;
    }

    if (vet.role !== "vet") {
      window.location.href = "/login";
      return;
    }
    setStep(targetStep);
  };

  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
  if (selectedPet) {
    loadMedicalHistory(selectedPet.id);
  }
}, [selectedPet]);

  const handlePrint = () => {
    window.print();
  };
  // Συνάρτηση για φόρτωση του τρέχοντος ιδιοκτήτη
  const loadCurrentOwner = async (ownerId) => {
    try {
      const res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setCurrentOwner(ownerData);
      } else {
        setCurrentOwner(null);
      }
    } catch (error) {
      console.error("Σφάλμα φόρτωσης ιδιοκτήτη:", error);
      setCurrentOwner(null);
    }
  };

  const handleSearchByMicrochip = async () => {
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch(`http://localhost:3001/pets?microchip=${microchip}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setErrors({ microchip: "Δεν βρέθηκε κατοικίδιο με αυτό το microchip" });
        return;
      }
      const foundPet = data[0];

      setSelectedPet(foundPet);

      // ΞΕΣΧΟΛΙΑΣΜΕΝΟ: Φορτώνουμε τον ιδιοκτήτη
      await loadCurrentOwner(foundPet.ownerId);

      // Φορτώνουμε το ιατρικό ιστορικό
      await loadMedicalHistory(foundPet.id);

      setStep(2);
    } catch (err) {
      setErrors({ microchip: "Σφάλμα αναζήτησης. Προσπαθήστε ξανά." });
    } finally {
      setLoading(false);
    }
  };


  const validate1 = () => {
    const newErrors = {};
    if (!microchip.trim()) newErrors.microchip = "Πρέπει να εισάγετε αριθμό microchip";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    handleSearchByMicrochip();
  };

  const loadMedicalHistory = async (petId) => {
    try {
      const res = await fetch(`http://localhost:3001/medicalReports?petId=${petId}`);
      if (res.ok) {
        const data = await res.json();
        setMedicalHistory(data);
      } else {
        setMedicalHistory([]);
      }
    } catch (error) {
      console.error("Σφάλμα φόρτωσης ιστορικού ιατρικών πράξεων:", error);
      setMedicalHistory([]);
    }
  };

  const selectedMedicalAct = MEDICAL_ACTS.find((act) => act.id === medicalHistory.type);

  return (
    <div className="transfer">
      {/* Breadcrumb μόνο για step 0 */}
      {step === 0 && (
        <nav className="breadcrumb">
          {[
            { label: "Αρχική", path: "/" },
            { label: "Προβολή Βιβλιαρίου", step: 0 },
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
                      if (item.step !== undefined) {
                        goToStep(item.step); // μεταβαίνει στο step του wizard
                      } else if (item.path) {
                        navigate(item.path); // πηγαίνει σε άλλη σελίδα
                      }
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
      )}

      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="step0-wrapper">
            <div className="stepper">
              <div className="step step-zero">
                <div className="circle">1</div>
                <span>
                  Στο πρώτο βημα, θα εισάγετε το microchip του κατοικίδιου που θέλετε.
                </span>
              </div>
              <div className="line" />

              <div className="step step-zero">
                <div className="circle">2</div>
                <span>
                  Στο δεύτερο βήμα θα δείτε  τα στοιχεία του κατοικιδίου και το βιβλιάριο όπως είναι καταχωρημένα στη βάση δεδομένων.
                </span>
              </div>
            </div>

            <button className="next-btn" onClick={() => goToStep(1)}>
              Συνέχεια
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <div className="step1-spacer"></div>
          <div className="stepper">
            <div className="step active">
              <div className="circle">1</div>
              <div className="step-title">Εισαγωγή microchip</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προβολή βιβλιάριου</div>
            </div>
          </div>

          <h3>Εισάγετε τον αριθμό microchip του κατοικιδίου</h3>

          <input
            className="chip-input"
            value={microchip}
            maxLength={9}
            onChange={(e) => setMicrochip(e.target.value)}
            placeholder="Εισάγετε αριθμό microchip..."
          />

          {errors.microchip && (
            <p className="error-text step1-error">{errors.microchip}</p>
          )}

          <div style={{ marginTop: '20px' }}>
            <button
              className="next-btn"
              onClick={handleSearchByMicrochip}
              disabled={loading || !microchip.trim()}
            >
              {loading ? 'Αναζήτηση...' : 'Συνέχεια'}
              {/* Συνέχεια */}
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && selectedPet && (
        <>
          <div className="stepper">
            <div
              className="step clickable"
              onClick={() => setStep(1)}
            >
              <div className="circle">1</div>
              <div className="step-title">Εισαγωγή microchip</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">2</div>
              <div className="step-title">Προβολή βιβλιάριου</div>
            </div>
          </div>
          <div className="booklet-container">
            <h3>Βιβλιάριο υγείας</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img
                    src={selectedPet.photoUrl || DEFAULT_PET_PHOTO}
                    alt={selectedPet.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_PET_PHOTO;
                    }}
                  />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Στοιχεία κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                    <p><span>Ημερομηνία γέννησης:</span> {selectedPet.birthdate || "-"}</p>
                    <p><span>Ηλικία:</span> {selectedPet.age || "-"} έτη</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία ιδιοκτήτη</h4>
                    <p><span>Ονοματεπώνυμο:</span> {currentOwner.firstname} {currentOwner.lastname}</p>
                    <p><span>ΑΦΜ:</span> {currentOwner.afm}</p>
                    <p><span>Διεύθυνση:</span> {currentOwner.address}</p>
                    <p><span>Τηλέφωνο:</span> {currentOwner.phone}</p>
                  </div>
                </div>
              </div>

              <div className="booklet-bottom">
                <div className="info-box large">
                  <h4>Ιστορικό πράξεων</h4>
                  {loading ? (
                    <p>Φόρτωση...</p>
                  ) : medicalHistory.length === 0 ? (
                    <p className="empty">Δεν υπάρχουν καταχωρημένες πράξεις.</p>
                  ) : (
                    <div className="medical-actions-list">
                      {medicalHistory.map((action) => {
                        const actLabel =
                          MEDICAL_ACTS.find((a) => a.id === action.type)?.label ?? action.type ?? "—";

                        return (
                          <div key={action.id} className="medical-action-item">
                            <p><strong>Ημερομηνία:</strong> {action.date}</p>
                            <p><strong>Είδος:</strong> {actLabel}</p>
                            <p><strong>Περιγραφή:</strong> {action.description}</p>
                            <p><strong>Φάρμακα/Αγωγή:</strong> {action.medications}</p>
                            <hr />
                          </div>
                        );
                      })}

                    </div>
                  )}
                </div>
              </div>
            </div>

            <button className="next-btn" type="button" onClick={handlePrint}>
              Εκτύπωση
            </button>
          </div>

        </>

      )}
    </div>
  );
}


