import React, { useEffect, useState, useRef } from "react";
// import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { REGIONS } from "../Utils/Util";
import { useLocation } from "react-router-dom";
import "./Loss2.css";

export default function Loss2() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const declarationData = location.state?.declarationData;
  const isEdit = !!declarationData;


  const [microchip, setMicrochip] = useState("");
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(location.state?.step ?? 0);

  const [lossInfo, setLossInfo] = useState({
    date: declarationData?.date || "",
    region: declarationData?.region || "",
    address: declarationData?.address || "",
    condition: declarationData?.condition || "",
  });

  const [form, setForm] = useState({
    photoUrl: declarationData?.photoUrl || "",
  });

  const photoInputRef = useRef(null);


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

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setForm((prev) => ({ ...prev, photoUrl: "" }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photoUrl: previewUrl }));
  }


  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!isEdit || !declarationData) return;
    const loadEditData = async () => {
      const petRes = await fetch(`http://localhost:3001/pets/${declarationData.petId}`);
      const petData = await petRes.json();
      setPet(petData);

      await loadOwnerData(declarationData.ownerId);
    };

    loadEditData();
  }, [isEdit, declarationData]);


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
      if (foundPet.lost === true) {
        setErrors({ microchip: "Το κατοικίδιο έχει ήδη ενεργή δήλωση εξαφάνισης" });
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
    if (!pet && !declarationData) return; // αντικαταστήσαμε selectedPet -> pet

    const isEdit = !!declarationData;

    const report = {
      petId: pet?.id || declarationData.petId,
      date: lossInfo.date,
      region: lossInfo.region,
      address: lossInfo.address,
      condition: lossInfo.condition,
      status, // 'draft' ή 'submitted'
      ownerId: declarationData?.ownerId || vet.id, // user -> vet
      createdBy: isEdit ? declarationData.createdBy : vet.id, // user -> vet
      createdAt: isEdit ? declarationData.createdAt : new Date().toISOString(),
      photoUrl: form.photoUrl || declarationData?.photoUrl || "", // vetdefault -> ""
    };

    try {
      let updatedReport;

      if (isEdit) {
        // PATCH υπάρχουσας δήλωσης
        const res = await fetch(`http://localhost:3001/lostReports/${declarationData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        });
        if (!res.ok) throw new Error("PATCH foundReports failed");
        updatedReport = await res.json();
      } else {
        // Νέα δήλωση
        const res = await fetch("http://localhost:3001/lostReports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        });
        if (!res.ok) throw new Error("POST lostReports failed");
        updatedReport = await res.json();
      }

      // Αν είναι οριστική υποβολή, ενημέρωση pet
      if (status === "submitted" && pet) {
        const petUpdate = await fetch(`http://localhost:3001/pets/${pet.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lost: false,
            lastSeenDate: lossInfo.date,
            region: lossInfo.region,
            lastSeenAddress: lossInfo.address,
            condition: lossInfo.condition,
          }),
        });
        if (!petUpdate.ok) throw new Error("PATCH pet failed");
      }

      alert(`Η δήλωση ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`);

      // Εδώ δεν μπορούμε να κάνουμε setFoundDeclarations γιατί δεν υπάρχει στο component
      // Αν θέλεις, μπορείς να κάνεις navigate στο ιστορικό:
      navigate("/vet-dashboard/history");

      // reset φόρμας
      setStep(0);
      setPet(null);
      setOwner(null);
      setLossInfo({ date: "", region: "", address: "", condition: "" });
      setForm({ photoUrl: "" });

    } catch (err) {
      console.error(err);
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
    if (!lossInfo.date) newErrors.date = "Πρέπει να επιλέξετε ημερομηνία";
    if (!lossInfo.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";
    if (!isEdit && lossInfo.date && pet?.lastSeenDate) {
      const lossDate = new Date(lossInfo.date);
      const lastSeenDate = new Date(pet.lastSeenDate);
      if (lossDate < lastSeenDate) {
        newErrors.date = "Η ημερομηνία πρέπει να είναι μετά την τελευταία εμφάνιση του κατοικιδίου";
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
    setLossInfo({ date: "", region: "", address: "", condition: "" });
    setErrors({});
    setForm({ photoUrl: "" });

  };


  return (

    <div className="loss2">
      {/* Breadcrumb μόνο για step 0 */}
      {step === 0 && (
        <nav className="breadcrumb">
          {[
            { label: "Αρχική", path: "/" },
            { label: "Δήλωση Απώλειας", step: 0 },
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
                    Στο πρώτο βημα, θα εισάγετε το microchip του κατοικίδιου που χάθηκε.
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
                    Στο τρίτο βήμα θα συμπληρώσετε τα στοιχεία της απώλειας (ημερομηνία, τοποθεσία, φωτογραφία).
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
      {step === 1 && !isEdit && (
        <div className="step1-container">
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
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
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
        </div>
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
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
          <div className="found-form step-2-wide">
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
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>

            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <div className="found-form">
            <h3>Στοιχεία Απώλειας</h3>

            <label>
              Ημερομηνία *
              <input
                type="date"
                value={lossInfo.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setLossInfo({ ...lossInfo, date: e.target.value })
                }
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </label>


            <label>
              Περιοχή (Νομός) *
              <select
                value={lossInfo.region}
                onChange={(e) =>
                  setLossInfo({ ...lossInfo, region: e.target.value })
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
              Διεύθυνση
              <input
                type="text"
                placeholder="Π.χ. Σύνταγμα"
                value={lossInfo.address}
                onChange={(e) =>
                  setLossInfo({ ...lossInfo, address: e.target.value })
                } />
            </label>

            <label>
              Κατάσταση Ζώου
              <textarea
                placeholder="Π.χ. Υγιές, φοβισμένο..."
                rows={4}
                value={lossInfo.condition}
                onChange={(e) =>
                  setLossInfo({ ...lossInfo, condition: e.target.value })
                }
              ></textarea>
            </label>

            <div>
              <input
                type="file"
                accept="image/*"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="registerSecondaryButton"
                onClick={() => photoInputRef.current?.click()}
              >
                Προσθήκη Φωτογραφίας
              </button>

              {form.photoUrl && (
                <div className="registerPhotoName">Επιλέχθηκε φωτογραφία</div>
              )}
            </div>

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
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
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
                    src={form.photoUrl || pet.photoUrl}
                    alt={pet.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = pet.photoUrl;
                    }}
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
                    <p><span>Ημερομηνία:</span> {lossInfo.date}</p>
                    <p><span>Περιοχή:</span> {lossInfo.region}</p>
                    <p><span>Διεύθυνση:</span> {lossInfo.address || "-"}</p>
                    <p><span>Κατάσταση Ζώου:</span> {lossInfo.condition || "-"}</p>
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
      )}
    </div>
  );
}
