import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../OwnerDashboard/HealthBookletOwner.css";
import "./MedicalActions.css";
import { MEDICAL_ACTS } from "../Utils/Util";

const DEFAULT_PET_PHOTO = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

export default function MedicalActions() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [currentOwner, setCurrentOwner] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const [medicalAction, setMedicalAction] = useState({
    date: "",                // Ημερομηνία
    duration: "",            // Διάρκεια εξέτασης
    startTime: "",           // Ώρα έναρξης
    endTime: "",             // Ώρα λήξης
    type: "",                // Τύπος Ιατρικής Πράξης
    actionCode: "",          // Κωδικός Ιατρικής Πράξης
    weight: "",              // Βάρος Ζώου
    anesthesia: "",          // Αναισθησία
    description: "",         // Περιγραφή Ιατρικής Επίσκεψης
    medications: "",         // Στοιχεία Εξόδου (Φάρμακα / Οδηγίες)
  });

  const handleMedicalChange = (e) => {
    const { name, value } = e.target;
    setMedicalAction((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της πράξης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;

    // Καθαρισμός state
    setStep(1);
    setSelectedPet("");

    // Πλοήγηση χωρίς query
    navigate("/vet-dashboard/medical", { replace: true });
  };


  // Συνάρτηση για φόρτωση του τρέχοντος ιδιοκτήτη
  // Συνάρτηση για φόρτωση του τρέχοντος ιδιοκτήτη - ΔΙΟΡΘΩΜΕΝΗ
  const loadCurrentOwner = async (ownerId) => {
    try {
      // Ψάχνουμε πρώτα στους owners
      let res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setCurrentOwner(ownerData);
        return true;  // Βρέθηκε owner
      }

      // Αν δεν βρέθηκε στους owners, ψάχνουμε στους vets
      res = await fetch(`http://localhost:3001/vets/${ownerId}`);
      if (res.ok) {
        const vetData = await res.json();
        setCurrentOwner(vetData);
        return true;  // Βρέθηκε vet
      }

      // Δεν βρέθηκε πουθενά
      setCurrentOwner(null);
      return false;
    } catch (error) {
      console.error("Σφάλμα φόρτωσης ιδιοκτήτη:", error);
      setCurrentOwner(null);
      return false;
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

      // Αποθηκεύουμε το κατοικίδιο ΠΡΙΝ από όλα - αυτό λείπει!
      setSelectedPet(foundPet);

      // Καλούμε την loadCurrentOwner και περιμένουμε το αποτέλεσμα
      const ownerFound = await loadCurrentOwner(foundPet.ownerId);

      if (!ownerFound) {
        setErrors({ microchip: "Δεν βρέθηκαν στοιχεία ιδιοκτήτη (ούτε σε owners ούτε σε vets)" });
        return;
      }

      // Φορτώνουμε το ιατρικό ιστορικό
      await loadMedicalHistory(foundPet.id);
      setStep(2);
    } catch (err) {
      console.error("Σφάλμα αναζήτησης:", err);
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

  const validateMedical = () => {
    const newErrors = {};
    if (!medicalAction.date) newErrors.date = "Πρέπει να συμπληρωθεί η ημερομηνία";
    if (!medicalAction.startTime) newErrors.startTime = "Πρέπει να συμπληρωθεί η ώρα έναρξης";
    if (!medicalAction.endTime) newErrors.endTime = "Πρέπει να συμπληρωθεί η ώρα λήξης";
    if (!medicalAction.duration.trim()) newErrors.duration = "Πρέπει να συμπληρωθεί η διάρκεια εξέτασης";
    if (!medicalAction.type) newErrors.type = "Πρέπει να επιλέξετε τύπο ιατρικής πράξης";
    if (!medicalAction.actionCode.trim()) newErrors.actionCode = "Πρέπει να συμπληρωθεί ο κωδικός ιατρικής πράξης";
    if (!medicalAction.weight) newErrors.weight = "Πρέπει να συμπληρωθεί το βάρος";
    if (!medicalAction.anesthesia) newErrors.anesthesia = "Πρέπει να επιλέξετε αναισθησία";
    if (medicalAction.weight && Number(medicalAction.weight) <= 0) {
      newErrors.weight = "Το βάρος πρέπει να είναι μεγαλύτερο από 0";
    }
    if (medicalAction.startTime && medicalAction.endTime) {
      const start = new Date(`1970-01-01T${medicalAction.startTime}:00`);
      const end = new Date(`1970-01-01T${medicalAction.endTime}:00`);
      if (Number.isNaN(start.getTime())) newErrors.startTime = "Μη έγκυρη ώρα έναρξης";
      if (Number.isNaN(end.getTime())) newErrors.endTime = "Μη έγκυρη ώρα λήξης";
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
        newErrors.endTime = "Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoToPreview = () => {
    if (!validateMedical()) return;
    goToStep(4);
  };

  const selectedMedicalAct = MEDICAL_ACTS.find((act) => act.id === medicalAction.type);


  return (
    <div className="transfer">
      {/* Breadcrumb μόνο για step 0 */}
      {step === 0 && (
        <nav className="breadcrumb">
          {[
            { label: "Αρχική", path: "/" },
            { label: "Ενημέρωση Ιατρικών Πράξεων", step: 0 },
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
                        goToStep(item.step);
                      } else if (item.path) {
                        navigate(item.path);
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
              <div className="line" />

              <div className="step step-zero">
                <div className="circle">3</div>
                <span>
                  Στο τρίτο βήμα συμπληρώσετε και θα υποβάλετε μία καινούργια ιατρική πράξη π.χ  εμβολιασμοί, στείρωση, χειρουργεία, εισάγοντας λεπτομέρειες κατα την επίσκεψη αλλα και τα φάρμακα/ οδηγιες που δόθηκαν στην εξοδο.
                </span>
              </div>
              <div className="line" />

              <div className="step step-zero">
                <div className="circle">4</div>
                <span>
                  Στο τέταρτο και τελευταίο βήμα θα μπορείτε να δείτε την προεπισκόπηση της ιατρικής πράξης και να την υποβάλετε. Μετα την υποβολή θα δείτε το ενημερωμένο βιβλιάριο με την επιλογή της εκτύπωσης.
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
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Συμπλήρωση νέας ιατρικής πράξης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Yποβολή </div>
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
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Συμπλήρωση νέας ιατρικής πράξης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
          <div className="found-form">
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
            <div className="form-buttons">
              <button type="button" onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={() => goToStep(3)}>Συνέχεια</button>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
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

            <div
              className="step clickable"
              onClick={() => setStep(2)}
            >
              <div className="circle">2</div>
              <div className="step-title">Προβολή βιβλιάριου</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Συμπλήρωση νέας ιατρικής πράξης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="found-form">
            <h3>Στοιχεία Ιατρικής Πράξης</h3>
            <div className="medical-form-grid">
              {/* Στήλη 1 */}
              <div className="form-column">
                <div className="form-group">
                  <label className="loginLabel">
                    Ημερομηνία *
                    <input
                      type="date"
                      name="date"
                      className={`loginInput ${errors.date ? "inputError" : ""}`}
                      value={medicalAction.date}
                      onChange={handleMedicalChange}
                    />
                    {errors.date && <div className="fieldError">{errors.date}</div>}
                  </label>

                </div>
                <div className="form-group">
                  <label className="loginLabel">
                    Ώρα Έναρξης *
                    <input
                      type="time"
                      name="startTime"
                      className={`loginInput ${errors.startTime ? "inputError" : ""}`}
                      value={medicalAction.startTime}
                      onChange={handleMedicalChange}
                    />
                    {errors.startTime && <div className="fieldError">{errors.startTime}</div>}
                  </label>
                </div>
                <div className="form-group">
                  <label className="loginLabel">
                    Τύπος Ιατρικής Πράξης *
                    <select
                      name="type"
                      className={`loginSelect ${errors.type ? "inputError" : ""}`}
                      value={medicalAction.type}
                      onChange={handleMedicalChange}
                    >
                      <option value="">Επιλέξτε...</option>
                      {MEDICAL_ACTS.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && <div className="fieldError">{errors.type}</div>}
                  </label>

                </div>
                <div className="form-group">
                  <label className="loginLabel">
                    Βάρος Ζώου (kg) *
                    <input
                      type="number"
                      step="0.1"
                      name="weight"
                      className={`loginInput ${errors.weight ? "inputError" : ""}`}
                      value={medicalAction.weight}
                      onChange={handleMedicalChange}
                    />
                    {errors.weight && <div className="fieldError">{errors.weight}</div>}
                  </label>

                </div>
              </div>

              {/* Στήλη 2 */}
              <div className="form-column">
                <div className="form-group">
                  <label className="loginLabel">
                    Διάρκεια εξέτασης *
                    <input
                      type="number"
                      step="1"
                      name="duration"
                      className={`loginInput ${errors.duration ? "inputError" : ""}`}
                      value={medicalAction.duration}
                      onChange={handleMedicalChange}
                      placeholder="πχ 30 λεπτά"
                    />
                    {errors.duration && <div className="fieldError">{errors.duration}</div>}
                  </label>

                </div>
                <div className="form-group">
                  <label className="loginLabel">
                    Ώρα Λήξης *
                    <input
                      type="time"
                      name="endTime"
                      className={`loginInput ${errors.endTime ? "inputError" : ""}`}
                      value={medicalAction.endTime}
                      onChange={handleMedicalChange}
                    />
                    {errors.endTime && <div className="fieldError">{errors.endTime}</div>}
                  </label>

                </div>
                <div className="form-group">
                  <label className="loginLabel">
                    Κωδικός Ιατρικής Πράξης *
                    <input
                      type="text"
                      name="actionCode"
                      className={`loginInput ${errors.actionCode ? "inputError" : ""}`}
                      value={medicalAction.actionCode}
                      onChange={handleMedicalChange}
                    />
                    {errors.actionCode && <div className="fieldError">{errors.actionCode}</div>}
                  </label>
                </div>
                <div className="form-group">
                  <label>Αναισθησία *</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="anesthesia"
                        value="Ναι"
                        checked={medicalAction.anesthesia === "Ναι"}
                        onChange={(e) => setMedicalAction({ ...medicalAction, anesthesia: e.target.value })}
                      />
                      Ναι
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="anesthesia"
                        value="Όχι"
                        checked={medicalAction.anesthesia === "Όχι"}
                        onChange={(e) => setMedicalAction({ ...medicalAction, anesthesia: e.target.value })}
                      />
                      Όχι
                      {errors.anesthesia && <div className="fieldError">{errors.anesthesia}</div>}
                    </label>
                  </div>
                </div>
              </div>


            </div>
            <div className="form-group">
              <label>Περιγραφή Ιατρικής Επίσκεψης</label>
              <textarea
                value={medicalAction.description}
                onChange={(e) => setMedicalAction({ ...medicalAction, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Στοιχεία Εξόδου</label>
              <textarea
                value={medicalAction.medications}
                onChange={(e) => setMedicalAction({ ...medicalAction, medications: e.target.value })}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>Οδηγίες</label>
              <textarea
                placeholder="Οδηγίες που δόθηκαν"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Φάρμακα</label>
              <textarea
                placeholder="Φάρμακα που δόθηκαν"
                rows="2"
              />
            </div>

            <div className="form-buttons">
              <button type="button" onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={handleGoToPreview}>Συνέχεια</button>
            </div>
          </div>
        </>
      )}
      {step === 4 && (
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

            <div
              className="step clickable"
              onClick={() => setStep(2)}
            >
              <div className="circle">2</div>
              <div className="step-title">Προβολή βιβλιάριου</div>
            </div>

            <div className="line" />

            <div
              className="step clickable"
              onClick={() => setStep(3)}
            >
              <div className="circle">3</div>
              <div className="step-title">Συμπλήρωση νέας ιατρικής πράξης</div>
            </div>

            <div className="line" />

            <div className="step active">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="booklet-container">
            <h3>Προεπισκόπηση Ιατρικής Πράξης</h3>
            <div className="info-box large">
              <p><strong>Ημερομηνία:</strong> {medicalAction.date || "— "}</p>
              <p><strong>Διάρκεια εξέτασης:</strong> {medicalAction.duration || "-"}</p>
              <p><strong>Ώρα Έναρξης:</strong> {medicalAction.startTime || "-"}</p>
              <p><strong>Ώρα Λήξης:</strong> {medicalAction.endTime || "-"}</p>
              <p><strong>Τύπος Ιατρικής Πράξης:</strong>{" "}{selectedMedicalAct ? selectedMedicalAct.label : "Δεν έχει επιλεγεί λόγος"}</p>
              <p><strong>Κωδικός Ιατρικής Πράξης:</strong> {medicalAction.actionCode || "-"}</p>
              <p><strong>Βάρος Ζώου:</strong> {medicalAction.weight || "-"}</p>
              <p><strong>Αναισθησία:</strong> {medicalAction.anesthesia || "-"}</p>
              <p><strong>Περιγραφή Ιατρικής Επίσκεψης:</strong> {medicalAction.description || "-"}</p>
              <p><strong>Στοιχεία Εξόδου:</strong> {medicalAction.medications || "-"}</p>
            </div>

            <div className="form-buttons">
              <button type="button" onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={() => handleSubmitMedical("submitted")}>Καταχώρηση</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

