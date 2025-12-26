import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import PetDetails from "../../components/Pet/Pet";
import dog from "../../images/lostPet1.png";
import "./Anadoxi.css";

export default function Anadoxi() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = επιλογή, 2 = φόρμα, 3 = προεπισκόπηση
  const [selectedPetId] = useState(1); // προσωρινά, δείχνουμε Barbie πάντα

    const [ownerInfo, setOwnerInfo] = useState({
    afm: "",
    email: "",
    phone: "",
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
    <div className="anadoxi">
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
                Στο τρίτο βήμα θα συμπληρώσετε τα στοιχεία του αναδόχου (ΑΦΜ, όνομα, τηλέφωνο).
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
              <div className="step-title">Εισαγωγή στοιχείων αναδοχής</div>
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
              type="text"
              placeholder="Εισάγετε αριθμό microchip..."
              className="chip-input"
            />
            <button className="chip-button" aria-label="Αναζήτηση">
              <FiSearch size={22} />
            </button>
          </div>
          <button
            className="next-btn"
            onClick={() => setStep(2)}
          >
            Συνέχεια
          </button>
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
              <div className="step-title">Εισαγωγή στοιχείων αναδοχής</div>
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
            <p className="value">5 ετών</p>
          </div>

          <div>
            <p className="label">Είδος</p>
            <p className="value">{selectedPet.species}</p>

            <p className="label">Ράτσα</p>
            <p className="value">{selectedPet.breed}</p>

            <p className="label">Ημερ. Γέννησης</p>
            <p className="value">12/12/2004</p>
          </div>

          <div>
            <p className="label">Microchip</p>
            <p className="value">{selectedPet.microchip}</p>
          </div>
        </div>


          <div className="form-buttons">
            <button type="button" onClick={() => setStep(1)}>Ακύρωση</button>
            <button type="button" onClick={() => setStep(3)}>Συνέχεια</button>
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
              <div className="step-title">Εισαγωγή στοιχείων αναδοχής</div>
            </div>

             <div className="line" />

            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση & Υποβολή</div>
            </div>
          </div>
          
         <div className="found-form">
          <h3>Στοιχεία Αναδόχου</h3>

          <label>
            ΑΦΜ
            <input
                type="text"
                value={ownerInfo.afm}
                onChange={(e) =>
                setOwnerInfo({ ...ownerInfo, afm: e.target.value })
                }
                placeholder="ΑΦΜ"
            />
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
            />
            </label>


          <div className="form-buttons">
            <button type="button" onClick={() => setStep(2)}>Ακύρωση</button>
            <button type="button" onClick={() => setStep(4)}>Συνέχεια</button>
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
              <div className="step-title">Εισαγωγή στοιχείων αναδοχής</div>
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
                        <p><span>Ημερομηνία:</span> {selectedPet.lastSeenDate}</p>
                        <p><span>Περιοχή:</span> {selectedPet.region}</p>
                        <p><span>Διεύθυνση:</span> {selectedPet.lastSeenAddress}</p>
                    </div>

                    <div className="info-box">
                        <h4>Στοιχεία Αναδόχου</h4>
                        <p><span>ΑΦΜ:</span> {ownerInfo.afm}</p>
                        <p><span>Email:</span> {ownerInfo.email}</p>
                        <p><span>Τηλέφωνο:</span> {ownerInfo.phone}</p>
                    </div>
                </div>
              </div>

            </div>

            <div className="form-buttons">
              <button type="button" onClick={() => setStep(3)}>Ακύρωση</button>
              <button type="button">Προσωρινή Αποθήκευση</button>
              <button type="button">Οριστική Υποβολή</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
