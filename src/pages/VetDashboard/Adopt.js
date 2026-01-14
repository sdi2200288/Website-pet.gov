import React, { useEffect,useState } from "react";
// import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// import PetDetails from "../../components/Pet/Pet";0
import dog from "../../images/lostPet1.png";
import "./Adopt.css";

export default function Adopt() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ownerInfo, setOwnerInfo] = useState({
    afm: "",
    email: "",
    phone: "",
  });

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

  const handleSearchByMicrochip = async () => {
    if (!microchip) {
      alert("Εισάγετε αριθμό microchip");
      return;
    }

    setLoading(true);
    setError("");

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

      setSelectedPet(data[0]);
      setStep(2);
    } catch (err) {
      alert("Σφάλμα αναζήτησης");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!selectedPet) return;

    const report = {
      petId: selectedPet.id,
      microchip: selectedPet.microchip,
      vetId: vet.id,
      ownerAfm: ownerInfo.afm,
      ownerEmail: ownerInfo.email,
      ownerPhone: ownerInfo.phone,
      status, // draft | submitted
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/adoptionReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });

      if (res.ok) {
        alert(
          `Η δήλωση ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`
        );
        // Reset
        setStep(0);
        setSelectedPet(null);
        setMicrochip("");
        setOwnerInfo({ afm: "", email: "", phone: "" });
        setError("");

        // Μετάβαση στην αρχικη
        navigate("/vet-dashboard");
      } else {
        throw new Error("Σφάλμα στην αποθήκευση");
      }
    } catch {
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
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

  // Έλεγχος αν όλα τα υποχρεωτικά πεδία είναι συμπληρωμένα
  const isFormValid = () => {
    return (
      ownerInfo.afm.trim() !== "" &&
      ownerInfo.email.trim() !== "" &&
      ownerInfo.phone.trim() !== "" &&
      validateAFM(ownerInfo.afm) &&
      validatePhone(ownerInfo.phone)
    );
  };

  return (
    <div className="adopt">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step step-zero">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βημα, θα επιλέξετε το microchip του κατοικίδιου που είναι προς υιοθεσία και βρίσκεται υπό την προστασία σας.
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
                Στο τρίτο βήμα θα συμπληρώσετε τα στοιχεία του ιδιοκτήτη (ΑΦΜ, όνομα, τηλέφωνο).
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
              <div className="step-title">Εισαγωγή στοιχείων ιδιοκτήτη</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>

          <h3>Εισάγετε τον αριθμό microchip τπυ κατοικιδίου</h3>
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
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων ιδιοκτήτη</div>
            </div>
            <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
        <div className="found-form">
          <h3>Βασικά Στοιχεία</h3>

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


          <div className="form-buttons">
            <button type="button" onClick={() => goToStep(1)}>Ακύρωση</button>
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
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Εισαγωγή στοιχείων ιδιοκτήτη</div>
            </div>
             <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
          
         <div className="found-form">
          <h3>Στοιχεία Ιδιοκτήτη</h3>

          <label>
            ΑΦΜ
            <input
                type="text"
                value={ownerInfo.afm}
                onChange={(e) =>
                setOwnerInfo({ ...ownerInfo, afm: e.target.value })
                }
                placeholder="ΑΦΜ"
                maxLength="9"
            />
            {ownerInfo.afm && !validateAFM(ownerInfo.afm) && (
                <span className="error-text">Ο ΑΦΜ πρέπει να έχει ακριβώς 9 ψηφία</span>
            )}
            </label>

            <label>
            Email
            <input
                type="email"
                value={ownerInfo.email}
                onChange={(e) =>
                setOwnerInfo({ ...ownerInfo, email: e.target.value })
                }
                placeholder="example@mail.com"
            />
            </label>

            <label>
            Τηλέφωνο
            <input
                type="tel"
                value={ownerInfo.phone}
                onChange={(e) =>
                setOwnerInfo({ ...ownerInfo, phone: e.target.value })
                }
                placeholder="69XXXXXXXX"
                 maxLength="10"
            />
             {ownerInfo.phone && !validatePhone(ownerInfo.phone) && (
                <span className="error-text">Το τηλέφωνο πρέπει να ξεκινάει με 69 και να έχει 10 ψηφία</span>
              )}
            </label>


          <div className="form-buttons">
            <button type="button" onClick={() => goToStep(2)}>Ακύρωση</button>
            <button type="button" onClick={() => goToStep(4)}>Συνέχεια</button>
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
              <div className="step-title">Εισαγωγή στοιχείων ιδιοκτήτη</div>
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
                        <h4>Βασικά Στοιχεία Κατοικιδίου</h4>
                        <p><span>Όνομα:</span> {selectedPet.name}</p>
                        <p><span>Είδος:</span> {selectedPet.species}</p>
                        <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                        <p><span>Φύλο:</span> {selectedPet.gender}</p>
                        <p><span>Microchip:</span> {selectedPet.microchip}</p>
                        <p><span>Ημερομηνία:</span> {selectedPet.birthdate}</p>
                        <p><span>Περιοχή:</span> {selectedPet.region}</p>
                    </div>

                    <div className="info-box">
                        <h4>Στοιχεία Ιδιοκτήτη</h4>
                        <p><span>ΑΦΜ:</span> {ownerInfo.afm}</p>
                        <p><span>Email:</span> {ownerInfo.email}</p>
                        <p><span>Τηλέφωνο:</span> {ownerInfo.phone}</p>
                    </div>
                </div>
              </div>

            </div>

            <div className="form-buttons">
              <button type="button" onClick={() => goToStep(3)}>Ακύρωση</button>
              <button type="button" onClick={() => handleSubmit("draft")}>Προσωρινή Αποθήκευση</button>
              <button type="button"nClick={() => handleSubmit("submitted")}>Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
