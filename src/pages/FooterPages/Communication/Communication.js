import React from "react";
import communicationImg from "../../../images/Communication.png";
import "./Communication.css";
import { Link } from "react-router-dom";

export default function Communication() {
  return (
    <div className="communication-page">
      <div className="page-breadcrumb">
        <Link to="/">Αρχική</Link> <span>/ Επικοινωνία</span>
      </div>
      <div className="communication-hero">
        <img
          src={communicationImg}
          alt="Επικοινωνία"
          className="communication-image"
        />
        
        <div className="communication-card left">
          <div className="communication-text">
            <div className="communication-title">Τηλέφωνο Επικοινωνίας</div>
            <div className="communication-value">2100 000 000</div>
          </div>
        </div>

        <div className="communication-card right">
          <div className="communication-text">
            <div className="communication-title">Email</div>
            <div className="communication-value">info@pet.gr</div>
          </div>
        </div>
      </div>
    </div>
  );
}
