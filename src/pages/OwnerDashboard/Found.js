import React, { useEffect, useState } from "react";
// import { FiSearch } from "react-icons/fi";
import PetDetails from "../../components/Pet/Pet";
//import dog from "../../images/lostPet1.png";
import "./PetReport.css";

export default function Found() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [selectedPetId, setSelectedPetId] = useState(null); // προσωρινά, δείχνουμε Barbie πάντα
  const [pets, setPets] = useState([]);

  const [foundInfo, setFoundInfo] = useState({
    date: "",
    region: "",
    address: "",
    condition: "",
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedPet = pets.find((p) => p.id === selectedPetId);

  // Προστασία route
  useEffect(() => {
    if(!user || user.role !== "owner"){
      window.location.href = "/login";
      return null;
    }
   }, [user]);
  
  // Fetch pets του ιδιοκτήτη
  useEffect(() => {
    if (!user) return;
  
    fetch(`http://localhost:3001/pets?ownerId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch(() => setPets([]));
    }, [user]);
    
    const handleSubmit = async (status) => {
      if(!selectedPet){
        alert("Επιλέξτε πρώτα ένα κατοικίδιο!");
        return;
      }
  
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
        if (res.ok) {
          alert(
            `Η δήλωση ${status === "draft" ? "αποθηκεύτηκε προσωρινά" : "υποβλήθηκε"}!`
          );
          // Reset
          setStep(0);
          setSelectedPetId(null);
          setFoundInfo({ date: "", region: "", address: "", condition: "" });
        }
      }catch (err) {
        alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
      }
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

          <button className="next-btn" onClick={() => setStep(1)}>
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
          
          <button
            className="next-btn"
            onClick={() => setStep(2)}
          >
            Συνέχεια
          </button>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 2 && selectedPet &&  (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />

            <div className="step clickable"  onClick={() => setStep(2)}>
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
            </div>
            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
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
              <optgroup label="Μακεδονια & Θράκη">
                <option value="Θεσσαλονίκη">Θεσσαλονίκη</option>
                <option value="Σέρρες">Σέρρες</option>
                <option value="Καβάλα">Καβάλα</option>
                <option value="Δράμα">Δράμα</option>
                <option value="Ξάνθη">Ξάνθη</option>
                <option value="Κοζάνη">Κοζάνη</option>
                <option value="Φλώρινα">Φλώρινα</option>
              </optgroup>
              <optgroup label="Θεσσαλία & Στερεά Ελλάδα">
                <option value="Λάρισα">Λάρισα</option>
                <option value="Βόλος">Βόλος</option>
                <option value="Τρίκαλα">Τρίκαλα</option>
                <option value="Καρδίτσα">Καρδίτσα</option>
                <option value="Λαμία">Λαμία</option>
              </optgroup>
              <optgroup label="Ηπείρος & Ιόνια">
                <option value="Άρτα">Άρτα</option>
                <option value="Κέρκυρα">Κέρκυρα</option>
                <option value="Ζάκυνθος">Ζάκυνθος</option>
                <option value="Κεφαλλονιά">Κεφαλλονιά</option>
              </optgroup>
              <optgroup label="Πελοπόννησος & Δυτική Ελλάδα">
                <option value="Πάτρα">Πάτρα</option>
                <option value="Πύργος">Πύργος</option>
                <option value="Τρίπολη">Τρίπολη</option>
                <option value="Καλαμάτα">Καλαμάτα</option>
                <option value="Σπάρτη">Σπάρτη</option>              
                <option value="Κόρινθος">Κόρινθος</option>
                <option value="Αιτωλοακαρνία">Αιτωλοακαρνία</option>
              </optgroup>
              <optgroup label="Αττική">
                <option value="Αθήνα">Αθήνα (Κέντρο)</option>
                <option value="Βόρεια Προάστεια">Βόρεια Προάστεια</option>
                <option value="Νότια Προάστεια">Νότια Προάστεια</option>
                <option value="Δυτικά Προάστεια">Δυτικά Προάστεια</option>
                <option value="Πειραιάς">Πειραιάς</option>       
              </optgroup>
              <optgroup label="Νησιά Αιγαίου">
                <option value="Χίος">Χίος</option>
                <option value="Λέσβος">Λέσβος</option>
                <option value="Σάμος">Σάμος</option>
                <option value="Ρόδος">Ρόδος</option>
                <option value="Κως">Κως</option>
                <option value="Μύκονος">Μύκονος</option>
                <option value="Σαντορίνη">Σαντορίνη</option>
            </optgroup>
            <optgroup label="Κρήτη">
              <option value="Ηράκλειο">Ηράκλειο</option>
              <option value="Χανιά">Χανιά</option>
              <option value="Ρέθυμνο">Ρέθυμνο</option>
              <option value="Λασίθι">Λασίθι (Αγ. Νικόλαος)</option>
            </optgroup>
            </select>
          </label>

          <label>
            Διεύθυνση
            <input
              type="text"
              placeholder="Π.χ. Σύνταγμα"
              value={foundInfo.address}
              onChange={(e) =>
                setFoundInfo({ ...foundInfo, address: e.target.value })
              }/>
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
            <button type="button" onClick={() => setStep(1)}>Ακύρωση</button>
            <button type="button" onClick={() => setStep(3)}>Συνέχεια</button>
          </div>
        </div>
      </>
      )}
      {step === 3 && selectedPet &&  (
        <>
          <div className="stepper">
            <div className="step clickable"  onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>
            <div className="line" />

            <div className="step clickable" onClick={() => setStep(2)}>
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων εύρεσης</div>
            </div>
            <div className="line" />

            <div className="step clickable" onClick={() => setStep(3)}>
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
                    <p><span>Ημερομηνία Τελευταίας Εύρεσης:</span> {selectedPet.lastSeenDate}</p>
                    <p><span>Περιοχή:</span> {selectedPet.region}</p>
                    <p><span>Διεύθυνση:</span> {selectedPet.lastSeenAddress}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {user.firstname} {user.lastname} </p>
                    <p><span>ΑΦΜ:</span>{user.afm} </p>
                    <p><span>Διεύθυνση:</span> {user.address}</p>
                    <p><span>Τηλέφωνο:</span> {user.phone}</p>
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
              <button type="button" onClick={() => setStep(2)}>Ακύρωση</button>
              <button type="button">Προσωρινή Αποθήκευση</button>
              <button type="button">Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
