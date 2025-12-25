import React, { useState } from "react";
import "./Login.css";
import { Link, Navigate, useNavigate } from "react-router-dom";


export default function LoginTabs({ onLogin }) {
  const [role, setRole] = useState("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  function onSubmit(e) {
    e.preventDefault();

    console.log("login:", { role, email, password });

    if (onLogin) {
      onLogin(role);
    }
    if (role === "owner") {
      navigate("/owner-dashboard");
    } else if (role === "vet") {
      navigate("/vet-dashboard");
    }
  }

  const title = role === "owner" ? "Σύνδεση Ιδιοκτήτη" : "Σύνδεση Κτηνιάτρου";

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginTabs">
          <button
            type="button"
            className={`loginTab ${role === "owner" ? "isActive" : ""}`}
            onClick={() => setRole("owner")}
          >
            Ιδιοκτήτης
          </button>
          <button
            type="button"
            className={`loginTab ${role === "vet" ? "isActive" : ""}`}
            onClick={() => setRole("vet")}
          >
            Κτηνίατρος
          </button>
        </div>
        <h2 className="loginTitle">{title}</h2>
        <form className="loginForm" onSubmit={onSubmit}>
          <label className="loginLabel">
            Email
            <input
              className="loginInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="loginLabel">
            Κωδικός
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="loginButton" type="submit">
            Σύνδεση
          </button>
          <div className="loginFooter">
            <div className="loginFooterLine">
              Δεν είστε μέλος; Κάνετε εγγραφή ως{" "}
              <Link to="/register/owner">Ιδιοκτήτης</Link> /{" "}
              <Link to="/register/vet">Κτηνίατρος</Link>
            </div>
            <div className="loginFooterLine">
              <Link to="/forgot-password">Ξεχάσατε τον κωδικό σας;</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
