import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer({ setActiveMenu }) {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-col">
          <div className="footer-title">Pet Care ΕΛΛΑΣ</div>
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
          <Link to="/about-us" className="footer-link" onClick={() => setActiveMenu(5)}
          >Σχετικά με εμάς</Link>
          <Link to="/Communication" className="footer-link" onClick={() => setActiveMenu(5)}
          >Επικοινωνήστε με εμάς</Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">Όροι Χρήσης</div>
          <Link to="/privacy-policy" className="footer-link" onClick={() => setActiveMenu(5)}
          >Πολιτική Απορρήτου</Link>
          <Link to="/terms-and-conditions" className="footer-link" onClick={() => setActiveMenu(5)}
          >Terms &amp; Conditions</Link>
          <Link to="/cookies" className="footer-link" onClick={() => setActiveMenu(5)}
          >Cookies</Link>
        </div>

        <div className="footer-col">
          <div className="footer-title">FAQ</div>
          <Link to="/FAQVet" className="footer-link" onClick={() => setActiveMenu(5)}
          >Συχνές Ερωτήσεις για Κτηνίατρος</Link>
          <Link to="/FAQOwner" className="footer-link" onClick={() => setActiveMenu(5)}
          >Συχνές Ερωτήσεις για Ιδιοκτήτες</Link>
        </div>

      </div>

      <div className="footer-bottom">
        © {2025} PetCare — All rights reserved
      </div>
    </footer>
  );
}
