import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SPECIES, dogPopular, catPopular } from "../Utils/Util";
import "./Identity.css";
import "./Loss2.css";

export default function Identity() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro, 1 = φόρμα, 2 = προεπισκόπηση
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const vet = JSON.parse(localStorage.getItem("user"));
  const [petInfo, setPetInfo] = useState({
    microchip: "",
    name: "",
    species: "",
    breed: "",
    birthdate: "",
    age: "",
    gender: "",
    forAdoption: "Όχι",
  });
  const [ownerAFM, setOwnerAFM] = useState("");
  const [ownerFound, setOwnerFound] = useState(null);
  const [showOwnerRegister, setShowOwnerRegister] = useState(false);
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

  const getBreedsBySpecies = () => {
    if (petInfo.species === "Σκύλος") return dogPopular;
    if (petInfo.species === "Γάτα") return catPopular;
    return [];
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm(
      "Αν ακυρώσετε, τα στοιχεία της δήλωσης δεν θα αποθηκευτούν.\nΘέλετε σίγουρα να συνεχίσετε;"
    );
    if (!confirmLeave) return;
    setStep(0);
    setPetInfo({
      microchip: "",
      name: "",
      species: "",
      breed: "",
      birthdate: "",
      age: "",
      gender: "",
      forAdoption: "Όχι",
    });
    setOwnerAFM("");
    setOwnerFound(null);
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
    setIsSubmitting(false);
  };

  const goToStep = (targetStep) => {
    if (!vet || vet.role !== "vet") {
      window.location.href = "/login";
      return;
    }
    setStep(targetStep);
  };

  useEffect(() => {
    // Όταν αλλάζει το step, scroll στην κορυφή του container
    window.scrollTo({ top: 0, behavior: "smooth"});
  }, [step]);

  const findOwnerByAFM = async (afm) => {
    try {
      const res = await fetch(`http://localhost:3001/owners?afm=${afm}`);
      if (!res.ok) return null;
      const arr = await res.json();
      return arr?.length ? arr[0] : null;
    } catch {
      return null;
    }
  };

  const validateUser = async () => {
    const newErrors = {};
    if (!ownerForm.firstname.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    else if (!/^[Α-ΩA-Z]+$/.test(ownerForm.firstname.trim())) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!ownerForm.lastname.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    else if (!/^[Α-ΩA-Z]+$/.test(ownerForm.lastname.trim())) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!ownerForm.phone) newErrors.phone = "Πρέπει να συμπληρωθεί το τηλέφωνο";
    else if (!/^\d{10,15}$/.test(ownerForm.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι 10–15 ψηφία";
    if (!ownerForm.genderu) newErrors.genderu = "Πρέπει να επιλέξετε φύλο";
    if (!ownerForm.address.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!ownerForm.birthdate) newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης";
    if (!ownerForm.email.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (ownerForm.password.length < 8) newErrors.password = "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες";
    if (ownerForm.password !== ownerForm.confirmPassword) newErrors.confirmPassword = "Οι κωδικοί δεν ταιριάζουν";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = async () => {
    const newErrors = {};
    if (!/^\d{9}$/.test(petInfo.microchip)) newErrors.microchip = "Το microchip πρέπει να έχει 9 ψηφία";
    else {
      const res = await fetch(`http://localhost:3001/pets?microchip=${petInfo.microchip}`);
      if (!res.ok) return false;
      const data = await res.json();
      if (data.length > 0) newErrors.microchip = "Το microchip υπάρχει ήδη στη βάση";
    }
    if (!petInfo.name.trim()) newErrors.name = "Πρέπει να συμπληρωθεί το όνομα";
    if (!petInfo.species) newErrors.species = "Πρέπει να επιλεγεί είδος";
    if (!petInfo.breed.trim()) newErrors.breed = "Πρέπει να συμπληρωθεί ράτσα";
    if (!petInfo.gender) newErrors.gender = "Πρέπει να επιλεγεί φύλο";
    if (!petInfo.age || isNaN(petInfo.age) || Number(petInfo.age) < 0) newErrors.age = "Η ηλικία είναι υποχρεωτική";
    if (petInfo.forAdoption === "Όχι") {
      if (!/^\d{10}$/.test(ownerAFM)) newErrors.ownerAFM = "Πρέπει να συμπληρωθεί έγκυρο ΑΦΜ";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleOwnerRegisterChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "phone") v = value.replace(/\D/g, "").slice(0, 15);
    setOwnerForm((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNextStep = async () => {
    const isPetValid = await validateForm();
    if (!isPetValid) return;
    if (petInfo.forAdoption === "Ναι") {
      setOwnerFound(null);
      setShowOwnerRegister(false);
      setStep(2);
      return;
    }
    if (!showOwnerRegister) {
      const user = await findOwnerByAFM(ownerAFM);
      if (user) {
        setOwnerFound(user);
        setShowOwnerRegister(false);
        setErrors((prev) => ({ ...prev, ownerAFM: "" }));
        setStep(2);
        return;
      }
      setOwnerFound(null);
      setShowOwnerRegister(true);
      setErrors((prev) => ({ ...prev, ownerAFM: "" }));
      return;
    }
    const okOwner = await validateUser();
    if (!okOwner) return;
    setStep(2);
  };

  const submit = async () => {
    const okPet = await validateForm();
    if (!okPet) return;
    if (!vet || vet.role !== "vet") {
      alert("Πρέπει να είστε συνδεδεμένος ως κτηνίατρος");
      return;
    }
    setIsSubmitting(true);
    try {
      let finalOwnerId = null;
      if (petInfo.forAdoption === "Ναι") {
        finalOwnerId = vet.id;
      } else {
        if (ownerFound?.id) {
          finalOwnerId = ownerFound.id;
        } else {
          const okOwner = await validateUser();
          if (!okOwner) return;
          const resOwner = await fetch(`http://localhost:3001/owners`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstname: ownerForm.firstname,
              lastname: ownerForm.lastname,
              afm: ownerAFM,
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
          setOwnerFound(newOwner);
          finalOwnerId = newOwner.id;
        }
      }
      const petId = "vp" + Math.random().toString(36).substr(2, 9);
      const newPet = {
        id: petId,
        ownerId: finalOwnerId,
        name: petInfo.name,
        species: petInfo.species,
        breed: petInfo.breed,
        gender: petInfo.gender,
        microchip: petInfo.microchip,
        birthdate: petInfo.birthdate || null,
        age: petInfo.age,
        region: vet.region || "",
        lastSeenAddress: vet.address || "",
        lastSeenDate: new Date().toISOString().split("T")[0],
        status: petInfo.forAdoption === "Ναι" ? "adoption" : "owned",
      };
      const resPet = await fetch(`http://localhost:3001/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPet),
      });
      if (!resPet.ok) throw new Error("Σφάλμα κατά την υποβολή κατοικιδίου");
      const createdPet = await resPet.json();
      const identityEntry = {
        id: "idn" + Math.random().toString(36).substr(2, 9),
        petId: createdPet.id,
        vetId: vet.id,
        date: new Date().toISOString().split("T")[0],
      };
      const resIdentity = await fetch(`http://localhost:3001/identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identityEntry),
      });
      if (!resIdentity.ok) throw new Error("Σφάλμα καταχώρησης identity");
      alert("Η καταχώρηση ολοκληρώθηκε επιτυχώς!");
      setStep(0);
      setPetInfo({
        microchip: "",
        name: "",
        species: "",
        breed: "",
        birthdate: "",
        age: "",
        gender: "",
        forAdoption: "Όχι",
      });
      setOwnerAFM("");
      setOwnerFound(null);
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
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    };
  }

  return (
    <div className="identity">
       {/* Breadcrumb */}
      <nav className="breadcrumb">
        {[
          { label: "Αρχική", path: "/" }, // πηγαίνει σε άλλη σελίδα
          { label: "Καταγραφή Ταυτότητας", step: 0 }, // step 0 του wizard
          ...(step >= 1 ? [{ label: "Δημιουργία προφίλ κατοικιδίου", step: 1 }] : []),
          ...(step === 2 ? [{ label: "Προεπισκόπηση & Καταχώρηση", step: 2 }] : []),
        ].map((item, index, arr) => {
          const isLast = index === arr.length - 1; // τρέχον step
          return (
            <span key={index}>
              <span
                style={{
                  color: isLast ? "black" : "blue",
                  cursor: isLast ? "default" : "pointer",
                  textDecoration: isLast ? "none" : "underline",
                }}
                onClick={() => {
                  if (!isLast) {
                    if (item.step !== undefined) {
                      goToStep(item.step); // μεταβαίνει στο step του wizard
                    } else if (item.path) {
                      navigate(item.path); // πηγαίνει σε άλλη σελίδα
                    }
                  }
                }}
              >
                {item.label}
              </span>
              {!isLast && " / "}
            </span>
          );
        })}
      </nav>
      {/* ================= STEP 0 ================= */}
      {step === 0 && (
        <>
        <div className="step0-wrapper">
          <div className="stepper ">
            <div className="step step-zero">
              <div className="circle">1</div>
              <span>
                Στο πρώτο βήμα συμπληρώνετε στοιχεία κατοικιδίου. Αν δεν είναι προς υιοθεσία, δίνετε το ΑΦΜ του ιδιοκτήτη.
                Αν δεν υπάρχει λογαριασμός, θα εμφανιστεί φόρμα δημιουργίας.
              </span>
            </div>
            <div className="line" />
            <div className="step step-zero">
              <div className="circle">2</div>
              <span>Στο δεύτερο βήμα βλέπετε προεπισκόπηση και κάνετε υποβολή.</span>
            </div>
          </div>
         
          <button className="next-btn" onClick={() => goToStep(1)}>
            Συνέχεια
          </button>
         </div>
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

          <div className="found-form">
            <h3>Εισαγωγή Στοιχείων Κατοικιδίου</h3>

            <label>
              Microchip *
              <input
                type="text"
                inputMode="numeric"
                maxLength={9}
                value={petInfo.microchip}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPetInfo({ ...petInfo, microchip: value });
                  setErrors((prev) => ({ ...prev, microchip: "" }));
                }}
              />
              {errors.microchip && <div className="fieldError">{errors.microchip}</div>}
            </label>

            <label>
              Όνομα *
              <input
                type="text"
                value={petInfo.name}
                onChange={(e) => {
                  setPetInfo({ ...petInfo, name: e.target.value });
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {errors.name && <div className="fieldError">{errors.name}</div>}
            </label>

            <label>
              Είδος *
              <select
                value={petInfo.species}
                onChange={(e) => {
                  setPetInfo({ ...petInfo, species: e.target.value, breed: "" });
                  setErrors((prev) => ({ ...prev, species: "", breed: "" }));
                }}
                required
              >
                <option value="">Επιλογή</option>
                {SPECIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.species && <div className="fieldError">{errors.species}</div>}
            </label>

            <label>
              Ράτσα *
              {petInfo.species === "" || petInfo.species === "Άλλο" ? (
                <input
                  type="text"
                  placeholder="Εισάγετε ράτσα"
                  value={petInfo.breed}
                  onChange={(e) => {
                    setPetInfo({ ...petInfo, breed: e.target.value });
                    setErrors((prev) => ({ ...prev, breed: "" }));
                  }}
                  disabled={petInfo.species === ""}
                />
              ) : (
                <select
                  value={petInfo.breed}
                  onChange={(e) => {
                    setPetInfo({ ...petInfo, breed: e.target.value });
                    setErrors((prev) => ({ ...prev, breed: "" }));
                  }}
                  disabled={petInfo.species === ""}
                >
                  <option value="">Επιλογή ράτσας</option>
                  {getBreedsBySpecies().map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              )}
              {errors.breed && <div className="fieldError">{errors.breed}</div>}
            </label>

            <label>
              Φύλο *
              <select
                value={petInfo.gender}
                onChange={(e) => {
                  setPetInfo({ ...petInfo, gender: e.target.value });
                  setErrors((prev) => ({ ...prev, gender: "" }));
                }}
              >
                <option value="">Επιλογή</option>
                <option value="Αρσενικό">Αρσενικό</option>
                <option value="Θηλυκό">Θηλυκό</option>
              </select>
              {errors.gender && <div className="fieldError">{errors.gender}</div>}
            </label>

            <label>
              Ημερομηνία Γέννησης
              <input
                type="date"
                value={petInfo.birthdate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPetInfo({ ...petInfo, birthdate: e.target.value })}
              />
            </label>

            <label>
              Ηλικία *
              <input
                type="number"
                value={petInfo.age}
                onChange={(e) => {
                  setPetInfo({ ...petInfo, age: e.target.value });
                  setErrors((prev) => ({ ...prev, age: "" }));
                }}
              />
              {errors.age && <div className="fieldError">{errors.age}</div>}
            </label>

            <label>
              Προς Υιοθεσία
              <select
                value={petInfo.forAdoption}
                onChange={(e) => {
                  const val = e.target.value;
                  setPetInfo({ ...petInfo, forAdoption: val });
                  setErrors((prev) => ({ ...prev, ownerAFM: "" }));
                  if (val === "Ναι") {
                    setOwnerAFM("");
                    setOwnerFound(null);
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
                  }
                }}
              >
                <option value="Ναι">Ναι</option>
                <option value="Όχι">Όχι</option>
              </select>
            </label>
            {petInfo.forAdoption === "Όχι" && (
              <>
                <h3>Στοιχεία Ιδιοκτήτη</h3>
                <label>
                  ΑΦΜ *
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={ownerAFM}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setOwnerAFM(v);
                      setErrors((prev) => ({ ...prev, ownerAFM: "" }));
                    }}
                  />
                  {errors.ownerAFM && <div className="fieldError">{errors.ownerAFM}</div>}
                </label>

                {showOwnerRegister && (
                  <div className="ownerRegister">
                    <h4>Δημιουργία Λογαριασμού Ιδιοκτήτη (Δεν υπάρχει λογαριασμός με αυτό το ΑΦΜ)</h4>

                    <label>
                      Όνομα *
                      <input
                        type="text"
                        name="firstname"
                        value={ownerForm.firstname}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.firstname && <div className="fieldError">{errors.firstname}</div>}
                    </label>

                    <label>
                      Επώνυμο *
                      <input
                        type="text"
                        name="lastname"
                        value={ownerForm.lastname}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.lastname && <div className="fieldError">{errors.lastname}</div>}
                    </label>

                    <label>
                      Διεύθυνση *
                      <input
                        type="text"
                        name="address"
                        value={ownerForm.address}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.address && <div className="fieldError">{errors.address}</div>}
                    </label>

                    <label>
                      Ημερομηνία Γέννησης *
                      <input
                        type="date"
                        name="birthdate"
                        value={ownerForm.birthdate}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
                    </label>

                    <label>
                      Email *
                      <input
                        type="email"
                        name="email"
                        value={ownerForm.email}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.email && <div className="fieldError">{errors.email}</div>}
                    </label>

                    <label>
                      Τηλέφωνο *
                      <input
                        type="tel"
                        name="phone"
                        value={ownerForm.phone}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.phone && <div className="fieldError">{errors.phone}</div>}
                    </label>

                    <label>
                      Φύλο *
                      <select
                        name="genderu"
                        value={ownerForm.genderu}
                        onChange={handleOwnerRegisterChange}
                      >
                        <option value="">Επιλογή</option>
                        <option value="Αρσενικό">Αρσενικό</option>
                        <option value="Θηλυκό">Θηλυκό</option>
                        <option value="Άλλο">Άλλο</option>
                      </select>
                      {errors.genderu && <div className="fieldError">{errors.genderu}</div>}
                    </label>

                    <label>
                      Κωδικός *
                      <input
                        type="password"
                        name="password"
                        value={ownerForm.password}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.password && <div className="fieldError">{errors.password}</div>}
                    </label>

                    <label>
                      Επιβεβαίωση Κωδικού *
                      <input
                        type="password"
                        name="confirmPassword"
                        value={ownerForm.confirmPassword}
                        onChange={handleOwnerRegisterChange}
                      />
                      {errors.confirmPassword && <div className="fieldError">{errors.confirmPassword}</div>}
                    </label>
                  </div>
                )}
              </>
            )}

            <div className="form-buttons">
              <button type="button" onClick={handleNextStep}>
                Συνέχεια
              </button>
            </div>
          </div>
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

          <h3>Προεπισκόπηση Στοιχείων</h3>

          <div className="preview-content">
            <div className="info-box2">
              <h4>Στοιχεία Κατοικιδίου</h4>
              <p><span>Microchip:</span> {petInfo.microchip}</p>
              <p><span>Όνομα:</span> {petInfo.name}</p>
              <p><span>Είδος:</span> {petInfo.species}</p>
              <p><span>Ράτσα:</span> {petInfo.breed}</p>
              <p><span>Φύλο:</span> {petInfo.gender}</p>
              <p><span>Ηλικία:</span> {petInfo.age}</p>
              <p><span>Ημερομηνία Γέννησης:</span> {petInfo.birthdate || "-"}</p>
              <p><span>Προς Υιοθεσία:</span> {petInfo.forAdoption}</p>
            </div>

            {petInfo.forAdoption === "Ναι" && vet && (
              <div className="info-box2">
                <h4>Στοιχεία Κτηνιάτρου</h4>
                <p><span>Όνομα:</span> {vet.firstname} {vet.lastname}</p>
                <p><span>Email:</span> {vet.email}</p>
                <p><span>Τηλέφωνο:</span> {vet.phone}</p>
                <p><span>Διεύθυνση:</span> {vet.address}</p>
                <p><span>Περιοχή:</span> {vet.region}</p>
              </div>
            )}

            {petInfo.forAdoption === "Όχι" && ownerFound && (
              <div className="info-box2">
                <h4>Στοιχεία Ιδιοκτήτη</h4>
                <p><span>Όνομα:</span> {ownerFound.firstname} {ownerFound.lastname}</p>
                <p><span>ΑΦΜ:</span> {ownerFound.afm}</p>
                <p><span>Email:</span> {ownerFound.email}</p>
                <p><span>Τηλέφωνο:</span> {ownerFound.phone}</p>
              </div>
            )}

            {petInfo.forAdoption === "Όχι" && !ownerFound && showOwnerRegister && (
              <div className="info-box2">
                <h4>Νέος Ιδιοκτήτης</h4>
                <p><span>ΑΦΜ:</span> {ownerAFM}</p>
                <p><span>Όνομα:</span> {ownerForm.firstname} {ownerForm.lastname}</p>
                <p><span>Ημερομηνία Γέννησης :</span> {ownerForm.birthdate}</p>
                <p><span>Φύλο:</span> {ownerForm.genderu}</p>
                <p><span>Διεύθυνση:</span> {ownerForm.address}</p>
                <p><span>Email:</span> {ownerForm.email}</p>
                <p><span>Τηλέφωνο:</span> {ownerForm.phone}</p>
              </div>
            )}
          </div>
          <div className="form-buttons">
            <button type="button" onClick={handleCancel}>
              Ακύρωση
            </button>
            <button type="button" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Υποβολή..." : "Οριστική Υποβολή"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
