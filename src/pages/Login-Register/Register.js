import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "./Register.css";
import RegisterOwner from "./RegisterOwner";
import RegisterVet from "./RegisterVet";
import TermsAndConditions from "../FooterPages/Others/TermsAndConditions";

export default function Register({ role }) {
  const navigate = useNavigate();
  const isOwner = role === "owner";
  const [showTermsModal, setShowTermsModal] = useState(false);
  const title = isOwner ? "Εγγραφή Νέου Ιδιοκτήτη" : "Εγγραφή Νέου Κτηνίατρου";
  const openTerms = () => setShowTermsModal(true);
  const closeTerms = () => setShowTermsModal(false);

  return (
    <>
      <div className="loginPage">
        <div className="loginCard">
          <div className="loginTabs">
            <button
              type="button"
              className={`loginTab ${isOwner ? "isActive" : ""}`}
              onClick={() => navigate("/register/owner")}
            >
              Ιδιοκτήτης
            </button>
            <button
              type="button"
              className={`loginTab ${!isOwner ? "isActive" : ""}`}
              onClick={() => navigate("/register/vet")}
            >
              Κτηνίατρος
            </button>
          </div>

          <h2 className="loginTitle">{title}</h2>
          <p className="registerSubtitle">Όλα τα πεδία είναι ΥΠΟΧΡΕΩΤΙΚΑ</p>

          {isOwner ? (
            <RegisterOwner onOpenTerms={openTerms} />
          ) : (
            <RegisterVet onOpenTerms={openTerms} />
          )}
        </div>
      </div>

      {showTermsModal && (
        <div className="termsModalOverlay" onClick={closeTerms}>
          <div
            className="termsModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="termsModalClose"
              onClick={closeTerms}
              aria-label="Κλείσιμο"
            >
              ×
            </button>

            <div className="termsModalBody">
              <TermsAndConditions />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
