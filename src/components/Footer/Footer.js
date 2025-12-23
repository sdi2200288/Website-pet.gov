import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-col">
          <div className="footer-title">Pet</div>
          <div className="footer-small">
            Η πλατφόρμα για ιδιοκτήτες και κτηνιάτρους.
          </div>

          <div className="footer-icons">
            <Link to="/" className="icon" aria-label="Facebook">
              <FaFacebookF />
            </Link>
            <Link to="/" className="icon" aria-label="X">
              <FaXTwitter />
            </Link>
            <Link to="/" className="icon" aria-label="Instagram">
              <FaInstagram />
            </Link>
            <Link to="/" className="icon" aria-label="LinkedIn">
              <FaLinkedinIn />
            </Link>
          </div>

        </div>

        <div className="footer-col">
          <div className="footer-title">Χρειάζεστε βοήθεια;</div>
          <Link to="/about-us" className="footer-link">Σχετικά με εμάς</Link>
          <Link to="/Communication" className="footer-link">Επικοινωνήστε με εμάς</Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">Όροι Χρήσης</div>
          <Link to="/privacy-policy" className="footer-link">Πολιτική Απορρήτου</Link>
          <Link to="/terms-and-conditions" className="footer-link">Terms &amp; Conditions</Link>
          <Link to="/cookies"  className="footer-link">Cookies</Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">FAQ</div>
          <Link to="/faq-vet" className="footer-link">Συχνές Ερωτήσεις για Κτηνίατρος</Link>
          <Link to="/faq-owner" className="footer-link">Συχνές Ερωτήσεις για Ιδιοκτήτες</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {2025} PetCare — All rights reserved
      </div>
    </footer>
  );
}
