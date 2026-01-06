import React, { useState } from "react";
import "./Register.css";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";


export default function LoginTabs({ onLogin }) {
  const [role, setRole] = useState("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Πρέπει να συμπληρωθεί το email";
    else if (!email.includes("@")) newErrors.email = "Μη έγκυρο email";
    if (!password) newErrors.password = "Πρέπει να συμπληρωθεί ο κωδικός";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setErrors({});
    if (!validate()) return;

    const endpoint = role === "owner" ? "http://localhost:3001/owners" : "http://localhost:3001/vets";

    try {
      const res = await fetch(`${endpoint}?email=${email}`);
      const data = await res.json();

      if (data.length === 0) {
        setServerError("Δεν υπάρχει χρήστης με αυτό το email");
        return;
      }

      const user = data[0];
      if (user.password !== password) {
        setServerError("Λάθος κωδικός");
        return;
      }
      onLogin({ ...user, role });
      if (role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/vet-dashboard");
      }
    } catch (err) {
      setServerError("Σφάλμα σύνδεσης. Προσπαθήστε ξανά.");
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
            onClick={() => {
              if (role === "vet") {
                setEmail("")
                setPassword("")
                setErrors({})
                setServerError("")
                setRole("owner")
              }
            }}
          >
            Ιδιοκτήτης
          </button>
          <button
            type="button"
            className={`loginTab ${role === "vet" ? "isActive" : ""}`}
           onClick={() => {
              if (role === "owner") {
                setEmail("")
                setPassword("")
                setErrors({})
                setServerError("")
                setRole("vet")
              }
            }}
          >
            Κτηνίατρος
          </button>
        </div>
        <h2 className="loginTitle">{title}</h2>
        <form className="loginForm" onSubmit={onSubmit} noValidate>
          <label className="loginLabel">
            Email *
            <input
              className={`loginInput ${errors.email ? "inputError" : ""}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="fieldError">{errors.email}</div>}
          </label>
          <label className="loginLabel">
            Κωδικός *
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className={`loginInput ${errors.password ? "inputError" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {serverError && <div className="fieldError">{serverError}</div>}
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
