import React, { useState } from "react";
import "./FAQ.css"
export default function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
            <button
                type="button"
                className="faq-question"
                onClick={() => setOpen(!open)}
            >
                <span>{question}</span>
                <span className={`faq-triangle ${open ? "open" : ""}`}>
                    ▼
                </span>
            </button>
            {open && <div className="faq-answer">{answer}</div>}
        </div>
    );
}
