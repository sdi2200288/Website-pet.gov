import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { REGIONS } from "../Utils/Util";
import PetDetails from "../../components/Pet/Pet";
import "./PetReport.css";
import vetdefault from "../../images/vetdeafult.webp";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function Loss() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};

  const [step, setStep] = useState(state.step || 0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [selectedPetId, setSelectedPetId] = useState(state.declarationData?.petId || null);
  const [pets, setPets] = useState([]);
  const [errors, setErrors] = useState({});
  const photoInputRef = useRef(null);
  const [form, setForm] = useState({
    photoUrl: state.declarationData?.photoUrl || "",
  });
  const [lossInfo, setLossInfo] = useState({
    date: state.declarationData?.date || "",
    region: state.declarationData?.region || "",
    address: state.declarationData?.address || "",
    condition: state.declarationData?.condition || "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setForm((prev) => ({ ...prev, photoUrl: "" }));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photoUrl: previewUrl }));
  }

  const goToStep = (targetStep) => {
    if (!user) {
      window.location.href = "/login"; // redirect αν δεν υπάρχει user
      return;
    }
    setStep(targetStep);
  };

  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);


  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:3001/pets?ownerId=${user.id}&lost=false`)
      .then((res) => res.json())
      .then((data) => setPets(Array.isArray(data) ? data : []))
      .catch(() => setPets([]));
  }, [user]);

  const isEdit = !!state.declarationData;

  const handleSubmit = async (status) => {
    if (!selectedPet && !state.declarationData) return;

    const report = {
      petId: selectedPet?.id || state.declarationData.petId,
      date: lossInfo.date,
      region: lossInfo.region,
      address: lossInfo.address,
      condition: lossInfo.condition,
      status, // 'draft' ή 'submitted'
      ownerId: user.id,
      createdBy: isEdit
        ? state.declarationData.createdBy
        : user.id,
      createdAt: isEdit
        ? state.declarationData.createdAt
        : new Date().toISOString(),
      photoUrl: form.photoUrl || state.declarationData?.photoUrl || vetdefault,
    };

    try {
      if (state.declarationData?.id) {
        const res = await fetch(`http://localhost:3001/lostReports/${state.declarationData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        });
        if (!res.ok) throw new Error("PATCH lostReports failed");
      } else {
        // Νέα δήλωση → POST
        const res = await fetch("http://localhost:3001/lostReports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(report),
        });
        if (!res.ok) throw new Error("POST lostReports failed");
      }

      if (status === "submitted") {
        const petId = selectedPet?.id || state.declarationData.petId;
        const petUpdate = await fetch(`http://localhost:3001/pets/${petId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lost: true,
            lastSeenDate: lossInfo.date,
            region: lossInfo.region,
            lastSeenAddress: lossInfo.address,
            condition: lossInfo.condition,
          }),
        });
        if (!petUpdate.ok) throw new Error("PATCH pet failed");
      }
      alert(`Η δήλωση ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`);
      // Reset
      setStep(0);
      setSelectedPetId(null);
      setLossInfo({ date: "", region: "", address: "", condition: "" });
      setForm({ photoUrl: "" });
      // Μετάβαση στο ιστορικό δηλώσεων
      navigate("/owner-dashboard");
    } catch (err) {
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    }
  };

  const validate1 = () => {
    if (!selectedPetId) {
      return;
    }
    goToStep(2);
  };

  const validate2 = () => {
    const newErrors = {};
    if (!lossInfo.date) newErrors.date = "Πρέπει να επιλέξετε ημερομηνία";
    if (!lossInfo.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";

    if (lossInfo.date && selectedPet?.lastSeenDate) {
      const lossDate = new Date(lossInfo.date);
      const lastSeenDate = new Date(selectedPet.lastSeenDate);
      if (lossDate < lastSeenDate) {
        newErrors.date = "Η ημερομηνία πρέπει να είναι μετά την τελευταία εμφάνιση του κατοικιδίου";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    goToStep(3);
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της δήλωσης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;

    setStep(0);
    setSelectedPetId(null);
    setLossInfo({
      date: "",
      region: "",
      address: "",
      condition: "",
    });
    setForm({ photoUrl: "" });
    setErrors({});
  };

  return (
    <div className="report-container ">


      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step step-zero">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βήμα θα επιλέξετε από τη λίστα το κατοικίδιο που χάθηκε και βρίσκεται υπό την προστασία σας.
              </span>
            </div>

            <div className="line" />

            <div className="step step-zero">
              <div className="circle">2</div>
              <span>
                Στο δεύτερο βήμα θα συμπληρώσετε τα στοιχεία της απώλειας (ημερομηνία, τοποθεσία, φωτογραφία).
              </span>
            </div>

            <div className="line" />

            <div className="step step-zero">
              <div className="circle">3</div>
              <span>
                Στο τρίτο και τελευταίο βήμα θα ελέγξετε την προεπισκόπηση της δήλωσης σας και θα επιλέξετε προσωρινή αποθήκευση, υποβολή ή διαγραφή. Με την υποβολή η δήλωση κλειδώνει ενώ οι προσωρινά αποθηκευμένες δηλώσεις εμφανίζονται στο ιστορικό δηλώσεων για μελλοντική επεξεργασία ή υποβολή.
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
              <div className="step-title">Επιλογή κατοικιδίου </div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
            </div>
          </div>

          <h3>Επιλέξτε το κατοικίδιο που χάθηκε</h3>
          <div className="pets-grid">
            {pets.length === 0 && <p>Δεν έχετε καταχωρίσει κατοικίδια.</p>}
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-card-wrapper ${selectedPetId === pet.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedPetId(pet.id);
                }}
              >
                <PetDetails pet={pet} mode={0} selected={selectedPetId === pet.id} />
              </div>
            ))}
          </div>

          {!selectedPetId && (
            <p className="error-text">
              Πρέπει να επιλέξετε κάποιο κατοικίδιο για να συνεχίσετε
            </p>
          )}
          <button className="next-btn" onClick={validate1}>
            Συνέχεια
          </button>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (selectedPet || state.declarationData) && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
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
                onChange={(e) => setLossInfo({ ...lossInfo, date: e.target.value })}
              />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </label>

            <label>
              Περιοχή (Νομός) *
              <select
                value={lossInfo.region}
                onChange={(e) => setLossInfo({ ...lossInfo, region: e.target.value })}
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
                onChange={(e) => setLossInfo({ ...lossInfo, address: e.target.value })}
              />
            </label>

            <label>
              Κατάσταση Ζώου
              <textarea
                placeholder="Π.χ. Υγιές, φοβισμένο..."
                rows={4}
                value={lossInfo.condition}
                onChange={(e) => setLossInfo({ ...lossInfo, condition: e.target.value })}
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
              <button type="button" onClick={() => photoInputRef.current?.click()}>
                Προσθήκη Πρόσφατης Φωτογραφίας
              </button>

              {form.photoUrl && <div className="registerPhotoName">Επιλέχθηκε φωτογραφία</div>}
            </div>

            <div className="form-buttons">
              <button onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={validate2}>
                Συνέχεια
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (selectedPet || state.declarationData) && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />

            <div className="step clickable" onClick={() => setStep(2)}>
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
            </div>
          </div>

          <div className="booklet-container">
            <h3>Προεπισκόπηση Δήλωσης</h3>

            <div className="booklet-layout">
              <div className="booklet-header">
                <div className="pet-photo">
                  <img
                    src={form.photoUrl || selectedPet?.photoUrl || state.declarationData?.photoUrl || vetdefault}
                    alt={selectedPet?.name || state.declarationData?.petName || "Pet"}
                    onError={(e) => { e.target.onerror = null; e.target.src = vetdefault; }}
                  />
                </div>

                <div className="booklet-top">
                  <div className="info-box">
                    <h4>Βασικά Στοιχεία Κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {selectedPet?.name || state.declarationData?.petName || "-"}</p>
                    <p><span>Είδος:</span> {selectedPet?.species || state.declarationData?.species || "-"}</p>
                    <p><span>Ράτσα:</span> {selectedPet?.breed || state.declarationData?.breed || "-"}</p>
                    <p><span>Φύλο:</span> {selectedPet?.gender || state.declarationData?.gender || "-"}</p>
                    <p><span>Microchip:</span> {selectedPet?.microchip || state.declarationData?.microchip || "-"}</p>
                    <p><span>Ημερομηνία Γέννησης:</span> {selectedPet?.birthdate || state.declarationData?.birthdate || "-"}</p>
                    <p><span>Ηλικία:</span> {selectedPet?.age || state.declarationData?.age || "-"}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {user.firstname} {user.lastname}</p>
                    <p><span>ΑΦΜ:</span> {user.afm}</p>
                    <p><span>Διεύθυνση:</span> {user.address}</p>
                    <p><span>Τηλέφωνο:</span> {user.phone}</p>
                    <p><span>Email:</span> {user.email}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Απώλειας</h4>
                    <p><span>Ημερομηνία:</span> {lossInfo.date}</p>
                    <p><span>Περιοχή:</span> {lossInfo.region}</p>
                    <p><span>Διεύθυνση:</span> {lossInfo.address}</p>
                    <p><span>Κατάσταση Ζώου:</span> {lossInfo.condition}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={() => handleSubmit("draft")}>Προσωρινή Αποθήκευση</button>
              <button type="button" onClick={() => handleSubmit("submitted")}>Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
