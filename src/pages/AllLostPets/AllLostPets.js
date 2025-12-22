import React from "react";
import Footer from "../../components/Footer/Footer";
import ArxikiVet from "../../images/XamenaKatoikidia.png";
import "./AllLostPets.css";
import { Link } from "react-router-dom";
import XamenaKatoikidia from "../../images/XamenaKatoikidia.png";

export default function AllLostPets() {
  return (
    <div className="AllLostPages">
      <section className="hero-section">
        <img src={XamenaKatoikidia} alt="XamenaKatoikidia" className="main-image" />
      </section>
      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span>Dashboard Χαμένα Κατοικίδια</span>
      </nav>

      <div className="dashboard-content">
        
      </div>
    </div>

  );
}

