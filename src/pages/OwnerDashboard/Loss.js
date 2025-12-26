import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import PetDetails from "../../components/Pet/Pet";
import dog from "../../images/lostPet1.png";
import "./PetReport.css";

export default function Found() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [selectedPetId, setSelectedPetId] = useState(null); // προσωρινά, δείχνουμε Barbie πάντα

  const [foundInfo, setFoundInfo] = useState({
    date: "",
    region: "",
    address: "",
    condition: "",
  });

  const pets = [
    {
      id: 1,
      name: "Barbie",
      photoUrl: dog,
      microchip: "123456789",
      species: "Σκύλος",
      breed: "Golden Retriever",
      gender: "Θηλυκό",
      lastSeenDate: "12/10/2025",
      region: "Αττική",
      lastSeenAddress: "Σύνταγμα, Αθήνα",
    },
  ];

  const selectedPet = pets.find((p) => p.id === selectedPetId);

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
      {step === 2 && (
        <>
          <div className="stepper">
            <div
              className="step clickable"
              onClick={() => setStep(1)}
            >
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>

            <div className="line" />

            <div
              className="step clickable"
              onClick={() => setStep(2)}
            >
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>

            <div className="line" />

            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Προεπισκόπηση και Υποβολή</div>
            </div>
          </div>
          
         <div className="found-form">
          <h3>Στοιχεία Απώλειας</h3>

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
              <option value="Αττική">Αττική</option>
              <option value="Θεσσαλονίκη">Θεσσαλονίκη</option>
              {/* Περισσότερες περιοχές */}
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
            <button type="button" onClick={() => setStep(1)}>Ακύρωση</button>
            <button type="button" onClick={() => setStep(3)}>Συνέχεια</button>
          </div>
        </div>
      </>
      )}
      {step === 3 && (
        <>
          <div className="stepper">
            <div
              className="step clickable"
              onClick={() => setStep(1)}
            >
              <div className="circle">1</div>
              <div className="step-title">Επιλογή κατοικιδίου</div>
            </div>

            <div className="line" />

            <div
              className="step clickable"
              onClick={() => setStep(2)}
            >
              <div className="circle">2</div>
              <div className="step-title">Εισαγωγή στοιχείων απώλειας</div>
            </div>

            <div className="line" />

            <div
              className="step clickable"
              onClick={() => setStep(3)}
            >
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
                    <p><span>Ημερομηνία:</span> {selectedPet.lastSeenDate}</p>
                    <p><span>Περιοχή:</span> {selectedPet.region}</p>
                    <p><span>Διεύθυνση:</span> {selectedPet.lastSeenAddress}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> Ελένη Τόντου</p>
                    <p><span>ΑΦΜ:</span> 123456789</p>
                    <p><span>Διεύθυνση:</span> Ζωγράφου 6, Αττική</p>
                    <p><span>Τηλέφωνο:</span> 123456789</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Απώλειας</h4>
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
