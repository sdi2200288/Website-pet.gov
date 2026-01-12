import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
import { DAYS, SERVICE_CATEGORIES, VET_SPECIALIZATIONS, REGIONS, STUDY_LEVELS, } from "../Utils/Util";

function buildInitialServicesState() {
  const out = {};
  SERVICE_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      out[item.id] = { enabled: false, price: "" };
    });
  });
  return out;
}

function buildInitialScheduleState() {
  const out = {};
  DAYS.forEach((d) => {
    out[d.id] = { enabled: false, from: "09:00", to: "17:00" };
  });
  return out;
}

function mergeServices(defaultServices, dbServices) {
  const out = { ...defaultServices };
  if (!dbServices) return out;
  for (const [k, v] of Object.entries(dbServices)) {
    if (!out[k]) out[k] = { enabled: false, price: "" };
    out[k] = {
      enabled: Boolean(v?.enabled),
      price: v?.price ?? "",
    };
  }
  return out;
}

function mergeSchedule(defaultSchedule, dbSchedule) {
  const out = { ...defaultSchedule };
  if (!dbSchedule) return out;
  for (const [k, v] of Object.entries(dbSchedule)) {
    if (!out[k]) out[k] = { enabled: false, from: "09:00", to: "17:00" };
    out[k] = {
      enabled: Boolean(v?.enabled),
      from: v?.from ?? out[k].from ?? "09:00",
      to: v?.to ?? out[k].to ?? "17:00",
    };
  }
  return out;
}

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isVet = user?.role === "vet";
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const vetInitial = {
    firstname: "",
    lastname: "",
    afm: "",
    gender: "",
    birthdate: "",
    email: "",
    address: "",
    phone: "",
    specializations: [],
    region: "",
    studyLevel: "",
    experience: "",
    photoFile: null,
    services: buildInitialServicesState(),
    schedule: buildInitialScheduleState(),
  };

  const ownerInitial = {
    firstname: "",
    lastname: "",
    afm: "",
    gender: "",
    address: "",
    birthdate: "",
    phone: "",
    email: "",
  };

  const [form, setForm] = useState(isVet ? vetInitial : ownerInitial);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "vet")) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const url = isVet ? `http://localhost:3001/vets/${user.id}` : `http://localhost:3001/owners/${user.id}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (isVet) {
          const defaultServices = buildInitialServicesState();
          const defaultSchedule = buildInitialScheduleState();
          setForm((prev) => ({
            ...prev,
            id: data.id,
            firstname: data.firstname ?? "",
            lastname: data.lastname ?? "",
            afm: data.afm ?? "",
            gender: data.gender ?? "",
            birthdate: data.birthdate ?? "",
            email: data.email ?? "",
            address: data.address ?? "",
            phone: data.phone ?? "",
            specializations: data.specializations ?? [],
            region: data.region ?? "",
            studyLevel: data.studyLevel ?? "",
            experience: data.experience ?? "",
            photoFile: null,
            services: mergeServices(defaultServices, data.services),
            schedule: mergeSchedule(defaultSchedule, data.schedule),
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            id: data.id,
            firstname: data.firstname ?? "",
            lastname: data.lastname ?? "",
            afm: data.afm ?? "",
            gender: data.gender ?? "",
            address: data.address ?? "",
            birthdate: data.birthdate ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
          }));
        }
      } catch {
      }
    })();
  }, [user?.id, isVet]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handlePhoneChange(e) {
    const v = e.target.value.replace(/\D/g, "").slice(0, 15);
    setForm((prev) => ({ ...prev, phone: v }));
    setErrors((prev) => ({ ...prev, phone: "" }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photoFile: file }));
  }

  function handleClear() {
    setErrors({});
    setServerError("");
    navigate(-1);
  }

  function toggleSpecialization(spec) {
    setForm((prev) => {
      const exists = (prev.specializations || []).includes(spec);
      return {
        ...prev,
        specializations: exists
          ? prev.specializations.filter((s) => s !== spec)
          : [...(prev.specializations || []), spec],
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
      const normalized = value === "" ? "" : value.replace(/^0+(?=\d)/, "");
      setForm((prev) => ({
        ...prev,
        services: {
          ...prev.services,
          [serviceId]: { ...prev.services[serviceId], price: normalized },
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
        [dayId]: { ...prev.schedule[dayId], [field]: value },
      },
    }));
  }

  const validateVet = () => {
    const newErrors = {};
    if (!form.firstname?.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    if (!form.lastname?.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    if (!/^[Α-ΩA-Z]+$/.test(form.firstname?.trim() || "")) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!/^[Α-ΩA-Z]+$/.test(form.lastname?.trim() || "")) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!form.gender) newErrors.gender = "Πρέπει να επιλέξετε φύλο";
    if (!form.birthdate) newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης";
    if (!form.address?.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!form.phone) newErrors.phone = "Πρέπει να συμπληρωθεί το τηλέφωνο";
    else if (!/^\d{10,15}$/.test(form.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι 10–15 ψηφία";
    if (!form.email?.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (!form.specializations || form.specializations.length === 0) newErrors.specializations = "Πρέπει να επιλέξετε τουλάχιστον μία ειδικότητα";
    if (!form.region) newErrors.region = "Πρέπει να επιλέξετε περιοχή";
    if (!form.studyLevel) newErrors.studyLevel = "Πρέπει να επιλέξετε επίπεδο σπουδών";
    if (form.experience === "" || Number(form.experience) < 0) newErrors.experience = "Πρέπει να εισάγετε έγκυρα έτη εμπειρίας";

    for (const [, s] of Object.entries(form.services || {})) {
      if (s.enabled && (s.price === "" || Number(s.price) <= 0)) {
        newErrors.services = "Όλες οι επιλεγμένες υπηρεσίες πρέπει να έχουν έγκυρη τιμή";
        break;
      }
    }

    for (const [, d] of Object.entries(form.schedule || {})) {
      if (d.enabled) {
        if (!d.from || !d.to) {
          newErrors.schedule = "Όλες οι επιλεγμένες ημέρες πρέπει να έχουν ώρα έναρξης και λήξης";
          break;
        }
        if (d.from >= d.to) {
          newErrors.schedule = "Η ώρα έναρξης πρέπει να είναι μικρότερη από την ώρα λήξης";
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOwner = () => {
    const newErrors = {};
    if (!form.firstname?.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    if (!form.lastname?.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    if (!/^[Α-ΩA-Z]+$/.test(form.firstname?.trim() || "")) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!/^[Α-ΩA-Z]+$/.test(form.lastname?.trim() || "")) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!form.phone) newErrors.phone = "Πρέπει να συμπληρωθεί το τηλέφωνο";
    else if (!/^\d{10,15}$/.test(form.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι 10–15 ψηφία";
    if (!form.gender) newErrors.gender = "Πρέπει να επιλέξετε φύλο";
    if (!form.address?.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!form.birthdate) newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης";
    if (!form.email?.includes("@")) newErrors.email = "Μη έγκυρο email";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const ok = isVet ? validateVet() : validateOwner();
    if (!ok) return;

    try {
      const url = isVet ? `http://localhost:3001/vets/${user.id}` : `http://localhost:3001/owners/${user.id}`;
      let submitData = { ...form };
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
        navigate(-1);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setServerError(errorData.message || "Σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
      }
    } catch {
      setServerError("Σφάλμα. Παρακαλώ δοκιμάστε ξανά.");
    }
  };

  if (!user) return null;

  return (
    <div className="owner-profile">
      {/* OWNER */}
      {!isVet && (
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
            Φύλο *
            <select className="loginSelect" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Επιλέξτε φύλο</option>
              <option value="Άνδρας">Άνδρας</option>
              <option value="Γυναίκα">Γυναίκα</option>
              <option value="Άλλο">Άλλο</option>
            </select>
            {errors.gender && <div className="fieldError">{errors.gender}</div>}
          </label>

          <label className="loginLabel">
            Ημερομηνία γέννησης *
            <input type="date" className={`loginInput ${errors.birthdate ? "inputError" : ""}`} name="birthdate" value={form.birthdate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
            {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
          </label>

          <label className="loginLabel">
            Διεύθυνση *
            <input type="text" className={`loginInput ${errors.address ? "inputError" : ""}`} name="address" value={form.address} onChange={handleChange}
            />
            {errors.address && <div className="fieldError">{errors.address}</div>}
          </label>

          <label className="loginLabel">
            Τηλέφωνο *
            <input type="text"
              inputMode="numeric" pattern="\d*" maxLength={15} className={`loginInput ${errors.phone ? "inputError" : ""}`}
              name="phone" value={form.phone} onChange={handlePhoneChange}
            />
            {errors.phone && <div className="fieldError">{errors.phone}</div>}
          </label>

          <label className="loginLabel">
            Email *
            <input type="email" className={`loginInput ${errors.email ? "inputError" : ""}`} name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="fieldError">{errors.email}</div>}
          </label>

          {serverError && <div className="fieldError">{serverError}</div>}

          <div className="registerFieldFull">
            <div className="registerActions">
              <button type="button" className="registerSecondaryButton" onClick={handleClear}> Ακύρωση </button>
              <button className="loginButton" type="submit"> Ενημέρωση </button>
            </div>
          </div>
        </form>
      )}

      {/* VET */}
      {isVet && (
        <form noValidate className="loginForm registerForm" onSubmit={handleSubmit}>
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
            Φύλο *
            <select className="loginSelect" name="gender" value={form.gender} onChange={handleChange}>
              <option value="" hidden>
                Επιλέξτε φύλο
              </option>
              <option value="Άνδρας">Άνδρας</option>
              <option value="Γυναίκα">Γυναίκα</option>
              <option value="Άλλο">Άλλο</option>
            </select>
            {errors.gender && <div className="fieldError">{errors.gender}</div>}
          </label>

          <label className="loginLabel">
            Ημερομηνία γέννησης *
            <input type="date" className={`loginInput ${errors.birthdate ? "inputError" : ""}`} name="birthdate" value={form.birthdate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
            {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
          </label>

          <label className="loginLabel registerFieldFull">
            <div className="sectionTitle">Ειδικεύσεις *</div>
            <div className="specializationsGrid">
              {VET_SPECIALIZATIONS.map((s) => (
                <label key={s} className="specializationItem">
                  <input type="checkbox" checked={(form.specializations || []).includes(s)} onChange={() => toggleSpecialization(s)} />
                  {s}
                </label>
              ))}
            </div>
            {errors.specializations && <div className="fieldError">{errors.specializations}</div>}
          </label>

          <label className="loginLabel">
            Περιοχή *
            <select className="loginSelect" name="region" value={form.region} onChange={handleChange}>
              <option value="">Επιλέξτε νομό</option>
              {REGIONS.map((r) => (<option key={r} value={r}> {r}</option>))}
            </select>
            {errors.region && <div className="fieldError">{errors.region}</div>}
          </label>

          <label className="loginLabel">
            Διεύθυνση *
            <input type="text" className={`loginInput ${errors.address ? "inputError" : ""}`} name="address" value={form.address} onChange={handleChange} />
            {errors.address && <div className="fieldError">{errors.address}</div>}
          </label>

          <label className="loginLabel">
            Επίπεδο σπουδών *
            <select className="loginSelect" name="studyLevel" value={form.studyLevel} onChange={handleChange}>
              <option value="">Επιλέξτε επίπεδο</option>
              {STUDY_LEVELS.map((s) => (<option key={s} value={s}>{s}</option>))}
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
            <input type="text" inputMode="numeric"
              pattern="\d*" maxLength={15} className={`loginInput ${errors.phone ? "inputError" : ""}`} name="phone" value={form.phone} onChange={handlePhoneChange}
            />
            {errors.phone && <div className="fieldError">{errors.phone}</div>}
          </label>

          <label className="loginLabel">
            Email *
            <input type="email" className={`loginInput ${errors.email ? "inputError" : ""}`} name="email" value={form.email} onChange={handleChange} />
            {errors.email && <div className="fieldError">{errors.email}</div>}
          </label>

          {/* photo (δεν αποθηκεύεται σε JSON PATCH όπως είναι) */}
          <div className="registerFieldFull">
            <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoChange} style={{ display: "none" }} />
            <button type="button" className="registerSecondaryButton" onClick={() => photoInputRef.current?.click()}>
              Προσθήκη Φωτογραφίας
            </button>
            {form.photoFile && <div className="registerPhotoName">Επιλέχθηκε: {form.photoFile.name}</div>}
          </div>

          {/* services */}
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
                    const s = form.services?.[item.id] ?? { enabled: false, price: "" };
                    return (
                      <div key={item.id} className="vetServiceRow">
                        <label className="vetServiceLabel">
                          <input type="checkbox" checked={s.enabled} onChange={() => toggleService(item.id)} />
                          <span>{item.label}</span>
                        </label>

                        <div className="vetServicePriceWrapper">
                          <input type="text" className="vetServicePriceInput" placeholder="0" value={s.price} onChange={(e) => changeServicePrice(item.id, e.target.value)} disabled={!s.enabled} />
                          <span className="vetServicePriceCurrency">€</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {errors.services && <div className="fieldError">{errors.services}</div>}
          </div>

          {/* schedule */}
          <div className="registerFieldFull">
            <div className="sectionTitle">Ημέρες & Ώρες Λειτουργίας</div>
            <div className="sectionHint">Επιλέξτε τις ημέρες που εργάζεστε και συμπληρώστε ώρες.</div>

            <div className="vetScheduleGrid">
              {DAYS.map((d) => {
                const day = form.schedule?.[d.id] ?? { enabled: false, from: "09:00", to: "17:00" };
                return (
                  <div key={d.id} className="vetScheduleRow">
                    <label className="vetScheduleDayLabel">
                      <input type="checkbox" checked={day.enabled} onChange={() => toggleDay(d.id)} />
                      <span>{d.label}</span>
                    </label>

                    <div className="vetScheduleTimes">
                      <span>Από</span>
                      <input type="time" value={day.from} onChange={(e) => changeDayTime(d.id, "from", e.target.value)} disabled={!day.enabled} />
                      <span>Έως</span>
                      <input type="time" value={day.to} onChange={(e) => changeDayTime(d.id, "to", e.target.value)} disabled={!day.enabled} />
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.schedule && <div className="fieldError">{errors.schedule}</div>}
          </div>

          {serverError && <div className="fieldError">{serverError}</div>}

          <div className="registerFieldFull">
            <div className="registerActions">
              <button type="button" className="registerSecondaryButton" onClick={handleClear}> Ακύρωση</button>
              <button className="loginButton" type="submit"> Ενημέρωση </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
