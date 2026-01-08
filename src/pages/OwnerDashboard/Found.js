import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetDetails from "../../components/Pet/Pet";
import "./PetReport.css";
import { REGIONS } from "../Utils/Util";

export default function Found() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [errors, setErrors] = useState({});
  const [foundInfo, setFoundInfo] = useState({
    date: "",
    region: "",
    address: "",
    condition: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const goToStep = (targetStep) => {
    if (!user) {
      window.location.href = "/login"; // redirect αν δεν υπάρχει user
      return;
    }
    setStep(targetStep);
  };


  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/pets?ownerId=${user.id}&lost=true`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch(() => setPets([]));
  }, [user]);

  const handleSubmit = async (status) => {
    if (!selectedPet) return;

    const report = {
      petId: selectedPet.id,
      date: foundInfo.date,
      region: foundInfo.region,
      address: foundInfo.address,
      condition: foundInfo.condition,
      status, // 'draft' ή 'submitted'
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    }

    try {
      const res = await fetch("http://localhost:3001/foundReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error("POST foundReports failed");

      if (status === "submitted") {
        const petUpdate = await fetch(
          `http://localhost:3001/pets/${selectedPet.id}`,
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
      setSelectedPetId(null);
      setFoundInfo({ date: "", region: "", address: "", condition: "" });
      // Μετάβαση στην αρχικη
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
    if (!foundInfo.date) newErrors.date = "Πρέπει να επιλέξετε ημερομηνία";
    if (!foundInfo.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";
    if (foundInfo.date && selectedPet?.lastSeenDate) {
      const foundDate = new Date(foundInfo.date);
      const lastSeenDate = new Date(selectedPet.lastSeenDate);
      if (foundDate < lastSeenDate) {
        newErrors.date = "Η ημερομηνία πρέπει να είναι μετά την τελευταία εξαφάνιση του κατοικιδίου";
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
    setFoundInfo({
      date: "",
      region: "",
      address: "",
      condition: "",
    });
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
                Στο πρώτο βήμα θα επιλέξετε από τη λίστα το κατοικίδιο που βρέθηκε και βρίσκεται υπό την προστασία σας.
              </span>
            </div>
            <div className="line" />

            <div className="step step-zero">
              <div className="circle">2</div>
              <span>
                Στο δεύτερο βήμα θα συμπληρώσετε τα στοιχεία της εύρεσης (ημερομηνία, τοποθεσία, φωτογραφία).
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
              <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
            </div>
          </div>

          <h3>Επιλέξτε το κατοικίδιο που βρέθηκε</h3>
          <div className="pets-grid">
            {pets.length === 0 && <p>Δεν έχετε καταχωρίσει κατοικίδια.</p>}
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`pet-card-wrapper ${selectedPetId === pet.id ? "selected" : ""}`}
                onClick={() => setSelectedPetId(pet.id)}
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
          <button
            className="next-btn"
            onClick={validate1}
          >
            Συνέχεια
          </button>
        </>
      )
      }

      {/* ================= STEP 2 ================= */}
      {
        step === 2 && selectedPet && (
          <>
            <div className="stepper">
              <div className="step clickable" onClick={() => setStep(1)}>
                <div className="circle">1</div>
                <div className="step-title">Επιλογή κατοικιδίου</div>
              </div>
              <div className="line" />

              <div className="step active" >
                <div className="circle">2</div>
                <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
              </div>
              <div className="line" />

              <div className="step">
                <div className="circle">3</div>
                <div className="step-title">Προεπισκόπηση και Υποβολή</div>
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
                Διεύθυνση
                <input
                  type="text"
                  placeholder="Π.χ. Σύνταγμα"
                  value={foundInfo.address}
                  onChange={(e) =>
                    setFoundInfo({ ...foundInfo, address: e.target.value })
                  } />
              </label>

              <label>
                Κατάσταση Ζώου
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
                <button type="button" onClick={validate2}>Συνέχεια</button>
              </div>
            </div>
          </>
        )
      }
      {
        step === 3 && selectedPet && (
          <>
            <div className="stepper">
              <div className="step clickable" onClick={() => setStep(1)}>
                <div className="circle">1</div>
                <div className="step-title">Επιλογή κατοικιδίου</div>
              </div>
              <div className="line" />

              <div className="step clickable" onClick={() => setStep(2)}>
                <div className="circle">2</div>
                <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
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
                    <img src={selectedPet.photoUrl} alt={selectedPet.name} />
                  </div>

                  <div className="booklet-top">
                    <div className="info-box">
                      <h4>Βασικά Στοιχεία Κατοικιδίου</h4>
                      <p><span>Όνομα:</span> {selectedPet.name}</p>
                      <p><span>Είδος:</span> {selectedPet.species}</p>
                      <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                      <p><span>Φύλο:</span> {selectedPet.gender}</p>
                      <p><span>Microchip:</span> {selectedPet.microchip}</p>
                      <p><span>Ημερομηνία Γέννησης:</span> {selectedPet.date || "-"}</p>
                      <p><span>Ηλικία:</span> {selectedPet.age || "-"}</p>
                    </div>

                    <div className="info-box">
                      <h4>Στοιχεία Ιδιοκτήτη</h4>
                      <p><span>Όνομα:</span> {user.firstname} {user.lastname} </p>
                      <p><span>ΑΦΜ:</span>{user.afm} </p>
                      <p><span>Διεύθυνση:</span> {user.address}</p>
                      <p><span>Τηλέφωνο:</span> {user.phone}</p>
                      <p><span>Email:</span> {user.email}</p>
                    </div>

                    <div className="info-box">
                      <h4>Στοιχεία Εύρεσης</h4>
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
