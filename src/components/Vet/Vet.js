import React from "react";
import "./Vet.css";
import { calculateMO } from "../../pages/Utils/Util"
import owner from "../../images/lostPet3.png";

export default function VetDetails({ vet, selected = false }) {
    if (!vet) return null;
    return (
        <div className={`vet-card-x vet-card-profile ${selected ? "selected" : ""}`} >
            <div className="vet-title">{vet.firstname} {vet.lastname} {calculateMO(vet.totalScore, vet.reviewCount)}
                <span style={{ color: "gold", fontSize: "20px", marginLeft: "5px" }}>★</span>
            </div>

            <div className="vet-img-wrap">
                <img className="vet-img" src={owner} alt={vet.firstname + " " + vet.lastname} />
            </div>
            <div className="vet-fields">
                <div className="vet-row">
                    <span>ΑΦΜ</span>
                    <b>{vet.afm}</b>
                </div>
                <div className="vet-row">
                    <span>Φύλο</span>
                    <b>{vet.gender}</b>
                </div>
                <div className="vet-row">
                    <span> Επίπεδο σπουδών</span>
                    <b>{vet.studyLevel}</b>
                </div>
                <div className="vet-row">
                    <span>Εμπειρία</span>
                    <b>{vet.experienceYears}</b>
                </div>
            </div>
            <div className="vet-divider" />
            <div className="vet-fields">
                <div className="vet-row">
                    <span>Περιοχή (Νομός)</span>
                    <b>{vet.region}</b>
                </div>
                <div className="vet-row">
                    <span> Διεύθυνση</span>
                    <b>{vet.address}</b>
                </div>
                <div className="vet-row">
                    <span>Τηλέφωνο</span>
                    <b>{vet.phone}</b>
                </div>
                <div className="vet-row">
                    <span>Email</span>
                    <b>{vet.email}</b>
                </div>
            </div>
        </div>
    );
}
