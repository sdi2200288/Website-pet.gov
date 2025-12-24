import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
import { DAYS, SERVICE_CATEGORIES, VET_SPECIALIZATIONS, REGIONS, GENDERS, STUDY_LEVELS } from "../Utils/Util";


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

const initialVetState = {
  firstName: "",
  lastName: "",
  afm: "",
  gender: "",
  birthDate: "",
  email: "",
  address: "",
  phone: "",
  password: "",
  confirmPassword: "",
  specializations: [],
  region: "",
  studyLevel: "",
  experienceYears: "",
  photoFile: null,
  services: buildInitialServicesState(),
  schedule: buildInitialScheduleState(),
};

export default function RegisterVet({ onOpenTerms }) {
  const [form, setForm] = useState(initialVetState);
  const [error, setError] = useState("");
  const photoInputRef = useRef(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        specializations: exists
          ? prev.specializations.filter((s) => s !== spec)
          : [...prev.specializations, spec],
      };
    });
  }

  function toggleService(serviceId) {
    setForm((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: {
          ...prev.services[serviceId],
          enabled: !prev.services[serviceId].enabled,
        },
      },
    }));
  }

  function changeServicePrice(serviceId, value) {
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setForm((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          [serviceId]: {
            ...prev.services[serviceId],
            price: value,
          },
        },
      }));
    }
  }

  function toggleDay(dayId) {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayId]: {
          ...prev.schedule[dayId],
          enabled: !prev.schedule[dayId].enabled,
        },
      },
    }));
  }

  function changeDayTime(dayId, field, value) {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [dayId]: {
          ...prev.schedule[dayId],
          [field]: value,
        },
      },
    }));
  }

  function handleClear() {
    setForm(initialVetState);
    setError("");
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    console.log("Register vet");
    navigate("/vet-dashboard");
  }

  return (
    <form className="registerForm" onSubmit={handleSubmit}>
      <label className="loginLabel">
        Όνομα πχ ΜΑΡΙΑ με κεφαλαία
        <input
          className="loginInput"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Επώνυμο πχ ΑΝΤΩΝΙΟΥ με κεφαλαία
        <input
          className="loginInput"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        ΑΦΜ
        <input
          className="loginInput"
          name="afm"
          value={form.afm}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Φύλο
        <select
          className="loginSelect"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Επιλέξτε φύλο</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <div className="loginLabel registerFieldFull">
        <div className="sectionTitle">Ειδικεύσεις (επιλέξτε μία ή περισσότερες)</div>
        <div className="specializationsGrid">
          {VET_SPECIALIZATIONS.map((s) => (
            <label key={s} className="specializationItem">
              <input
                type="checkbox"
                checked={form.specializations.includes(s)}
                onChange={() => toggleSpecialization(s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <label className="loginLabel">
        Ημερομηνία γέννησης
        <input
          className="loginInput"
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Περιοχή (Νομός)
        <select
          className="loginSelect"
          name="region"
          value={form.region}
          onChange={handleChange}
          required
        >
          <option value="">Επιλέξτε νομό</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="loginLabel registerFieldFull">
        Διεύθυνση (Οδός αριθμός Πόλη Χώρα)
        <input
          className="loginInput"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Επίπεδο σπουδών
        <select
          className="loginSelect"
          name="studyLevel"
          value={form.studyLevel}
          onChange={handleChange}
          required
        >
          <option value="">Επιλέξτε επίπεδο</option>
          {STUDY_LEVELS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="loginLabel">
        Εμπειρία (Έτη)
        <input
          className="loginInput"
          type="number"
          min="0"
          name="experienceYears"
          value={form.experienceYears}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Τηλέφωνο
        <input
          className="loginInput"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Email πχ. name@gmail.com
        <input
          className="loginInput"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>
      <label className="loginLabel">
        Κωδικός (τουλάχιστον 8 ψηφία)
        <input
          className="loginInput"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          required
        />
      </label>
      <label className="loginLabel">
        Επιβεβαίωση κωδικού
        <input
          className="loginInput"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          minLength={8}
          required
        />
      </label>
      <div className="registerFieldFull">
        <input
          type="file"
          accept="image/*"
          ref={photoInputRef}
          onChange={handlePhotoChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="registerSecondaryButton"
          onClick={() => photoInputRef.current?.click()}
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
        {error && <div className="registerError">{error}</div>}
        <div className="registerActions">
          <button type="button" className="registerSecondaryButton" onClick={handleClear}>
            Απαλοιφή όλων
          </button>
          <button className="loginButton" type="submit">
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
