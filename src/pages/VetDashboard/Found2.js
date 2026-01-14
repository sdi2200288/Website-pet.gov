import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { REGIONS } from "../Utils/Util";
import "./Found2.css";
import "./Loss2.css";


export default function Found2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [foundInfo, setFoundInfo] = useState({
    date: "",
    region: "",
    address: "",
    condition: "",
  });

  const vet = JSON.parse(localStorage.getItem("user")); // role: vet

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

  const loadOwnerData = async (ownerId) => {
    try {
      let res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setOwner(ownerData);
        return true;
      }
      res = await fetch(`http://localhost:3001/vets/${ownerId}`);
      if (res.ok) {
        const vetOwnerData = await res.json();
        setOwner(vetOwnerData);
        return true;
      }
      setOwner(null);
      return false;
    } catch (error) {
      console.error("Σφάλμα φόρτωσης ιδιοκτήτη:", error);
      setOwner(null);
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
      if (foundPet.lost === false) {
        setErrors({ microchip: "Το κατοικίδιο δεν έχει ενεργή δήλωση εξαφάνισης" });
        return;
      }
      setPet(foundPet);
      const ownerLoaded = await loadOwnerData(foundPet.ownerId);
      if (!ownerLoaded) {
        setErrors({ microchip: "Δεν βρέθηκαν στοιχεία ιδιοκτήτη (ούτε σε owners ούτε σε vets)" });
        return;
      }
      setStep(2);
    } catch (err) {
      setErrors({ microchip: "Σφάλμα αναζήτησης. Προσπαθήστε ξανά." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!pet) return;
    const report = {
      petId: pet.id,
      date: foundInfo.date,
      region: foundInfo.region,
      address: foundInfo.address,
      condition: foundInfo.condition,
      status, // 'draft' ή 'submitted'
      ownerId: owner.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/foundReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error("POST foundReports failed");
      if (status === "submitted") {
        const petUpdate = await fetch(
          `http://localhost:3001/pets/${pet.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lost: false,
              lastSeenDate: foundInfo.date,
              region: foundInfo.region,
              lastSeenAddress: foundInfo.address,
              condition: foundInfo.condition,
            }),
          }
        );
        if (!petUpdate.ok) throw new Error("PATCH pet failed");
      }
      alert(`Η δήλωση ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`);
      // Reset
      setStep(0);
      setPet(null);
      setOwner(null);
      setMicrochip("");
      setFoundInfo({ date: "", region: "", address: "", condition: "" });

      // Μετάβαση στην αρχικη
      navigate("/vet-dashboard");
    } catch {
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    }
  };


  const validate1 = () => {
    const newErrors = {};
    if (!microchip.trim()) newErrors.microchip = "Πρέπει να εισάγετε αριθμό microchip";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    handleSearchByMicrochip();
  };

  const validate3 = () => {
    const newErrors = {};
    if (!foundInfo.date) newErrors.date = "Πρέπει να επιλέξετε ημερομηνία";
    if (!foundInfo.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";
    if (foundInfo.date && pet?.lastSeenDate) {
      const foundDate = new Date(foundInfo.date);
      const lastSeenDate = new Date(pet.lastSeenDate);
      if (foundDate < lastSeenDate) {
        newErrors.date = "Η ημερομηνία πρέπει να είναι μετά την εξαφάνιση του κατοικιδίου";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    goToStep(4);
  };


  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της δήλωσης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;
    setStep(0);
    setPet(null);
    setOwner(null);
    setMicrochip("");
    setFoundInfo({ date: "", region: "", address: "", condition: "" });
    setErrors({});
  };

  return (
    <div className="found2">
      {/* Breadcrumb μόνο για step 0 */}
      {step === 0 && (
        <nav className="breadcrumb">
          {[
            { label: "Αρχική", path: "/" },
            { label: "Δήλωση Εύρεσης", step: 0 },
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
          <div className="stepper-wrapper">
            <div className="stepper stepper-intro">
              <div className="stepper">
                <div className="step step-zero">
                  <div className="circle">1</div>
                  <span>
                    Στο πρώτο βημα, θα εισάγετε το microchip του κατοικίδιου που βρέθηκε.
                  </span>
                </div>
                <div className="line" />

                <div className="step step-zero">
                  <div className="circle">2</div>
                  <span>
                    Στο δεύτερο βήμα θα επιβεβαιώσετε τα στοιχεία του κατοικίδιου, όπως είναι καταχωρημένα στη βάση δεδομένων.
                  </span>
                </div>
                <div className="line" />

                <div className="step step-zero">
                  <div className="circle">3</div>
                  <span>
                    Στο τρίτο βήμα θα συμπληρώσετε τα στοιχεία της ευρεσης (ημερομηνία, τοποθεσία, φωτογραφία).
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
              <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
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
              maxLength={9}
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
      )
      }
      {/* ================= STEP 2 ================= */}
      {
        step === 2 && (
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
                <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
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
              {pet ? (
                <div className="booklet-layout">
                  <div className="booklet-header">
                    <div className="pet-photo">
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                      />
                    </div>
                    <div className="booklet-top">
                      <div className="info-box2">
                        <h4>Στοιχεία Κατοικιδίου</h4>
                        <p><span>Όνομα:</span> {pet.name}</p>
                        <p><span>Είδος:</span> {pet.species}</p>
                        <p><span>Ράτσα:</span> {pet.breed}</p>
                        <p><span>Φύλο:</span> {pet.gender}</p>
                        <p><span>Microchip:</span> {pet.microchip}</p>
                        <p><span>Ημερομηνία Γέννησης:</span> {pet.birthdate || "-"}</p>
                        <p><span>Ηλικία:</span> {pet.age || "-"}</p>

                      </div>

                      <div className="info-box2">
                        <h4>Στοιχεία Ιδιοκτήτη</h4>
                        {owner ? (
                          <>
                            <p><span>Όνομα:</span> {owner.firstname} {owner.lastname}</p>
                            <p><span>ΑΦΜ:</span> {owner.afm}</p>
                            <p><span>Διεύθυνση:</span> {owner.address}</p>
                            <p><span>Τηλέφωνο:</span> {owner.phone}</p>
                            <p><span>Email:</span> {owner.email}</p>
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
                <button type="button" onClick={() => setStep(3)} disabled={!pet} >Συνέχεια</button>
              </div>
            </div>
          </>
        )
      }
      {/* ================= STEP 3 ================= */}
      {
        step === 3 && pet && (
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
                <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
              </div>
              <div className="line" />

              <div className="step">
                <div className="circle">4</div>
                <div className="step-title">Προεπισκόπηση & Υποβολή</div>
              </div>
            </div>

            <div className="found-form">
              <h3>Στοιχεία Εύρεσης</h3>

              <label>
                Ημερομηνία *
                <input
                  type="date"
                  value={foundInfo.date}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFoundInfo({ ...foundInfo, date: e.target.value })
                  }
                />
                {errors.date && <p className="error-text">{errors.date}</p>}
              </label>
              <label>
                Περιοχή (Νομός) *
                <select
                  value={foundInfo.region}
                  onChange={(e) =>
                    setFoundInfo({ ...foundInfo, region: e.target.value })
                  }
                >
                  <option value="">Επιλέξτε...</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.region && <p className="error-text">{errors.region}</p>}
              </label>


              <label>
                <input
                  type="text"
                  placeholder="Π.χ. Σύνταγμα"
                  value={foundInfo.address}
                  onChange={(e) =>
                    setFoundInfo({ ...foundInfo, address: e.target.value })
                  } />
              </label>

              <label>
                <textarea
                  placeholder="Π.χ. Υγιές, φοβισμένο..."
                  rows={4}
                  value={foundInfo.condition}
                  onChange={(e) =>
                    setFoundInfo({ ...foundInfo, condition: e.target.value })
                  }
                ></textarea>
              </label>

              <div>
                <button type="button">Προσθήκη Πρόσφατης Φωτογραφίας</button>
              </div>

              <div className="form-buttons">
                <button onClick={handleCancel}>
                  Ακύρωση
                </button>
                <button type="button" onClick={validate3}>Συνέχεια</button>
              </div>
            </div>
          </>
        )
      }
      {
        step === 4 && pet && (
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
                <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
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
                      src={pet.photoUrl}
                      alt={pet.name}
                    />
                  </div>

                  <div className="booklet-top">
                    <div className="info-box">
                      <h4>Στοιχεία Κατοικιδίου</h4>
                      <p><span>Όνομα:</span> {pet.name}</p>
                      <p><span>Είδος:</span> {pet.species}</p>
                      <p><span>Ράτσα:</span> {pet.breed}</p>
                      <p><span>Φύλο:</span> {pet.gender}</p>
                      <p><span>Microchip:</span> {pet.microchip}</p>
                      <p><span>Ημερομηνία Γέννησης:</span> {pet.birthdate || "-"}</p>
                      <p><span>Ηλικία:</span> {pet.age || "-"}</p>
                    </div>

                    <div className="info-box">
                      <h4>Στοιχεία Ιδιοκτήτη</h4>
                      {owner ? (
                        <>
                          <p><span>Όνομα:</span> {owner.firstname} {owner.lastname}</p>
                          <p><span>ΑΦΜ:</span> {owner.afm}</p>
                          <p><span>Διεύθυνση:</span> {owner.address}</p>
                          <p><span>Τηλέφωνο:</span> {owner.phone}</p>
                          <p><span>Email:</span> {owner.email}</p>
                        </>
                      ) : (
                        <p>Φόρτωση στοιχείων ιδιοκτήτη...</p>
                      )}
                    </div>

                    <div className="info-box">
                      <h4>Στοιχεία Απώλειας</h4>
                      <p><span>Ημερομηνία:</span> {foundInfo.date}</p>
                      <p><span>Περιοχή:</span> {foundInfo.region}</p>
                      <p><span>Διεύθυνση:</span> {foundInfo.address || "-"}</p>
                      <p><span>Κατάσταση Ζώου:</span> {foundInfo.condition || "-"}</p>
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
