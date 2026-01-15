import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import PetDetails from "../../components/Pet/Pet";
import "./HealthBookletVet.css";
// import { MEDICAL_ACTS } from "../Utils/Util";

export default function HealthBookletVet() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [currentOwner, setCurrentOwner] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [medicalHistory, setMedicalHistory] = useState([]);

  // const [newOwnerInfo, setNewOwnerInfo] = useState({
  //   afm: "",
  //   email: "",
  //   phone: "",
  // });

  const vet = JSON.parse(localStorage.getItem("user"));

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

  const [medicalAction, setMedicalAction] = useState({
    date: "",                // Ημερομηνία
    // duration: "",            // Διάρκεια εξέτασης
    // startTime: "",           // Ώρα έναρξης
    // endTime: "",             // Ώρα λήξης
    type: "",                // Τύπος Ιατρικής Πράξης
    // actionCode: "",          // Κωδικός Ιατρικής Πράξης
    // weight: "",              // Βάρος Ζώου
    // anesthesia: "",          // Αναισθησία
    description: "",         // Περιγραφή Ιατρικής Επίσκεψης
    medications: "",         // Στοιχεία Εξόδου (Φάρμακα / Οδηγίες)
  });

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν πατήσετε ακυρωση,θα βγείτε από την προβολή βιβλιαρίου.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;

    // Καθαρισμός state
    setStep(1);
    setSelectedPet("");

    // Πλοήγηση χωρίς query
    navigate("/vet-dashboard/booklet", { replace: true });
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
    if (!microchip) {
      alert("Εισάγετε αριθμό microchip");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedPet(null);
    setCurrentOwner(null);

    try {
      const res = await fetch(
        `http://localhost:3001/pets?microchip=${microchip}`
      );
      const data = await res.json();

      if (!data.length) {
        alert("Δεν βρέθηκε κατοικίδιο με αυτό το microchip");
        setSelectedPet(null);
        setLoading(false);
        return;
      }

      const foundPet = data[0];
      setSelectedPet(foundPet);

      // Φόρτωση του τρέχοντος ιδιοκτήτη
      await loadCurrentOwner(foundPet.ownerId);
      await loadMedicalHistory(foundPet.id);
      setStep(2);
    } catch (err) {
      alert("Σφάλμα αναζήτησης");
    } finally {
      setLoading(false);
    }
  };

  // Συνάρτηση για υπολογισμό ηλικίας από ημερομηνία γέννησης
  const calculateAge = (birthdate) => {
    if (!birthdate) return "Άγνωστη";

    const birth = new Date(birthdate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
    }

    return `${years} ετών`;
  };

  // Συνάρτηση για έλεγχο εγκυρότητας ΑΦΜ (9 ψηφία)
  const validateAFM = (afm) => {
    const afmRegex = /^\d{9}$/;
    return afmRegex.test(afm);
  };

  // Συνάρτηση για έλεγχο εγκυρότητας τηλεφώνου
  const validatePhone = (phone) => {
    const phoneRegex = /^69\d{8}$/;
    return phoneRegex.test(phone);
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

  const handleSubmitMedical = async (status) => {
    if (!selectedPet || !currentOwner) return;

    const medicalReport = {
      petId: selectedPet.id,
      vetId: vet.id,
      date: medicalAction.date,
      duration: medicalAction.duration,
      startTime: medicalAction.startTime,
      endTime: medicalAction.endTime,
      type: medicalAction.type,
      actionCode: medicalAction.actionCode,
      weight: medicalAction.weight,
      anesthesia: medicalAction.anesthesia,
      description: medicalAction.description,
      medications: medicalAction.medications,
      status, // draft | submitted
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/medicalReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicalReport),
      });

      if (res.ok) {
        alert(`Η ιατρική πράξη ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`);
        // Reset
        setStep(0);
        setSelectedPet(null);
        setCurrentOwner(null);
        setMicrochip("");
        setMedicalAction({ type: "", date: "", description: "", medications: "" });
      } else {
        throw new Error("Σφάλμα στην αποθήκευση");
      }
    } catch {
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    }
  };

  return (
    <div className="health-booklet">
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
          <div className="chip-search">
            <input
              className="chip-input"
              value={microchip}
              maxLength={9}
              onChange={(e) => setMicrochip(e.target.value)}
              placeholder="Εισάγετε αριθμό microchip..."
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {loading && <p>Αναζήτηση...</p>}

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
      {step === 2 && (
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
          <div className="found-form">
            <h3>Βιβλιάριο Υγείας</h3>

            <div className="profile-grid">
              <div>
                <p className="label">Όνομα</p>
                <p className="value">{selectedPet.name}</p>

                <p className="label">Φύλο</p>
                <p className="value">{selectedPet.gender}</p>

                <p className="label">Ηλικία</p>
                <p className="value">{calculateAge(selectedPet.birthdate)}</p>
              </div>

              <div>
                <p className="label">Είδος</p>
                <p className="value">{selectedPet.species}</p>

                <p className="label">Ράτσα</p>
                <p className="value">{selectedPet.breed}</p>

                <p className="label">Ημερ. Γέννησης</p>
                <p className="value">{selectedPet.birthdate}</p>
              </div>

              <div>
                <p className="label">Microchip</p>
                <p className="value">{selectedPet.microchip}</p>

                <p className="label">Περιοχή</p>
                <p className="value">{selectedPet.region || "Άγνωστη"}</p>
              </div>
            </div>
            <h3>Ιδιοκτήτης</h3>

            <div className="profile-grid">
              <div>
                <p className="label">Όνομα</p>
                <p className="value">{currentOwner.firstname} {currentOwner.lastname}</p>

                <p className="label">ΑΦΜ</p>
                <p className="value">{currentOwner.afm}</p>
              </div>

              <div>
                <p className="label">Email</p>
                <p className="value">{currentOwner.email}</p>

                <p className="label">Τηλέφωνο</p>
                <p className="value">{currentOwner.phone}</p>
              </div>
            </div>

            <h3>Ιστορικό Ιατρικών Πράξεων</h3>
            {medicalHistory.length === 0 ? (
              <p>Δεν υπάρχουν προηγούμενες ιατρικές πράξεις.</p>
            ) : (
              <div className="medical-history">
                {medicalHistory.map((report) => (
                  <div key={report.id} className="history-item">
                    <p><strong>Τύπος Πράξης:</strong> {report.type}</p>
                    <p><strong>Ημερομηνία:</strong> {report.date}</p>
                    <p><strong>Περιγραφή:</strong> {report.description}</p>
                    <p><strong>Φάρμακα / Οδηγίες:</strong> {report.medications}</p>
                    <hr />
                  </div>
                ))}
              </div>
            )}
            <div className="form-buttons">
              <button type="button" className="cancel-btn2" onClick={handleCancel}>
                Ακύρωση
              </button>
              <button type="button" className="print-btn" onClick={() => window.print()}>
                Εκτύπωση
              </button>

            
            </div>


          </div>


        </>

      )}
    </div>
  );
}