import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Loss2.css";

export default function Transfer() {
  const navigate = useNavigate();
  const vet = JSON.parse(localStorage.getItem("user"));
  const [step, setStep] = useState(0); // 0 intro, 1 microchip, 2 profile, 3 new owner, 4 preview
  const [microchip, setMicrochip] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentOwner, setCurrentOwner] = useState(null);

  const [newOwnerAFM, setNewOwnerAFM] = useState("");
  const [newOwnerFound, setNewOwnerFound] = useState(null); // { type: "owner"|"vet", data: {...} }
  const [showOwnerRegister, setShowOwnerRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [ownerForm, setOwnerForm] = useState({
    firstname: "",
    lastname: "",
    genderu: "",
    address: "",
    birthdate: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const goToStep = (targetStep) => {
    if (!vet || vet.role !== "vet") {
      window.location.href = "/login";
      return;
    }
    setStep(targetStep);
  };

  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const resetAll = () => {
    setStep(0);
    setMicrochip("");
    setSelectedPet(null);
    setCurrentOwner(null);
    setNewOwnerAFM("");
    setNewOwnerFound(null);
    setShowOwnerRegister(false);
    setOwnerForm({
      firstname: "",
      lastname: "",
      genderu: "",
      address: "",
      birthdate: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setLoading(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της δήλωσης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;
    resetAll();
  };

  const loadCurrentOwner = async (ownerId) => {
    try {
      let res = await fetch(`http://localhost:3001/owners/${ownerId}`);
      if (res.ok) {
        const ownerData = await res.json();
        setCurrentOwner(ownerData);
        return true;
      }
      res = await fetch(`http://localhost:3001/vets/${ownerId}`);
      if (res.ok) {
        const vetOwnerData = await res.json();
        setCurrentOwner(vetOwnerData);
        return true;
      }
      setCurrentOwner(null);
      return false;
    } catch {
      setCurrentOwner(null);
      return false;
    }
  };

  const findUserByAFM = async (afm) => {
    try {
      let res = await fetch(`http://localhost:3001/owners?afm=${afm}`);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) return { type: "owner", data: arr[0] };
      }
      res = await fetch(`http://localhost:3001/vets?afm=${afm}`);
      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr) && arr.length > 0) return { type: "vet", data: arr[0] };
      }
      return null;
    } catch {
      return null;
    }
  };

  const validate1 = () => {
    const newErrors = {};
    const m = microchip.trim();
    if (!m) newErrors.microchip = "Πρέπει να εισάγετε αριθμό microchip";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    handleSearchByMicrochip();
  };

  const handleSearchByMicrochip = async () => {
    setLoading(true);
    setErrors({});
    setSelectedPet(null);
    setCurrentOwner(null);

    try {
      const res = await fetch(`http://localhost:3001/pets?microchip=${microchip.trim()}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setErrors({ microchip: "Δεν βρέθηκε κατοικίδιο με αυτό το microchip" });
        return;
      }

      const foundPet = data[0];
      setSelectedPet(foundPet);

      const okOwner = await loadCurrentOwner(foundPet.ownerId);
      if (!okOwner) {
        setErrors({ microchip: "Δεν βρέθηκαν στοιχεία ιδιοκτήτη για αυτό το κατοικίδιο" });
        setSelectedPet(null);
        return;
      }

      setStep(2);
    } catch {
      setErrors({ microchip: "Σφάλμα αναζήτησης. Προσπαθήστε ξανά." });
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerRegisterChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "phone") v = value.replace(/\D/g, "").slice(0, 15);
    setOwnerForm((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateNewOwnerRegister = async () => {
    const newErrors = {};
    if (!ownerForm.firstname.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    else if (!/^[Α-ΩA-Z]+$/.test(ownerForm.firstname.trim())) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!ownerForm.lastname.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    else if (!/^[Α-ΩA-Z]+$/.test(ownerForm.lastname.trim())) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!ownerForm.phone) newErrors.phone = "Πρέπει να συμπληρωθεί το τηλέφωνο";
    else if (!/^\d{10,15}$/.test(ownerForm.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι 10–15 ψηφία";
    if (!ownerForm.genderu) newErrors.genderu = "Πρέπει να επιλέξετε φύλο";
    if (!ownerForm.address.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!ownerForm.birthdate) { newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης"; }
    else {
      const today = new Date();
      const birth = new Date(ownerForm.birthdate);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) newErrors.birthdate = "Ο ιδιοκτήτης πρέπει να είναι άνω των 18";
    }
    if (!ownerForm.email.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (ownerForm.password.length < 8) newErrors.password = "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες";
    if (ownerForm.password !== ownerForm.confirmPassword) newErrors.confirmPassword = "Οι κωδικοί δεν ταιριάζουν";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validate3 = async () => {
    const afm = newOwnerAFM.trim();
    const newErrors = {};
    if (!/^\d{10}$/.test(afm)) newErrors.newOwnerAfm = "Πρέπει να συμπληρώσετε έγκυρο ΑΦΜ (10 ψηφία)";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const user = await findUserByAFM(afm);
      if (!user) {
        setNewOwnerFound(null);
        setShowOwnerRegister(true);
        setErrors({});
        return;
      }
      if (currentOwner && String(currentOwner.afm) === String(user.data.afm)) {
        setErrors({ newOwnerAfm: "Ο νέος ιδιοκτήτης δεν μπορεί να είναι ο ίδιος με τον τρέχοντα" });
        setNewOwnerFound(null);
        setShowOwnerRegister(false);
        return;
      }
      setNewOwnerFound(user);
      setShowOwnerRegister(false);
      setErrors({});
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleNextFromStep3 = async () => {
    if (!showOwnerRegister) {
      await validate3();
      return;
    }
    const ok = await validateNewOwnerRegister();
    if (!ok) return;
    setLoading(true);
    try {
      const existing = await findUserByAFM(newOwnerAFM.trim());
      if (existing) {
        if (currentOwner && String(currentOwner.afm) === String(existing.data.afm)) {
          setErrors({ newOwnerAfm: "Ο νέος ιδιοκτήτης δεν μπορεί να είναι ο ίδιος με τον τρέχοντα" });
          setNewOwnerFound(null);
          return;
        }
        setNewOwnerFound(existing);
        setShowOwnerRegister(false);
        setStep(4);
        return;
      }
      const resOwner = await fetch(`http://localhost:3001/owners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: ownerForm.firstname,
          lastname: ownerForm.lastname,
          afm: newOwnerAFM.trim(),
          gender: ownerForm.genderu,
          address: ownerForm.address,
          birthdate: ownerForm.birthdate,
          phone: ownerForm.phone,
          email: ownerForm.email,
          password: ownerForm.password,
        }),
      });
      if (!resOwner.ok) throw new Error("Σφάλμα δημιουργίας ιδιοκτήτη");
      const newOwner = await resOwner.json();
      setNewOwnerFound({ type: "owner", data: newOwner });
      setShowOwnerRegister(false);
      setStep(4);
    } catch (e) {
      console.error(e);
      setErrors({ newOwnerAfm: "Αποτυχία δημιουργίας νέου ιδιοκτήτη. Προσπαθήστε ξανά." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!selectedPet || !currentOwner || !newOwnerFound) return;
    setIsSubmitting(true);
    try {
      const report = {
        petId: selectedPet.id,
        microchip: selectedPet.microchip,
        vetId: vet.id,
        currentOwnerId: currentOwner.id,
        newOwnerId: newOwnerFound.data.id,
        transferDate: new Date().toISOString().split("T")[0],
        status, // draft | submitted
        createdAt: new Date().toISOString(),
      };
      const res = await fetch("http://localhost:3001/transferReports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      if (!res.ok) throw new Error("Save failed");
      if (status === "submitted") {
        const petUpdate = await fetch(`http://localhost:3001/pets/${selectedPet.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId: newOwnerFound.data.id }),
        });
        if (!petUpdate.ok) throw new Error("PATCH pet failed");
      }
      resetAll();
      navigate("/vet-dashboard");
    } catch (err) {
      console.error(err);
      alert("Σφάλμα υποβολής. Προσπαθήστε ξανά.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transfer">
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
          <div className="stepper">
            <div className="step step-zero">
              <div className="circle">1</div>
              <span>Στο πρώτο βήμα εισάγετε το microchip του κατοικιδίου.</span>
            </div>
            <div className="line" />
            <div className="step step-zero">
              <div className="circle">2</div>
              <span>Στο δεύτερο βήμα επιβεβαιώνετε τα στοιχεία του κατοικιδίου και του τρέχοντος ιδιοκτήτη.</span>
            </div>
            <div className="line" />
            <div className="step step-zero">
              <div className="circle">3</div>
              <span>Στο τρίτο βήμα εισάγετε ΑΦΜ νέου ιδιοκτήτη. Αν δεν υπάρχει, δημιουργείτε λογαριασμό.</span>
            </div>
            <div className="line" />
            <div className="step step-zero">
              <div className="circle">4</div>
              <span>Στο τέταρτο βήμα βλέπετε προεπισκόπηση και κάνετε προσωρινή ή οριστική υποβολή.</span>
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
              <div className="step-title">Νέος ιδιοκτήτης</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση</div>
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

            {errors.microchip && <p className="error-text step1-error">{errors.microchip}</p>}

            <button className="next-btn" onClick={validate1} disabled={loading}>
              {loading ? "Αναζήτηση..." : "Συνέχεια"}
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
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
              <div className="step-title">Νέος ιδιοκτήτης</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση</div>
            </div>
          </div>

          <div className="found-form">
            <h3>Βασικά Στοιχεία</h3>

            {selectedPet ? (
              <div className="booklet-layout">
                <div className="booklet-header">
                  <div className="pet-photo">
                    <img src={selectedPet.photoUrl} alt={selectedPet.name} />
                  </div>

                  <div className="booklet-top">
                    <div className="info-box2">
                      <h4>Στοιχεία Κατοικιδίου</h4>
                      <p><span>Όνομα:</span> {selectedPet.name}</p>
                      <p><span>Είδος:</span> {selectedPet.species}</p>
                      <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                      <p><span>Φύλο:</span> {selectedPet.gender}</p>
                      <p><span>Microchip:</span> {selectedPet.microchip}</p>
                      <p><span>Ημερομηνία Γέννησης:</span> {selectedPet.birthdate || "-"}</p>
                      <p><span>Ηλικία:</span> {selectedPet.age || "-"}</p>
                    </div>

                    <div className="info-box2">
                      <h4>Στοιχεία Ιδιοκτήτη</h4>
                      {currentOwner ? (
                        <>
                          <p><span>Όνομα:</span> {currentOwner.firstname} {currentOwner.lastname}</p>
                          <p><span>ΑΦΜ:</span> {currentOwner.afm}</p>
                          <p><span>Τηλέφωνο:</span> {currentOwner.phone}</p>
                          <p><span>Email:</span> {currentOwner.email}</p>
                        </>
                      ) : (
                        <p>Φόρτωση στοιχείων ιδιοκτήτη...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Δεν έχει βρεθεί κατοικίδιο ακόμα...</p>
            )}

            <div className="form-buttons">
              <button onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={() => setStep(3)} disabled={!selectedPet}>
                Συνέχεια
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Εισαγωγή microchip</div>
            </div>
            <div className="line" />
            <div className="step clickable" onClick={() => setStep(2)}>
              <div className="circle">2</div>
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />
            <div className="step active">
              <div className="circle">3</div>
              <div className="step-title">Νέος ιδιοκτήτης</div>
            </div>
            <div className="line" />
            <div className="step">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση</div>
            </div>
          </div>

          <div className="found-form">
            <h3>Στοιχεία Νέου Ιδιοκτήτη</h3>

            <label>
              ΑΦΜ *
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={newOwnerAFM}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNewOwnerAFM(v);
                  setNewOwnerFound(null);
                  setShowOwnerRegister(false);
                  setErrors((prev) => ({ ...prev, newOwnerAfm: "" }));
                }}
              />
              {errors.newOwnerAfm && <p className="error-text">{errors.newOwnerAfm}</p>}
            </label>

            {showOwnerRegister && (
              <div className="ownerRegister">
                <h4>Δημιουργία Λογαριασμού Ιδιοκτήτη (Δεν υπάρχει λογαριασμός με αυτό το ΑΦΜ)</h4>

                <label>
                  Όνομα *
                  <input type="text" name="firstname" value={ownerForm.firstname} onChange={handleOwnerRegisterChange} />
                  {errors.firstname && <div className="fieldError">{errors.firstname}</div>}
                </label>

                <label>
                  Επώνυμο *
                  <input type="text" name="lastname" value={ownerForm.lastname} onChange={handleOwnerRegisterChange} />
                  {errors.lastname && <div className="fieldError">{errors.lastname}</div>}
                </label>

                <label>
                  Διεύθυνση *
                  <input type="text" name="address" value={ownerForm.address} onChange={handleOwnerRegisterChange} />
                  {errors.address && <div className="fieldError">{errors.address}</div>}
                </label>

                <label>
                  Ημερομηνία Γέννησης *
                  <input
                    type="date"
                    name="birthdate"
                    value={ownerForm.birthdate}
                    onChange={handleOwnerRegisterChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
                </label>

                <label>
                  Email *
                  <input type="email" name="email" value={ownerForm.email} onChange={handleOwnerRegisterChange} />
                  {errors.email && <div className="fieldError">{errors.email}</div>}
                </label>

                <label>
                  Τηλέφωνο *
                  <input type="tel" name="phone" value={ownerForm.phone} onChange={handleOwnerRegisterChange} />
                  {errors.phone && <div className="fieldError">{errors.phone}</div>}
                </label>

                <label>
                  Φύλο *
                  <select name="genderu" value={ownerForm.genderu} onChange={handleOwnerRegisterChange}>
                    <option value="">Επιλογή</option>
                    <option value="Αρσενικό">Αρσενικό</option>
                    <option value="Θηλυκό">Θηλυκό</option>
                    <option value="Άλλο">Άλλο</option>
                  </select>
                  {errors.genderu && <div className="fieldError">{errors.genderu}</div>}
                </label>

                <label>
                  Κωδικός (τουλάχιστον 8 ψηφία) *
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`loginInput ${errors.password ? "inputError" : ""}`}
                      name="password"
                      value={ownerForm.password}
                      onChange={handleOwnerRegisterChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="button-password">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <div className="fieldError">{errors.password}</div>}
                </label>

                <label>
                  Επιβεβαίωση Κωδικού *
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`loginInput ${errors.confirmPassword ? "inputError" : ""}`}
                      name="confirmPassword"
                      value={ownerForm.confirmPassword}
                      onChange={handleOwnerRegisterChange}
                    />
                    <button
                      className="button-password"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="fieldError">{errors.confirmPassword}</div>}
                </label>
              </div>
            )}

            <div className="form-buttons">
              <button onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={handleNextFromStep3} disabled={loading}>
                {loading ? "Έλεγχος..." : "Συνέχεια"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= STEP 4 ================= */}
      {step === 4 && selectedPet && currentOwner && newOwnerFound && (
        <>
          <div className="stepper">
            <div className="step clickable" onClick={() => setStep(1)}>
              <div className="circle">1</div>
              <div className="step-title">Εισαγωγή microchip</div>
            </div>
            <div className="line" />
            <div className="step clickable" onClick={() => setStep(2)}>
              <div className="circle">2</div>
              <div className="step-title">Προβολή προφίλ</div>
            </div>
            <div className="line" />
            <div className="step clickable" onClick={() => setStep(3)}>
              <div className="circle">3</div>
              <div className="step-title">Νέος ιδιοκτήτης</div>
            </div>
            <div className="line" />
            <div className="step active">
              <div className="circle">4</div>
              <div className="step-title">Προεπισκόπηση</div>
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
                    <h4>Στοιχεία Κατοικιδίου</h4>
                    <p><span>Όνομα:</span> {selectedPet.name}</p>
                    <p><span>Είδος:</span> {selectedPet.species}</p>
                    <p><span>Ράτσα:</span> {selectedPet.breed}</p>
                    <p><span>Φύλο:</span> {selectedPet.gender}</p>
                    <p><span>Microchip:</span> {selectedPet.microchip}</p>
                    <p><span>Ημερομηνία Γέννησης:</span> {selectedPet.birthdate || "-"}</p>
                    <p><span>Περιοχή:</span> {selectedPet.region || "-"}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Τρέχοντος Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {currentOwner.firstname} {currentOwner.lastname}</p>
                    <p><span>ΑΦΜ:</span> {currentOwner.afm}</p>
                    <p><span>Τηλέφωνο:</span> {currentOwner.phone}</p>
                    <p><span>Email:</span> {currentOwner.email}</p>
                  </div>

                  <div className="info-box">
                    <h4>Στοιχεία Νέου Ιδιοκτήτη</h4>
                    <p><span>Όνομα:</span> {newOwnerFound.data.firstname} {newOwnerFound.data.lastname}</p>
                    <p><span>ΑΦΜ:</span> {newOwnerFound.data.afm}</p>
                    <p><span>Τηλέφωνο:</span> {newOwnerFound.data.phone}</p>
                    <p><span>Email:</span> {newOwnerFound.data.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button onClick={handleCancel}>Ακύρωση</button>
              <button type="button" onClick={() => handleSubmit("draft")} disabled={isSubmitting}>
                {isSubmitting ? "Αποθήκευση..." : "Προσωρινή Αποθήκευση"}
              </button>
              <button type="button" onClick={() => handleSubmit("submitted")} disabled={isSubmitting}>
                {isSubmitting ? "Υποβολή..." : "Οριστική Υποβολή"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
