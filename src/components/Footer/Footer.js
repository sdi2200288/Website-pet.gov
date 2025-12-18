import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-col">
          <div className="footer-title">PetCare</div>
          <div className="footer-small">
            Η πλατφόρμα για ιδιοκτήτες και κτηνιάτρους.
          </div>

          <div className="footer-icons">
          <a href="#" className="icon" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" className="icon" aria-label="X">
            <FaXTwitter />
          </a>
          <a href="#" className="icon" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" className="icon" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>

        </div>

        <div className="footer-col">
          <div className="footer-title">Χρειάζεστε βοήθεια;</div>
          <a href="#about" className="footer-link">Σχετικά με εμάς</a>
          <a href="#contact" className="footer-link">Επικοινωνήστε με εμάς</a>
        </div>

        <div className="footer-col">
          <div className="footer-title">Όροι Χρήσης</div>
          <a href="#privacy" className="footer-link">Πολιτική Απορρήτου</a>
          <a href="#terms" className="footer-link">Terms &amp; Conditions</a>
          <a href="#cookies" className="footer-link">Cookies</a>
        </div>

        <div className="footer-col">
          <div className="footer-title">FAQ</div>
          <a href="#faq-vet" className="footer-link">Συχνές Ερωτήσεις για Κτηνίατρος</a>
          <a href="#faq-owner" className="footer-link">Συχνές Ερωτήσεις για Ιδιοκτήτες</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {2025} PetCare — All rights reserved
      </div>
    </footer>
  );
}
