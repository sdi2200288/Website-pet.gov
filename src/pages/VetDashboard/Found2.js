import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { REGIONS} from "../Utils/Util";
import PetDetails from "../../components/Pet/Pet";
import "./Found2.css";

export default function Found2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [microchip, setMicrochip] = useState("");
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foundInfo, setFoundInfo] = useState({
    date: "",
    region: "",
    address: "",
    condition: "",
  });
  
  // const selectedPet = pets.find((p) => p.id === selectedPetId);
  const vet = JSON.parse(localStorage.getItem("user")); // role: vet

  const goToStep = (targetStep) => {
    // const user = JSON.parse(localStorage.getItem("user"));
    if (!vet) {
      // navigate("/login"); // redirect αν δεν υπάρχει user
      window.location.href = "/login";
      return;
    }

    if (vet.role !== "vet") {
      window.location.href = "/login";
    return;
  }
    setStep(targetStep);
  };

  // Συνάρτηση για να φορτώνει τον ιδιοκτήτη
  const loadOwnerData = async (ownerId) => {
    try {
      const res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setOwner(ownerData);
      }
    } catch (error) {
      console.error("Σφάλμα φόρτωσης ιδιοκτήτη:", error);
    }
  };

  const handleSearchByMicrochip = async () => {
  if (!microchip) {
    alert("Εισάγετε αριθμό microchip");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `http://localhost:3001/pets?microchip=${microchip}`
    );
    const data = await res.json();

    if (!data.length) {
      alert("Δεν βρέθηκε κατοικίδιο με αυτό το microchip");
      setLoading(false);
      return;
    }

    // setPet(data[0]);
    const foundPet = data[0];
      setPet(foundPet);
      
      // Φόρτωση των στοιχείων του ιδιοκτήτη
      await loadOwnerData(foundPet.ownerId);
    setStep(2);
  } catch (err) {
    alert("Σφάλμα αναζήτησης");
  } finally {
    setLoading(false);
  }
};

// useEffect(() => {
//   if (!vet) return;
  
//   fetch(`http://localhost:3001/pets?ownerId=${vet.id}`)
//     .then((res) => res.json())
//     .then((data) => setVetPets(data))  // Αποθήκευση σε ξεχωριστό state
//     .catch(() => setVetPets([]));
// }, [vet]);
    
  
const handleSubmit = async (status) => {
    if (!pet) return;

    const report = {
      petId: pet.id,
      vetId: vet.id,
      date: foundInfo.date,
      region: foundInfo.region,
      address: foundInfo.address,
      condition: foundInfo.condition,
      status,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3001/foundReports", {
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
        setPet(null);
        setOwner(null);
        setMicrochip("");
        setFoundInfo({ date: "", region: "", address: "", condition: "" });

        // Μετάβαση στην αρχικη
        navigate("/vet-dashboard");
      }
    } catch {
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    }
  };

  return (
    <div className="found">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
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

          <h3>Εισάγετε τον αριθμό microchip του κατοικιδίου</h3>

          {/* <div className="chip-search">
            <input
              type="text"
              className="chip-input"
              placeholder="Εισάγετε αριθμό microchip..."
              value={microchip}
              onChange={(e) => setMicrochip(e.target.value)}
            />
            <button className="chip-button" onClick={handleSearchByMicrochip}>
              <FiSearch size={22} />
            </button>
          </div> */}
          <div className="chip-search">
          <input
            className="chip-input"
            value={microchip}
            onChange={(e) => setMicrochip(e.target.value)}
            placeholder="Εισάγετε αριθμό microchip..."
          /> 
        </div>
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

      {/* ================= STEP 2 =================
      {step === 2 && pet && (
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

          <div className="profile-grid">
          <div>
            <p className="label">Όνομα</p>
            <p className="value"> {pet.name}</p>

            <p className="label">Φύλο</p>
            <p className="value">{pet.gender}</p>

            <p className="label">Είδος</p>
            <p className="value">{pet.species}</p>
          </div>
          <div>
            <p className="label">Ράτσα</p>
            <p className="value">{pet.breed}</p>

            <p className="label">Ημερ. Γέννησης</p>
            <p className="value">{pet.birthdate}</p>
          </div>

          <div>
            <p className="label">Microchip</p>
            <p className="value">{pet.microchip}</p>
          </div>
        </div>


          <div className="form-buttons">
            <button type="button" onClick={() => goToStep(1)}>Ακύρωση</button>
            <button type="button" onClick={() => goToStep(3)}>Συνέχεια</button>
          </div>
        </div>
            </>
      )} */}
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
        <div className="profile-grid">
          <div>
            <p className="label">Όνομα</p>
            <p className="value"> {pet.name}</p>

            <p className="label">Φύλο</p>
            <p className="value">{pet.gender}</p>

            <p className="label">Είδος</p>
            <p className="value">{pet.species}</p>
          </div>
          <div>
            <p className="label">Ράτσα</p>
            <p className="value">{pet.breed}</p>

            <p className="label">Ημερ. Γέννησης</p>
            <p className="value">{pet.birthdate}</p>
          </div>

          <div>
            <p className="label">Microchip</p>
            <p className="value">{pet.microchip}</p>
          </div>
        </div>
      ) : (
        /* Εάν ΔΕΝ υπάρχει pet, δείξε μήνυμα και πεδίο αναζήτησης */
        <div>
          <p> Δεν έχει βρεθεί κατοικίδιο ακόμα...</p>
        </div>
      )}

      <div className="form-buttons">
        <button type="button" onClick={() => goToStep(1)}>Ακύρωση</button>
        {/* Το κουμπί "Συνέχεια" στο βήμα 2 ενεργοποιείται ΜΟΝΟ αν υπάρχει pet */}
        <button 
          type="button" 
          onClick={() => goToStep(3)}
          disabled={!pet}  // Απενεργοποιημένο αν δεν υπάρχει pet
        >
          Συνέχεια
        </button>
      </div>
    </div>
  </>
)}
      {/* ================= STEP 3 ================= */}
      {step === 3 && pet &&(
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
            Ημερομηνία
             <input
              type="date"
              value={foundInfo.date}
              onChange={(e) =>
                setFoundInfo({ ...foundInfo, date: e.target.value })
              }
            />
          </label>

          <label>
            Περιοχή (Νομός)
            <select
              value={foundInfo.region}
              onChange={(e) =>
                setFoundInfo({ ...foundInfo, region: e.target.value })
              }
            >
              <option value="">Επιλέξτε...</option>
              {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
            </select>
          </label>

          <label>
            <input
              type="text"
              placeholder="Π.χ. Σύνταγμα"
              value={foundInfo.address}
              onChange={(e) =>
                setFoundInfo({ ...foundInfo, address: e.target.value })
              }/>
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
            <button type="button" onClick={() => goToStep(2)}>Ακύρωση</button>
            <button type="button" onClick={() => goToStep(4)}>Συνέχεια</button>
          </div>
        </div>
      </>
      )}
      {step === 4 && pet &&(
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
                    <h4>Βασικά Στοιχεία Κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {pet.name}</p>
                    <p><span>Είδος:</span> {pet.species}</p>
                    <p><span>Ράτσα:</span> {pet.breed}</p>
                    <p><span>Φύλο:</span> {pet.gender}</p>
                    <p><span>Microchip:</span> {pet.microchip}</p>
                    <p><span>Ημερομηνία:</span> {pet.lastSeenDate}</p>
                    <p><span>Περιοχή:</span> {pet.region}</p>
                    <p><span>Διεύθυνση:</span> {pet.lastSeenAddress}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {owner.firstname} {owner.lastname}</p>
                    <p><span>ΑΦΜ:</span> {owner.afm}</p>
                    <p><span>Διεύθυνση:</span> {owner.address}</p>
                    <p><span>Τηλέφωνο:</span> {owner.phone}</p>
                    <p><span>Email:</span> {owner.email}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Εύρεσης</h4>
                    <p><span>Ημερομηνία:</span> {foundInfo.date}</p>
                    <p><span>Περιοχή:</span> {foundInfo.region}</p>
                    <p><span>Διεύθυνση:</span> {foundInfo.address}</p>
                    <p><span>Κατάσταση Ζώου:</span> {foundInfo.condition}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="form-buttons">
              <button type="button" onClick={() => setStep(3)}>Ακύρωση</button>
              <button type="button" onClick={() => handleSubmit("draft")}>Προσωρινή Αποθήκευση</button>
              <button type="button" onClick={() => handleSubmit("submitted")}>Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
