import React, { useState } from "react";
import "./Login.css";
import "./Register.css";

import { useNavigate } from "react-router-dom";

export default function ChangeCode() {
  const [password0, setPassword0] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  const title = "Αλλαγή Κωδικού Προστασίας";

  const handleSubmit = (e) => {
    e.preventDefault();
    // εδώ θα μπει το submit logic σου
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
