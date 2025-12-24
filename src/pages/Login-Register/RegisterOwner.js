import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";

export default function RegisterOwner({ onOpenTerms }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit ιδιοκτήτη");
  };

  return (
    <form className="loginForm registerForm" onSubmit={handleSubmit}>
      <label className="loginLabel">
        Όνομα: πχ ΜΑΡΙΑ με κεφαλαία
        <input type="text" className="loginInput" name="firstName" required />
      </label>

      <label className="loginLabel">
        Επώνυμο: πχ ΑΝΤΩΝΙΟΥ με κεφαλαία
        <input type="text" className="loginInput" name="lastName" required />
      </label>

      <label className="loginLabel">
        ΑΦΜ
        <input type="text" className="loginInput" name="afm" required />
      </label>

      <label className="loginLabel">
        Φύλο
        <select className="loginSelect" name="gender" required>
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
        <input type="text" className="loginInput" name="address" required />
      </label>

      <label className="loginLabel">
        Ημερομηνία γέννησης
        <input type="date" className="loginInput" name="birthDate" required />
      </label>

      <label className="loginLabel">
        Τηλέφωνο
        <input type="tel" className="loginInput" name="phone" required />
      </label>

      <label className="loginLabel">
        Email πχ. name@email.com
        <input type="email" className="loginInput" name="email" required />
      </label>

      <label className="loginLabel">
        Κωδικός (τουλάχιστον 8 ψηφία)
        <input
          type="password"
          className="loginInput"
          name="password"
          minLength={8}
          required
        />
      </label>

      <label className="loginLabel">
        Επιβεβαίωση κωδικού
        <input
          type="password"
          className="loginInput"
          name="confirmPassword"
          minLength={8}
          required
        />
      </label>

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
          <button type="reset" className="registerSecondaryButton">
            Απαλοιφή όλων
          </button>
          <button type="submit" className="loginButton">
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
