import React from "react";
import ProsYiouesia from "../../images/ProsYiouesia.png";
import "./AdoptionPage.css";
import { Link } from "react-router-dom";

export default function AdoptionPage() {
  return (
    <div className="AdoptionPage">
      <section className="hero-section">
        <img src={ProsYiouesia} alt="ProsYiouesia" className="main-image" />
      </section>
      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span>Dashboard Προς Υιοθεσία</span>
      </nav>

      <div className="dashboard-content">
        
      </div>
    </div>

  );
}

