import React, { useState } from "react";
import "./Login.css";
import "./Register.css";

import { useNavigate } from "react-router-dom";

export default function ChangeCode() {
  const [password0, setPassword0] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error,setError] = useState("");

  const navigate = useNavigate();

  const title = "Αλλαγή Κωδικού Προστασίας";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // εδώ θα μπει το submit logic σου

    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
      setError("Δεν υπάρχει συνδεδεμένος χρήστης");
      return;
    }

    //έλεγχος τρέχοντος κωδικού
    if(password0 != user.password){
      setError("Ο τρέχων κωδικός είναι λάθος");
      return;
    }

    //έλεγχος νέων κωδικών
    if(password1.length < 8){
      setError("Ο νέος κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες");
      return;
    }

    if(password1!=password2){
      setError("Οι νέοι κωδικοί δεν ταιριάζουν");
      return;
    }

    const endpoint = 
      user.role === "owner"
        ? `http://localhost:3001/owners/${user.id}`
        : `http://localhost:3001/vets/${user.id}`;
    
    try{
        const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password1 }),
      });

      if(!res.ok){
        setError("Αποτυχία αλλαγής κωδικού");
        return;
      }

      const updatesUser = { ...user, password: password1 };
      localStorage.setItem("user", JSON.stringify(updatesUser));
      alert("Ο κωδικός άλλαξε επιτυχώς");
      navigate(-1);
    }catch(err){
      setError("Σφάλμα. Προσπαθήστε ξανά.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // ή όπου θέλεις να γυρίζει
  };

  return (
    <div className="loginPage loginPage--change">
      <div className="changeCard">
        <h2 className="loginTitle">{title}</h2>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginLabel">
            Τρέχων κωδικός *
            <input
              className="loginInput"
              type="password"
              value={password0}
              onChange={(e) => setPassword0(e.target.value)}
              required
            />
          </label>

          <label className="loginLabel">
            Νέος κωδικός *
            <span className="changeHint">(τουλάχιστον 8 χαρακτήρες)</span>
            <input
              className="loginInput"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </label>

          <label className="loginLabel">
            Επιβεβαίωση νέου κωδικού *
            <input
              className="loginInput"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </label>
          
          {error && <div className="fieldError">{error}</div>}

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
      </div>
    </div>
  );
}
