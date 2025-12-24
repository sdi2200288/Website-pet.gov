import React from "react";
import { Link } from "react-router-dom";
import FaqItem from "../../../components/FAQ/FAQ";
import "./FAQ.css";
import { faqsVet } from "../../Utils/Util";

export default function FaqVets() {
    return (
        <main className="page">
            <div className="page-frame">
                <div className="page-breadcrumb">
                    <Link to="/">Αρχική</Link> / Συχνές Ερωτήσεις Κτηνιάτρων
                </div>

                <h1 className="page-title">Συχνές Ερωτήσεις Κτηνιάτρων</h1>

                <div className="faq-list">
                    {faqsVet.map((f, i) => (
                        <FaqItem key={i} question={f.question} answer={f.answer} />
                    ))}
                </div>
            </div>
        </main>
    );
}
