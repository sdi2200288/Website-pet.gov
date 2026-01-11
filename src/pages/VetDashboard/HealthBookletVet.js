import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HealthBookletVet.css";

export default function HealthBookletVet() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = βιβλιάριο
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [microchip, setMicrochip] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const vet = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  // Αναζήτηση κατοικιδίου με βάση το microchip
  const handleSearchByMicrochip = async () => {
    if (!microchip.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3001/pets?microchip=${microchip}`
      );
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      if (data.length === 0) {
        setError("Δεν βρέθηκε κατοικίδιο με αυτό το microchip");
      } else {
        setSelectedPetId(data[0].id);
        setStep(2);
      }
    } catch (err) {
      setError("Σφάλμα κατά την αναζήτηση");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const goToStep = (targetStep) => {
    if (!vet || vet.role !== "vet") {
      window.location.href = "/login";
      return;
    }
    setStep(targetStep);
    setError("");
  };

  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth"});
  }, [step]);

  // Fetch pets και medicalReports
  useEffect(() => {
    if (!vet || vet.role !== "vet") return;

    Promise.all([
      fetch(`http://localhost:3001/pets?vetId=${vet.id}`).then((res) =>
        res.json()
      ),
      fetch(`http://localhost:3001/medicalReports`).then((res) => res.json()),
    ])
      .then(([petsData, medicalReports]) => {
        // Ενσωμάτωση medicalReports σε κάθε pet
        const petsWithActs = petsData.map((pet) => ({
          ...pet,
          medicalActs: medicalReports.filter((m) => m.petId === pet.id),
        }));
        setPets(petsWithActs);
        if (petsWithActs.length > 0) setSelectedPetId(petsWithActs[0].id);
      })
      .catch(() => setPets([]));
  }, [vet]);

  return (
    <div className="health-booklet">
      {/* STEP 0 */}
      {step === 0 && (
        <>
        <div className="step0-wrapper">
          <div className="stepper">
            <div className="step">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βήμα επιλέγετε το κατοικίδιο που θέλετε να δείτε ή να
                εκτυπώσετε το βιβλιάριό του.
              </span>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">2</div>
              <span>Στο δεύτερο βήμα προβάλλεται το βιβλιάριο υγείας.</span>
            </div>
          </div>

          <button className="next-btn" onClick={() => goToStep(1)}>
            Συνέχεια
          </button>
          </div>
        </>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="stepper">
            <div className="step active">
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προβολή-Εκτύπωση Βιβλιαρίου</div>
            </div>
          </div>

          <h3>Εισάγετε τον αριθμό microchip του κατοικιδίου</h3>
          <div className="chip-search">
            <input
              className="chip-input"
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
              placeholder="Εισάγετε αριθμό microchip..."
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {loading && <p>Αναζήτηση...</p>}

          <div style={{ marginTop: "20px" }}>
            <button
              className="next-btn"
              onClick={handleSearchByMicrochip}
              disabled={loading || !microchip.trim()}
            >
              {loading ? "Αναζήτηση..." : "Συνέχεια"}
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />
            <div className="step active">
              <div className="circle">2</div>
              <div className="step-title">Προβολή-Εκτύπωση Βιβλιαρίου</div>
            </div>
          </div>

          {selectedPet ? (
            <div className="booklet-container">
              <h3>Βιβλιάριο Κατοικιδίου</h3>

              <div className="booklet-layout">
                <div className="booklet-header">
                  <div className="pet-photo">
                    <img
                      src={selectedPet.photoUrl || "/images/default.png"}
                      alt={selectedPet.name}
                    />
                  </div>

                  <div className="booklet-top">
                    <div className="info-box">
                      <h4>Βασικά Στοιχεία</h4>
                      <p>
                        <span>Όνομα:</span> {selectedPet.name}
                      </p>
                      <p>
                        <span>Είδος:</span> {selectedPet.species}
                      </p>
                      <p>
                        <span>Ράτσα:</span> {selectedPet.breed}
                      </p>
                      <p>
                        <span>Φύλο:</span> {selectedPet.gender}
                      </p>
                      <p>
                        <span>Microchip:</span> {selectedPet.microchip}
                      </p>
                    </div>

                    <div className="info-box">
                      <h4>Στοιχεία Ιδιοκτήτη</h4>
                      <p>
                        <span>Όνομα:</span>{" "}
                        {selectedPet.owner?.firstname || "-"}{" "}
                        {selectedPet.owner?.lastname || ""}
                      </p>
                      <p>
                        <span>ΑΦΜ:</span> {selectedPet.owner?.afm || "-"}
                      </p>
                      <p>
                        <span>Διεύθυνση:</span> {selectedPet.owner?.address || "-"}
                      </p>
                      <p>
                        <span>Τηλέφωνο:</span> {selectedPet.owner?.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="booklet-bottom">
                  <div className="info-box large">
                    <h4>Ιατρικές Πράξεις</h4>
                    {selectedPet.medicalActs?.length === 0 ? (
                      <p className="empty">— Δεν υπάρχουν καταχωρήσεις —</p>
                    ) : (
                      <ul>
                        {selectedPet.medicalActs.map((act, idx) => (
                          <li key={idx}>
                            <strong>{act.date}:</strong> {act.type} —{" "}
                            {act.description}{" "}
                            {act.medications && `— Φάρμακα: ${act.medications}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <button className="next-btn" onClick={() => window.print()}>
                Εκτύπωση
              </button>
            </div>
          ) : (
            <p className="error-message">
              Δεν βρέθηκε κατοικίδιο. Παρακαλώ επιστρέψτε στο προηγούμενο
              βήμα και δοκιμάστε ξανά.
            </p>
          )}
        </>
      )}
    </div>
  );
}
