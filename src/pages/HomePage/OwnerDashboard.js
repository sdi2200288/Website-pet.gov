import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";
import ArxikiOwner from "../../images/ArxikiOwner.png";
import "./OwnerDashboard.css";
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  return (
    <div className="OwnerDashboard">
      <section className="hero-section">
        <img src={ArxikiOwner} alt="ArxikiOwner" className="main-image" />
      </section>
      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span>Dashboard Ιδιοκτήτη</span>
      </nav>

      <div className="dashboard-content">
        
      </div>
    </div>

  );
}

