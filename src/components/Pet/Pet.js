import React from "react";
import "./Pet.css";
// import {pet} from "../../pages/Utils/Util"

export default function PetDetails({ pet, mode = 0, selected = false}) {

const isLost = pet.lost; 
  if(!pet) return null;

  return (
      <div className={`pet-card-x pet-card-profile ${selected ? "selected" : ""}`} >
        <div className="pet-title">{pet.name}</div>

        <div className="pet-img-wrap">
          <img className="pet-img" src={pet.photoUrl} alt={pet.name} />
        </div>

        <div className="pet-fields">
          <div className="pet-row">
            <span>Microchip</span>
            <b>{pet.microchip}</b>
          </div>
          <div className="pet-row">
            <span>Είδος</span>
            <b>{pet.species}</b>
          </div>
          <div className="pet-row">
            <span>Ράτσα</span>
            <b>{pet.breed}</b>
          </div>
          <div className="pet-row">
            <span>Φύλο</span>
            <b>{pet.gender}</b>
          </div>
        </div>

        <div className="pet-divider" />

        <div className="pet-fields">
          <div className="pet-row">
            <span>Εξαφανισμένο</span>
            <b className={isLost ? "lost-yes" : "lost-no"}>
              {isLost ? "Ναι" : "Όχι"}
            </b>
          </div>
          <div className="pet-row">
            <span>Ημερομηνία Εξαφάνισης</span>
            <b>{pet.lastSeenDate}</b>
          </div>
          <div className="pet-row">
            <span>Περιοχή (Νομός)</span>
            <b>{pet.region}</b>
          </div>
          <div className="pet-row">
            <span>Διεύθυνση Εξαφάνισης</span>
            <b>{pet.lastSeenAddress}</b>
          </div>
        </div>
      </div>
    );
}