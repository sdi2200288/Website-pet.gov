import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [afm, setAfm] = useState("");
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!afm) {
            setError("Πρέπει να συμπληρωθεί το ΑΦΜ");
            return false;
        }
        if (!/^\d{10}$/.test(afm)) {
            setError("Το ΑΦΜ πρέπει να αποτελείται από 10 ψηφία");
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setServerError("");
        if (!validate()) return;
        setLoading(true);
        try {
            const ownersRes = await fetch(`http://localhost:3001/owners?afm=${afm}`);
            const ownersData = await ownersRes.json();
            const vetsRes = await fetch(`http://localhost:3001/vets?afm=${afm}`);
            const vetsData = await vetsRes.json();
            if (ownersData.length === 0 && vetsData.length === 0) {
                setServerError("Δεν υπάρχει χρήστης με αυτό το ΑΦΜ");
                return;
            }
            setLoading(false);
            alert("Βρέθηκε χρήστης με αυτό το ΑΦΜ. Έχουν σταλεί οδηγίες ανάκτησης κωδικού");
        } catch (err) {
            setServerError("Σφάλμα επικοινωνίας");
        }
    };

    return (
        <div className="loginPage">
            <div className="loginCard">
                <h2 className="loginTitle">Ανάκτηση Κωδικού</h2>
                <h5 className="loginTitle">  Εισάγετε το ΑΦΜ σας και θα σας στείλουμε μήνυμα με τις οδηγίες ανάκτησης στο email σας </h5>
                <form className="loginForm" onSubmit={onSubmit} noValidate>
                    <label className="loginLabel">
                        ΑΦΜ *
                        <input className={`loginInput ${error || serverError ? "inputError" : ""}`} type="text" value={afm} onChange={(e) => setAfm(e.target.value)} maxLength={10} />
                    </label>
                    {error && <div className="fieldError">{error}</div>}
                    {serverError && <div className="fieldError">{serverError}</div>}
                    <button className="loginButton" type="submit" disabled={loading}> {loading ? "Έλεγχος..." : "Αποστολή"} </button>
                    <div className="loginFooter">
                        <div className="loginFooterLine">
                            Δεν είστε μέλος; Κάνετε εγγραφή ως{" "}
                            <Link to="/register/owner">Ιδιοκτήτης</Link> /{" "}
                            <Link to="/register/vet">Κτηνίατρος</Link>
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
                    </div>
                </form>
            </div>
        </div>
    );
}
