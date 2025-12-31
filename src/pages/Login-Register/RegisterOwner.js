import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
const API_URL = "http://localhost:3001/owners";

export default function RegisterOwner({ onOpenTerms, onRegister }) {
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
    address: "",
    birthdate: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function handleClear() {
    setForm({
      firstname: "",
      lastname: "",
      afm: "",
      gender: "",
      address: "",
      birthdate: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    setErrors({});
    setServerError("");
  }

  const validate = () => {
    const newErrors = {};
    if (!form.firstname.trim()) newErrors.firstname = "Πρέπει να συμπληρωθεί το όνομα";
    if (!form.lastname.trim()) newErrors.lastname = "Πρέπει να συμπληρωθεί το επώνυμο";
    if (!/^[Α-ΩA-Z]+$/.test(form.firstname.trim())) newErrors.firstname = "Το όνομα πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!/^[Α-ΩA-Z]+$/.test(form.lastname.trim())) newErrors.lastname = "Το επώνυμο πρέπει να είναι μόνο κεφαλαία γράμματα";
    if (!/^\d{10}$/.test(form.afm)) newErrors.afm = "Το ΑΦΜ πρέπει να έχει 10 αριθμούς";
    if (!form.gender) newErrors.gender = "Πρέπει να επιλέξετε φύλο";
    if (!form.address.trim()) newErrors.address = "Πρέπει να συμπληρωθεί η διεύθυνση";
    if (!form.birthdate) newErrors.birthdate = "Πρέπει να συμπληρωθεί η ημερομηνία γέννησης";
    if (!/^\d{10,15}$/.test(form.phone)) newErrors.phone = "Το τηλέφωνο πρέπει να είναι αριθμός 10-15 ψηφίων";
    if (!form.email.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (form.password.length < 8) newErrors.password = "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Οι κωδικοί δεν ταιριάζουν";
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
      const submitData = { ...form };
      delete submitData.confirmPassword;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
      if (res.ok) {
        const user = await res.json();
        onRegister({ ...user, role: "owner" });
        navigate("/owner-dashboard");;
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
    <form noValidate className="loginForm registerForm">
      <label className="loginLabel">
        Όνομα: πχ ΜΑΡΙΑ με κεφαλαία
        <input type="text" className={`loginInput ${errors.firstname ? "inputError" : ""}`} name="firstname" value={form.firstname} onChange={handleChange} required />
        {errors.firstname && <div className="fieldError">{errors.firstname}</div>}
      </label>

      <label className="loginLabel">
        Επώνυμο: πχ ΑΝΤΩΝΙΟΥ με κεφαλαία
        <input type="text" className={`loginInput ${errors.lastname ? "inputError" : ""}`} name="lastname" value={form.lastname} onChange={handleChange} required />
        {errors.lastname && <div className="fieldError">{errors.lastname}</div>}
      </label>

      <label className="loginLabel">
        ΑΦΜ
        <input type="number" className={`loginInput ${errors.afm ? "inputError" : ""}`}
          name="afm" value={form.afm} onChange={handleChange} required />
        {errors.afm && <div className="fieldError">{errors.afm}</div>}
      </label>

      <label className="loginLabel">
        Φύλο
        <select className="loginSelect" name="gender" value={form.gender} onChange={handleChange} required>
          <option value="" hidden>
            Επιλέξτε φύλο
          </option>
          <option value="male">Άνδρας</option>
          <option value="female">Γυναίκα</option>
          <option value="other">Άλλο</option>
        </select>
      </label>

      <label className="loginLabel">
        Διεύθυνση (Οδός αριθμός Πόλη Χώρα)
        <input type="text" className={`loginInput ${errors.address ? "inputError" : ""}`}
          name="address" value={form.address} onChange={handleChange} required />
        {errors.address && <div className="fieldError">{errors.address}</div>}
      </label>

      <label className="loginLabel">
        Ημερομηνία γέννησης
        <input type="date" className={`loginInput ${errors.birthdate ? "inputError" : ""}`}
          name="birthdate" value={form.birthdate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} required />
        {errors.birthdate && <div className="fieldError">{errors.birthdate}</div>}
      </label>

      <label className="loginLabel">
        Τηλέφωνο
        <input type="number" className={`loginInput ${errors.phone ? "inputError" : ""}`}
          name="phone" value={form.phone} onChange={handleChange} required />
        {errors.phone && <div className="fieldError">{errors.phone}</div>}
      </label>

      <label className="loginLabel">
        Email πχ. name@email.com
        <input type="email" className={`loginInput ${errors.email ? "inputError" : ""}`}
          name="email" value={form.email} onChange={handleChange} required />
        {errors.email && <div className="fieldError">{errors.email}</div>}
      </label>

      <label className="loginLabel">
        Κωδικός (τουλάχιστον 8 ψηφία)
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className={`loginInput ${errors.password ? "inputError" : ""}`}
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />
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
        Επιβεβαίωση κωδικού
        <div style={{ position: "relative" }}>

          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`loginInput ${errors.confirmPassword ? "inputError" : ""}`}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength={8}
            required
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
      {serverError && <div className="fieldError">{serverError}</div>}

      <div className="registerFieldFull registerTerms">
        Κάνοντας εγγραφή αποδέχεστε τους{" "}
        <button
          type="button"
          className="linkButton"
          onClick={onOpenTerms}
        >
          Όρους χρήσης του Pet.
        </button>
      </div>

      <div className="registerFieldFull">
        <div className="registerActions">
          <button type="reset" className="registerSecondaryButton" onClick={handleClear}>
            Απαλοιφή όλων
          </button>
          <button type="submit" className="loginButton" onClick={handleSubmit}>
            Εγγραφή
          </button>
        </div>
      </div>

      <div className="registerFieldFull loginFooter">
        <div className="loginFooterLine">
          Είστε ήδη μέλος;{" "}
          <button
            type="button"
            className="linkButton"
            onClick={() => navigate("/login")}
          >
            Σύνδεση ως Ιδιοκτήτης / Κτηνίατρος
          </button>
        </div>
      </div>
    </form>
  );
}

