import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import PetDetails from "../../components/Pet/Pet";
import dog from "../../images/lostPet1.png";
import "./Identity.css";

export default function Identity() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = φόρμα, 2 = προεπισκόπηση
  const [petInfo, setPetInfo] = useState({
    microchip: "",
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    forAdoption: "Όχι",
  });

  const [ownerInfo, setOwnerInfo] = useState({
    afm: "",
    email: "",
    phone: "",
  });

  return (
    <div className="identity">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
            <div className="stepper">
                <div className="step step-zero">
                <div className="circle">1</div>
                <span>
                    Στο πρώτο βήμα θα συμπληρώσετε τα στοιχεία του κατοικιδίου (microchip, όνομα, είδος, ράτσα, ηλικία/ημερομηνία γέννησης, φύλο, φωτογραφία). Αν δεν είναι προς υιοθεσία, θα συμπληρώσετε ΑΦΜ, email και τηλέφωνο ιδιοκτήτη.
                </span>
                </div>

                <div className="line" />
                
                <div className="step step-zero">
                <div className="circle">2</div>
                <span>
                    Στο δεύτερο βήμα θα δείτε την προεπισκόπηση της καταγραφής και θα μπορείτε να την υποβάλετε. Μετά την υποβολή θα δείτε το βιβλιάριο με την επιλογή εκτύπωσης.
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
              <div className="step-title">Δημιουργία προφίλ κατοικιδίου</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">2</div>
              <div className="step-title">Προεπισκόπηση και καταχώρηση</div>
            </div>
          </div>
        {/* <div className="booklet-container"> */}
            <div className="found-form">
            <h3>Εισαγωγή Στοιχείων</h3>

            <label>
              Microchip
              <input
                type="text"
                value={petInfo.microchip}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, microchip: e.target.value })
                }
              />
            </label>

            <label>
              Όνομα
              <input
                type="text"
                value={petInfo.name}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, name: e.target.value })
                }
              />
            </label>

            <label>
              Είδος
              <input
                type="text"
                value={petInfo.species}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, species: e.target.value })
                }
              />
            </label>

            <label>
              Ράτσα
              <input
                type="text"
                value={petInfo.breed}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, breed: e.target.value })
                }
              />
            </label>

            <label>
              Φύλο
              <select
                value={petInfo.gender}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, gender: e.target.value })
                }
              >
                <option value="">Επιλογή</option>
                <option value="Αρσενικό">Αρσενικό</option>
                <option value="Θηλυκό">Θηλυκό</option>
              </select>
            </label>

            <label>
              Ηλικία
              <input
                type="number"
                value={petInfo.age}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, age: e.target.value })
                }
              />
            </label>

            <label>
              Προς Υιοθεσία
              <select
                value={petInfo.forAdoption}
                onChange={(e) =>
                  setPetInfo({ ...petInfo, forAdoption: e.target.value })
                }
              >
                <option value="Ναι">Ναι</option>
                <option value="Όχι">Όχι</option>
              </select>
            </label>

            {petInfo.forAdoption === "Όχι" && (
              <>
                <h3>Στοιχεία Ιδιοκτήτη</h3>

                <label>
                  ΑΦΜ
                  <input
                    type="text"
                    value={ownerInfo.afm}
                    onChange={(e) =>
                      setOwnerInfo({ ...ownerInfo, afm: e.target.value })
                    }
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
                  />
                </label>
                
              </>
            )}
            <div className="form-buttons">
                <button type="button" onClick={() => setStep(2)}>Συνέχεια</button>
            </div>
          </div>
        {/* </div> */}
          
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
            <div className="stepper">
                <div className="step clickable" onClick={() => setStep(1)}>
                <div className="circle">1</div>
                <div className="step-title">Δημιουργία προφίλ κατοικιδίου</div>
                </div>

                <div className="line" />

                <div className="step active">
                <div className="circle">2</div>
                <div className="step-title">Προεπισκόπηση και καταχώρηση</div>
                </div>
            </div>
            <div className= "booklet-container">
                <h3>Προεπισκόπηση Στοιχείων</h3>
                <div className="booklet-layout">
                    <div className="booklet-header">
                        <div className="booklet-top">
                            <div className="info-box">
                                 <div  className="info-pair">
                                    <p className="label">Microchip</p>
                                    <p className="value">{petInfo.microchip}</p>
                                    <p className="label">Όνομα</p>
                                    <p className="value">{petInfo.name}</p>
                                    <p className="label">Είδος</p>
                                    <p className="value">{petInfo.species}</p>
                                    <p className="label">Ράτσα</p>
                                    <p className="value">{petInfo.breed}</p>
                                    <p className="label">Φύλο</p>
                                    <p className="value">{petInfo.gender}</p>
                                    <p className="label">Ηλικία</p>
                                    <p className="value">{petInfo.age}</p>
                                    <p className="label">Προς Υιοθεσία</p>
                                    <p className="value">{petInfo.forAdoption}</p>
                                </div>

                                {petInfo.forAdoption === "Όχι" && (
                                    <div  className="info-pair">
                                    <p className="label">ΑΦΜ</p>
                                    <p className="value">{ownerInfo.afm}</p>
                                    <p className="label">Email</p>
                                    <p className="value">{ownerInfo.email}</p>
                                    <p className="label">Τηλέφωνο</p>
                                    <p className="value">{ownerInfo.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            <div className="form-buttons">
              <button type="button" onClick={() => setStep(1)}>Ακύρωση</button>
              <button type="button">Προσωρινή Αποθήκευση</button>
              <button type="button">Οριστική Υποβολή</button>
            </div>
        </div>
        </>
      )}
    </div>
  );
}
