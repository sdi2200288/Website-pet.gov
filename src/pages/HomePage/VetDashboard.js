import React from "react";
import Footer from "../../components/Footer/Footer";
import ArxikiVet from "../../images/ArxikiVet.png";
import "./VetDashboard.css";
import { Link } from "react-router-dom";

export default function VetDashboard() {
  return (
    <div className="VetDashboard">
      <section className="hero-section">
        <img src={ArxikiVet} alt="ArxikiVet" className="main-image" />
      </section>
      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span>Dashboard Κτηνίατρου</span>
      </nav>

      <div className="dashboard-content">
        
      </div>
    </div>

  );
}

