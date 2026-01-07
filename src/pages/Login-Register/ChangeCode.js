import React, { useState } from "react";
import "./Login.css";
import "./Register.css";

import { useNavigate } from "react-router-dom";

export default function ChangeCode() {
  const [password0, setPassword0] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [show0, setShow0] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const navigate = useNavigate();
  const title = "Αλλαγή Κωδικού Προστασίας";


  const validate = (user) => {
    const newErrors = {};
    if (!password0) newErrors.password0 = "Συμπλήρωσε τον τρέχοντα κωδικό";
    if (!password1) newErrors.password1 = "Συμπλήρωσε νέο κωδικό";
    if (!password2) newErrors.password2 = "Επιβεβαίωσε τον νέο κωδικό";
    if (password1 && password1.length < 8) {
      newErrors.password1 = "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες";
    }
    if (password1 && password2 && password1 !== password2) {
      newErrors.password2 = "Οι νέοι κωδικοί δεν ταιριάζουν";
    }
    if (user && password0 && password0 !== user.password) {
      newErrors.password0 = "Ο τρέχων κωδικός είναι λάθος";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setErrors({ general: "Δεν βρέθηκε συνδεδεμένος χρήστης." });
      return;
    }

    if (!validate(user)) return;
    const endpoint = user.role === "owner" ? `http://localhost:3001/owners/${user.id}` : `http://localhost:3001/vets/${user.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password1 }),
      });

      if (!res.ok) {
        setErrors({ general: "Αποτυχία αλλαγής κωδικού" });
        return;
      }

      const updatesUser = { ...user, password: password1 };
      localStorage.setItem("user", JSON.stringify(updatesUser));
      alert("Ο κωδικός άλλαξε επιτυχώς");
      navigate(-1);
    } catch (err) {
      setErrors({ general: "Σφάλμα. Προσπαθήστε ξανά." });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="loginPage loginPage--change">
      <div className="changeCard">
        <h2 className="loginTitle">{title}</h2>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginLabel">
            Τρέχων κωδικός *
            <div style={{ position: "relative" }}>
              <input
                className="loginInput"
                type={show0 ? "text" : "password"}
                value={password0}
                onChange={(e) => setPassword0(e.target.value)}
              />
              <button
                type="button"
                className="button-password"
                onClick={() => setShow0(!show0)}
              >
                {show0 ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password0 && <div className="fieldError">{errors.password0}</div>}

          </label>

          <label className="loginLabel">
            Νέος κωδικός *
            <span className="changeHint">(τουλάχιστον 8 χαρακτήρες)</span>
            <div style={{ position: "relative" }}>
              <input
                className="loginInput"
                type={show1 ? "text" : "password"}
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
              <button
                type="button"
                className="button-password"
                onClick={() => setShow1(!show1)}
              >
                {show1 ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password1 && <div className="fieldError">{errors.password1}</div>}
          </label>

          <label className="loginLabel">
            Επιβεβαίωση νέου κωδικού
            <div style={{ position: "relative" }}>
              <input
                className="loginInput"
                type={show2 ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <button
                type="button"
                className="button-password"
                onClick={() => setShow2(!show2)}
              >
                {show2 ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password2 && <div className="fieldError">{errors.password2}</div>}

          </label>

          {errors.general && <div className="fieldError">{errors.general}</div>}

          <div className="registerActions">
            <button
              type="button"
              className="registerSecondaryButton"
              onClick={handleCancel}
            >
              Ακύρωση
            </button>
            <button className="loginButton" type="submit">
              Ενημέρωση
            </button>
          </div>
        </form>
      </div >
    </div >
  );
}
