
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./RoleMismatch.css";

export default function RoleMismatch({ expectedRole,onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // προσωρινή παράκαμψη
  const [ignoreMismatch, setIgnoreMismatch] = useState(false);

  // Η σελίδα από την οποία ήρθε ο χρήστης
  const from = location.state?.from || "/"; // αν δεν υπάρχει, πάει στην αρχική

  const handleYes = () => {
    // Πάει στο login για σωστό role
    if(onLogout) onLogout();
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleNo = () => {
    setIgnoreMismatch(true); // παράκαμψη μέχρι να φύγει / αλλάξει user
    navigate(from); // επιστροφή πισω
  };

  // Αν ο χρήστης αποφάσισε να αγνοήσει mismatch → απλώς render children
  if (ignoreMismatch) return null;

  return (
     <div className="roleMismatchOverlay">
      <div className="roleMismatchModal">
        <h2>Προειδοποίηση Ρόλου</h2>
        <p>
          Είσαι {expectedRole === "vet" ? "Ιδιοκτήτης" : "Κτηνίατρος"}!<br />
          Αν θέλεις να συνδεθείς με το σωστό προφίλ, κάνε logout.
        </p>
        <div className="roleMismatchButtons">
          <button className="yesButton" onClick={handleYes}>Ναι</button>
          <button className="noButton" onClick={handleNo}>Όχι</button>
        </div>
      </div>
    </div>
  );
}
