import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
import { DAYS, SERVICE_CATEGORIES, VET_SPECIALIZATIONS, REGIONS, STUDY_LEVELS } from "../Utils/Util";
const API_URL = "http://localhost:3001/vets";


function buildInitialServicesState() {
  const state = {};
  for (const cat of SERVICE_CATEGORIES) {
    for (const item of cat.items) {
      state[item.id] = { enabled: false, price: "" };
    }
  }
  return state;
}

function buildInitialScheduleState() {
  const state = {};
  for (const d of DAYS) {
    state[d.id] = { enabled: false, from: "09:00", to: "17:00" };
  }
  return state;
}

export default function RegisterVet({ onOpenTerms, onRegister }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    afm: "",
    gender: "",
    birthdate: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specializations: [],
    region: "",
    studyLevel: "",
    experience: "",
    photoFile: null,
    services: buildInitialServicesState(),
    schedule: buildInitialScheduleState(),
  });
  const photoInputRef = useRef(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleAfmChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 10); // μόνο ψηφία, max 10
    setForm((prev) => ({ ...prev, afm: v }));
    setErrors((prev) => ({ ...prev, afm: "" }));
  }

  function handlePhoneChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 15); // μόνο ψηφία, max 15
    setForm((prev) => ({ ...prev, phone: v }));
    setErrors((prev) => ({ ...prev, phone: "" }));
  }

  function handleClear() {
    setForm({
      firstname: "",
      lastname: "",
      afm: "",
      gender: "",
      birthdate: "",
      email: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
      specializations: [],
      region: "",
      studyLevel: "",
      experience: "",
      photoUrl: null,
      services: buildInitialServicesState(),
      schedule: buildInitialScheduleState(),
    });
    setErrors({});
    setServerError("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photoFile: file }));
  }

  function toggleSpecialization(spec) {
    setForm((prev) => {
      const exists = prev.specializations.includes(spec);
      return {
        ...prev,
        specializations: exists ? prev.specializations.filter((s) => s !== spec) : [...prev.specializations, spec],
      };
    });
  }

  function toggleService(serviceId) {
    setForm((prev) => ({
      ...prev,
      services: { ...prev.services, [serviceId]: { ...prev.services[serviceId], enabled: !prev.services[serviceId].enabled, }, },
    }));
  }

  function changeServicePrice(serviceId, value) {
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      const normalized = value === "" ? "" : value.replace(/^0+(?=\d)/, "");
      setForm((prev) => ({
        ...prev,
        services: { ...prev.services, [serviceId]: { ...prev.services[serviceId], price: normalized, }, },
      }));
    }
  }

  function toggleDay(dayId) {
    setForm((prev) => ({ ...prev, schedule: { ...prev.schedule, [dayId]: { ...prev.schedule[dayId], enabled: !prev.schedule[dayId].enabled, }, } }));
  }

  function changeDayTime(dayId, field, value) {
    setForm((prev) => ({ ...prev, schedule: { ...prev.schedule, [dayId]: { ...prev.schedule[dayId], [field]: value, }, }, }));
  }

  const validate = () => {
    const newErrors = {};
    if (!form.firstname.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    if (!form.lastname.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    if (!/^[Α-ΩA-Z]+$/.test(form.firstname.trim())) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!/^[Α-ΩA-Z]+$/.test(form.lastname.trim())) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!form.gender) newErrors.gender = "Πρέπει να επιλέξετε φύλο";
    if (!form.birthdate) { newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης"; }
    else {
      const today = new Date();
      const birth = new Date(form.birthdate);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 18) newErrors.birthdate = "Πρέπει να είστε άνω των 18 για να κάνετε εγγραφή";
    }
    if (!form.address.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!form.afm) newErrors.afm = "Πρέπει να συμπληρωθεί το ΑΦΜ";
    else if (!/^\d{10}$/.test(form.afm)) newErrors.afm = "Το ΑΦΜ πρέπει να έχει ακριβώς 10 ψηφία";
    if (!form.phone) newErrors.phone = "Πρέπει να συμπληρωθεί το τηλέφωνο";
    else if (!/^\d{10,15}$/.test(form.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι 10–15 ψηφία";
    if (!form.email.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (form.password.length < 8) newErrors.password = "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Οι κωδικοί δεν ταιριάζουν";
    if (!form.specializations || form.specializations.length === 0) {
      newErrors.specializations = "Πρέπει να επιλέξετε τουλάχιστον μία ειδικότητα";
    }
    if (!form.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";
    if (!form.studyLevel) newErrors.studyLevel = "Πρέπει να επιλέξετε επίπεδο σπουδών";
    if (form.experience === "" || form.experience < 0) newErrors.experience = "Πρέπει να εισάγετε έγκυρα έτη εμπειρίας";
    for (const [serviceId, service] of Object.entries(form.services)) {
      if (service.enabled && (service.price === "" || Number(service.price) <= 0)) {
        newErrors.services = "Όλες οι επιλεγμένες υπηρεσίες πρέπει να έχουν έγκυρη τιμή";
        break;
      }
    }
    for (const [dayId, day] of Object.entries(form.schedule)) {
      if (day.enabled) {
        if (!day.from || !day.to) {
          newErrors.schedule = "Όλες οι επιλεγμένες ημέρες πρέπει να έχουν ώρα έναρξης και λήξης";
          break;
        }
        if (day.from >= day.to) {
          newErrors.schedule = "Η ώρα έναρξης πρέπει να είναι μικρότερη από την ώρα λήξης";
          break;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    try {
      const ownersRes = await fetch(`http://localhost:3001/owners?afm=${form.afm}`);
      const ownersData = await ownersRes.json();
      const vetRes = await fetch(`http://localhost:3001/vets?afm=${form.afm}`);
      const vetData = await vetRes.json();

      if (vetData.length > 0 || ownersData.length > 0) {
        setServerError("Υπάρχει ήδη εγγραφή με αυτό το ΑΦΜ.");
        return;
      }
      const submitData = { ...form, reviewCount: 0, totalScore: 0, availability:[]};
      delete submitData.confirmPassword;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
      if (res.ok) {
        const user = await res.json();
        onRegister({ ...user, role: "vet" });
        navigate("/vet-dashboard");
      }
      else {
        const errorData = await res.json();
        setServerError(errorData.message || "Σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
      }
    } catch (err) {
      setServerError("Σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
    }
  }

  return (
    <form noValidate className="registerForm" onSubmit={handleSubmit}>
      <label className="loginLabel">
        Όνομα: πχ ΜΑΡΙΑ με κεφαλαία *
        <input type="text" className={`loginInput ${errors.firstname ? "inputError" : ""}`} name="firstname" value={form.firstname} onChange={handleChange} />
        {errors.firstname && <div className="fieldError">{errors.firstname}</div>}
      </label>

      <label className="loginLabel">
        Επώνυμο: πχ ΑΝΤΩΝΙΟΥ με κεφαλαία *
        <input type="text" className={`loginInput ${errors.lastname ? "inputError" : ""}`} name="lastname" value={form.lastname} onChange={handleChange} />
        {errors.lastname && <div className="fieldError">{errors.lastname}</div>}
      </label>

      <label className="loginLabel">
        ΑΦΜ *
        <input type="text" inputMode="numeric" pattern="\d*" maxLength={10}
          className={`loginInput ${errors.afm ? "inputError" : ""}`} name="afm" value={form.afm} onChange={handleAfmChange} />
        {errors.afm && <div className="fieldError">{errors.afm}</div>}
      </label>

      <label className="loginLabel">
        Φύλο *
        <select className="loginSelect" name="gender" value={form.gender} onChange={handleChange}  >
          <option value="" >Επιλέξτε φύλο</option>
          <option value="Άνδρας">Άνδρας</option>
          <option value="Γυναίκα">Γυναίκα</option>
          <option value="Άλλο">Άλλο</option>
        </select>
        {errors.gender && <div className="fieldError">{errors.gender}</div>}
      </label>


      <label className="loginLabel registerFieldFull">
        <div className="sectionTitle">Ειδικεύσεις (επιλέξτε μία ή περισσότερες) *</div>
        <div className="specializationsGrid">
          {VET_SPECIALIZATIONS.map((s) => (
            <label key={s} className="specializationItem">
              <input type="checkbox" checked={form.specializations.includes(s)} onChange={() => toggleSpecialization(s)} />
              {s}
            </label>
          ))}
        </div>
        {errors.specializations && <div className="fieldError">{errors.specializations}</div>}
      </label>

      <label className="loginLabel">
        Ημερομηνία γέννησης *
        <input type="date" className={`loginInput ${errors.birthdate ? "inputError" : ""}`}
          name="birthdate" value={form.birthdate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
        {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
      </label>

      <label className="loginLabel">
        Περιοχή (Νομός) *
        <select className="loginSelect" name="region" value={form.region} onChange={handleChange}  >
          <option value="">Επιλέξτε νομό</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.region && <div className="fieldError">{errors.region}</div>}
      </label>

      <label className="loginLabel">
        Διεύθυνση (Οδός αριθμός Πόλη Χώρα) *
        <input type="text" className={`loginInput ${errors.address ? "inputError" : ""}`}
          name="address" value={form.address} onChange={handleChange} />
        {errors.address && <div className="fieldError">{errors.address}</div>}
      </label>
      <label className="loginLabel">
        Επίπεδο σπουδών *
        <select className="loginSelect" name="studyLevel" value={form.studyLevel} onChange={handleChange}   >
          <option value="">Επιλέξτε επίπεδο</option>
          {STUDY_LEVELS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.studyLevel && <div className="fieldError">{errors.studyLevel}</div>}
      </label>

      <label className="loginLabel">
        Εμπειρία (Έτη) *
        <input className="loginInput" type="number" min="0" name="experience" value={form.experience} onChange={handleChange} />
        {errors.experience && <div className="fieldError">{errors.experience}</div>}
      </label>

      <label className="loginLabel">
        Τηλέφωνο *
        <input type="text" inputMode="numeric" pattern="\d*"
          maxLength={15} className={`loginInput ${errors.phone ? "inputError" : ""}`}
          name="phone" value={form.phone} onChange={handlePhoneChange}
        />
        {errors.phone && <div className="fieldError">{errors.phone}</div>}
      </label>

      <label className="loginLabel">
        Email πχ. name@email.com *
        <input type="email" className={`loginInput ${errors.email ? "inputError" : ""}`}
          name="email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="fieldError">{errors.email}</div>}
      </label>

      <label className="loginLabel">
        Κωδικός (τουλάχιστον 8 ψηφία) *
        <div style={{ position: "relative" }}>
          <input type={showPassword ? "text" : "password"}
            className={`loginInput ${errors.password ? "inputError" : ""}`} name="password" value={form.password}
            onChange={handleChange} minLength={8} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="button-password"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <div className="fieldError">{errors.password}</div>}
      </label>

      <label className="loginLabel">
        Επιβεβαίωση κωδικού *
        <div style={{ position: "relative" }}>
          <input type={showConfirmPassword ? "text" : "password"} className={`loginInput ${errors.confirmPassword ? "inputError" : ""}`}
            name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
            minLength={8}
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

      <div className="registerFieldFull">
        <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoChange} style={{ display: "none" }}
        />
        <button type="button" className="registerSecondaryButton" onClick={() => photoInputRef.current?.click()}
        >
          Προσθήκη Φωτογραφίας
        </button>
        {form.photoFile && (
          <div className="registerPhotoName">Επιλέχθηκε: {form.photoFile.name}</div>
        )}
      </div>
      <div className="registerFieldFull">
        <div className="sectionTitle">Ενημέρωση τιμών</div>
        <div className="sectionHint">
          Επιλέξτε υπηρεσίες και συμπληρώστε τιμές. Η τιμή είναι υποχρεωτική για ό,τι επιλέξετε.
        </div>

        <div className="vetServicesGrid">
          {SERVICE_CATEGORIES.map((cat) => (
            <div key={cat.id} className="vetServiceCategory">
              <div className="vetServiceCategoryTitle">{cat.title}</div>

              {cat.items.map((item) => {
                const s = form.services[item.id];
                return (
                  <div key={item.id} className="vetServiceRow">
                    <label className="vetServiceLabel">
                      <input
                        type="checkbox"
                        checked={s.enabled}
                        onChange={() => toggleService(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>

                    <div className="vetServicePriceWrapper">
                      <input
                        type="text"
                        className="vetServicePriceInput"
                        placeholder="0"
                        value={s.price}
                        onChange={(e) => changeServicePrice(item.id, e.target.value)}
                        disabled={!s.enabled}
                      />
                      <span className="vetServicePriceCurrency">€</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="registerFieldFull">
        <div className="sectionTitle">Ημέρες & Ώρες Λειτουργίας</div>
        <div className="sectionHint">
          Επιλέξτε τις ημέρες που εργάζεστε και συμπληρώστε ώρες.
        </div>

        <div className="vetScheduleGrid">
          {DAYS.map((d) => {
            const day = form.schedule[d.id];
            return (
              <div key={d.id} className="vetScheduleRow">
                <label className="vetScheduleDayLabel">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(d.id)}
                  />
                  <span>{d.label}</span>
                </label>

                <div className="vetScheduleTimes">
                  <span>Από</span>
                  <input
                    type="time"
                    value={day.from}
                    onChange={(e) => changeDayTime(d.id, "from", e.target.value)}
                    disabled={!day.enabled}
                  />
                  <span>Έως</span>
                  <input
                    type="time"
                    value={day.to}
                    onChange={(e) => changeDayTime(d.id, "to", e.target.value)}
                    disabled={!day.enabled}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="registerFieldFull">
        <div className="registerTerms">
          Κάνοντας εγγραφή αποδέχεστε τους{" "}
          <button type="button" className="linkButton" onClick={onOpenTerms}>
            Όρους χρήσης
          </button>{" "}
          του Pet.
        </div>
        {serverError && <div className="fieldError">{serverError}</div>}

        <div className="registerActions">
          <button type="button" className="registerSecondaryButton" onClick={handleClear}>
            Απαλοιφή όλων
          </button>
          <button className="loginButton" type="submit" >
            Eγγραφή
          </button>
        </div>
        <div className="loginFooter">
          <div className="loginFooterLine">
            Είστε ήδη μέλος;{" "}
            <button type="button" className="linkButton" onClick={() => navigate("/login")}>
              Σύνδεση ως Ιδιοκτήτης / Κτηνίατρος
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
