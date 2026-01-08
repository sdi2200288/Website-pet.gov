import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loss2.css";

export default function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentOwner, setCurrentOwner] = useState(null);
  const [newOwnerInfo, setNewOwnerInfo] = useState({
    afm: "",
  });

  const [newOwnerFound, setNewOwnerFound] = useState(null);


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

  // Συνάρτηση για φόρτωση του τρέχοντος ιδιοκτήτη
  const loadCurrentOwner = async (ownerId) => {
    try {
      let res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setCurrentOwner(ownerData);
        return true;
      }
      res = await fetch(`http://localhost:3001/vets/${ownerId}`);
      if (res.ok) {
        const vetOwnerData = await res.json();
        setCurrentOwner(vetOwnerData);
        return true;
      }
      setCurrentOwner(null);
      return false;
    } catch (e) {
      setCurrentOwner(null);
      return false;
    }
  };


  const findUserByAFM = async (afm) => {
    try {
      let res = await fetch(`http://localhost:3001/owners?afm=${afm}`);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) {
          return { type: "owner", data: arr[0] };
        }
      }
      res = await fetch(`http://localhost:3001/vets?afm=${afm}`);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) {
          return { type: "vet", data: arr[0] };
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSearchByMicrochip = async () => {
    setLoading(true);
    setErrors({});
    setSelectedPet(null);
    setCurrentOwner(null);

    try {
      const res = await fetch(`http://localhost:3001/pets?microchip=${microchip.trim()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setErrors({ microchip: "Δεν βρέθηκε κατοικίδιο με αυτό το microchip" });
        return;
      }

      const foundPet = data[0];
      setSelectedPet(foundPet);

      const okOwner = await loadCurrentOwner(foundPet.ownerId);
      if (!okOwner) {
        setErrors({ microchip: "Δεν βρέθηκαν στοιχεία ιδιοκτήτη για αυτό το κατοικίδιο" });
        setSelectedPet(null);
        return;
      }

      setStep(2);
    } catch {
      setErrors({ microchip: "Σφάλμα αναζήτησης. Προσπαθήστε ξανά." });
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

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της δήλωσης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;
    setStep(0);
    setSelectedPet(null);
    setCurrentOwner(null);
    setMicrochip("");
    setNewOwnerInfo({ afm: "" });
    setNewOwnerFound(null);
    setErrors({});
  };

  const handleSubmit = async (status) => {
    if (!selectedPet || !currentOwner || !newOwnerFound) return;

    const report = {
      petId: selectedPet.id,
      microchip: selectedPet.microchip,
      vetId: vet.id,

      currentOwnerId: currentOwner.id,
      currentOwnerAfm: currentOwner.afm,
      currentOwnerEmail: currentOwner.email,
      currentOwnerPhone: currentOwner.phone,

      newOwnerId: newOwnerFound.data.id,
      newOwnerAfm: newOwnerFound.data.afm,
      newOwnerEmail: newOwnerFound.data.email,
      newOwnerPhone: newOwnerFound.data.phone,

      transferDate: new Date().toISOString().split("T")[0],
      status, // draft | submitted
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/transferReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      if (!res.ok) throw new Error("Save failed");
      if (status === "submitted") {
        const petUpdate = await fetch(
          `http://localhost:3001/pets/${selectedPet.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ownerId: newOwnerFound.data.id,
            }),
          }
        );
        if (!petUpdate.ok) throw new Error("PATCH pet failed");
      }
      setStep(0);
      setSelectedPet(null);
      setCurrentOwner(null);
      setMicrochip("");
      setNewOwnerInfo({ afm: "" });
      setNewOwnerFound(null);
      setErrors({});
      navigate("/vet-dashboard");
    } catch (err) {
      console.error(err);
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    }
  };


  const validate3 = async () => {
    const afm = newOwnerInfo.afm.trim();
    const newErrors = {};

    if (!afm) newErrors.newOwnerAfm = "Πρέπει να συμπληρώσετε ΑΦΜ νέου ιδιοκτήτη";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const user = await findUserByAFM(afm);
      if (!user) {
        setNewOwnerFound(null);
        setErrors({ newOwnerAfm: "Δεν υπάρχει χρήστης (owner ή vet) με αυτό το ΑΦΜ" });
        return;
      }

      if (currentOwner && String(currentOwner.afm) === String(user.data.afm)) {
        setErrors({ newOwnerAfm: "Ο νέος ιδιοκτήτης δεν μπορεί να είναι ο ίδιος με τον τρέχοντα" });
        setNewOwnerFound(null);
        return;
      }

      setNewOwnerFound(user);
      setErrors({});
      setStep(4);
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


  return (
    <div className="transfer">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step step-zero">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βημα, θα εισάγετε το microchip του κατοικίδιου που είναι προς υιοθεσία και βρίσκεται υπό την προστασία σας.
              </span>
            </div>
            <div className="line" />

            <div className="step step-zero">
              <div className="circle">2</div>
              <span>
                Στο δεύτερο βήμα θα επιβεβαιώσετε τα στοιχεία του κατοικίδιου και του ιδιοκτήτη, όπως είναι καταχωρημένα στη βάση δεδομένων.
              </span>
            </div>
            <div className="line" />

            <div className="step step-zero">
              <div className="circle">3</div>
              <span>
                Στο τρίτο βήμα θα συμπληρώσετε τα στοιχεία του νέου ιδιοκτήτη (ΑΦΜ, όνομα, τηλέφωνο).
              </span>
            </div>
            <div className="line" />

            <div className="step step-zero">
              <div className="circle">4</div>
              <span>
                Στο τέταρτο και τελευταίο βήμα θα ελέγξετε την προεπισκόπηση της δήλωσης σας και θα επιλέξετε προσωρινή αποθήκευση, υποβολή ή διαγραφή. Με την υποβολή η δήλωση κλειδώνει ενώ οι προσωρινά αποθηκευμένες δηλώσεις εμφανίζονται στο ιστορικό δηλώσεων για μελλοντική επεξεργασία ή υποβολή.
              </span>
            </div>
          </div>

          <button className="next-btn" onClick={() => goToStep(1)}>
            Συνέχεια
          </button>
        </>
      )}

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <div className="stepper">
            <div className="step active">
              <div className="circle">1</div>
              <div className="step-title">Εισαγωγή microchip</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων μεταβίβασης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="step1-content">
            <h3>Εισάγετε τον αριθμό microchip του κατοικιδίου</h3>

            <input
              className="chip-input"
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
              placeholder="Εισάγετε αριθμό microchip..."
            />

            {errors.microchip && (
              <p className="error-text step1-error">{errors.microchip}</p>
            )}

            <button
              className="next-btn"
              onClick={validate1}
              disabled={loading}
            >
              {loading ? "Αναζήτηση..." : "Συνέχεια"}
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
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων μεταβίβασης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
          <div className="found-form">
            <h3>Βασικά Στοιχεία</h3>

            {/* Εάν ΥΠΑΡΧΕΙ pet, δείξε τα στοιχεία του */}
            {selectedPet ? (
              <div className="booklet-layout">
                <div className="booklet-header">
                  <div className="pet-photo">
                    <img
                      src={selectedPet.photoUrl}
                      alt={selectedPet.name}
                    />
                  </div>
                  <div className="booklet-top">
                    <div className="info-box2">
                      <h4>Στοιχεία Κατοικιδίου</h4>
                      <p><span>Όνομα:</span> {selectedPet.name}</p>
                      <p><span>Είδος:</span> {selectedPet.species}</p>
                      <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                      <p><span>Φύλο:</span> {selectedPet.gender}</p>
                      <p><span>Microchip:</span> {selectedPet.microchip}</p>
                      <p><span>Ημερομηνία Γέννησης:</span> {selectedPet.birthdate || "-"}</p>
                      <p><span>Ηλικία:</span> {selectedPet.age || "-"}</p>
                    </div>

                    <div className="info-box2">
                      <h4>Στοιχεία Ιδιοκτήτη</h4>
                      {currentOwner ? (
                        <>
                          <p><span>Όνομα:</span> {currentOwner.firstname} {currentOwner.lastname}</p>
                          <p><span>ΑΦΜ:</span> {currentOwner.afm}</p>
                          <p><span>Τηλέφωνο:</span> {currentOwner.phone}</p>
                          <p><span>Email:</span> {currentOwner.email}</p>
                        </>
                      ) : (
                        <p>Φόρτωση στοιχείων ιδιοκτήτη...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Εάν ΔΕΝ υπάρχει pet, δείξε μήνυμα και πεδίο αναζήτησης */
              <div>
                <p> Δεν έχει βρεθεί κατοικίδιο ακόμα...</p>
              </div>
            )}
            <div className="form-buttons">
              <button onClick={handleCancel}>
                Ακύρωση
              </button>
              <button type="button" onClick={() => setStep(3)} disabled={!selectedPet} >Συνέχεια</button>
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
              <div className="step-title">Προβολή προφίλ</div>
            </div>

            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων μεταβίβασης</div>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="found-form">
            <h3>Στοιχεία Νέου Ιδιοκτήτη</h3>

            <label>
              ΑΦΜ *
              <input
                type="text"
                value={newOwnerInfo.afm}
                onChange={(e) => {
                  setNewOwnerInfo({ afm: e.target.value });
                  setNewOwnerFound(null);
                }}
                maxLength="10"
              />

              {errors.newOwnerAfm && (<p className="error-text">{errors.newOwnerAfm}</p>)}
            </label>

            <div className="form-buttons">
              <button onClick={handleCancel}>
                Ακύρωση
              </button>
              <button type="button" onClick={validate3}>Συνέχεια</button>
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
              <div className="step-title">Προβολή προφίλ</div>
            </div>

            <div className="line" />

            <div
              className="step clickable"
              onClick={() => setStep(3)}
            >
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων μεταβίβασης</div>
            </div>

            <div className="line" />

            <div className="step active">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="booklet-container">
            <h3>Προεπισκόπηση Δήλωσης</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img
                    src={selectedPet.photoUrl}
                    alt={selectedPet.name}
                  />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Στοιχεία Κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                    <p><span>Ημερομηνία:</span> {selectedPet.birthdate}</p>
                    <p><span>Περιοχή:</span> {selectedPet.region}</p>
                  </div>
                  <div className="info-box">
                    <h4>Στοιχεία Τρέχων Ιδιοκτήτη</h4>
                    {currentOwner ? (
                      <>
                        <p><span>Όνομα:</span> {currentOwner.firstname} {currentOwner.lastname}</p>
                        <p><span>ΑΦΜ:</span> {currentOwner.afm}</p>
                        <p><span>Τηλέφωνο:</span> {currentOwner.phone}</p>
                        <p><span>Email:</span> {currentOwner.email}</p>
                      </>
                    ) : (
                      <p>Φόρτωση στοιχείων ιδιοκτήτη...</p>
                    )}
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Νέου Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {newOwnerFound.data.firstname} {newOwnerFound.data.lastname}</p>
                    <p><span>ΑΦΜ:</span> {newOwnerFound.data.afm}</p>
                    <p><span>Τηλέφωνο:</span> {newOwnerFound.data.phone}</p>
                    <p><span>Email:</span> {newOwnerFound.data.email}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="form-buttons">
              <button onClick={handleCancel}>
                Ακύρωση
              </button>
              <button type="button" onClick={() => handleSubmit("draft")}>Προσωρινή Αποθήκευση</button>
              <button type="button" onClick={() => handleSubmit("submitted")}>Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )
      }
    </div >
  );
}
