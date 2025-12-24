import React from "react";
import { Link } from "react-router-dom";
import FaqItem from "../../../components/FAQ/FAQ";
import "./FAQ.css";
import { faqsOwner } from "../../Utils/Util";

export default function FaqOwners() {
    return (
        <main className="page">
            <div className="page-frame">
                <div className="page-breadcrumb">
                    <Link to="/">Αρχική</Link> / Συχνές Ερωτήσεις Ιδιοκτητών
                </div>

                <h1 className="page-title">Συχνές Ερωτήσεις Ιδιοκτητών</h1>

                <div className="faq-list">
                    {faqsOwner.map((f, i) => (
                        <FaqItem key={i} question={f.question} answer={f.answer} />
                    ))}
                </div>
            </div>
        </main>
    );
}
