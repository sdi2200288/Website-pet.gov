import React from "react";
import "./Pet.css";
import petPhoto from "../../images/lostPet1.png";

export default function PetDetails({ mode = 0 }) {
  const pet = {
    name: "Barbie",
    photoUrl: petPhoto,
    microchip: "123456789",
    species: "Σκύλος",
    breed: "Golden Retriever",
    gender: "Θηλυκό",
    lastSeenDate: "12/10/2025",
    region: "Αττική",
    lastSeenAddress: "Σύνταγμα, Αθήνα",
  };
  const isLost = mode === 0;

  if (mode === 1) {
    return (
      <div className="pet-card-x pet-card-profile">
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

          <>
            <div className="pet-row">
              <span>Ημερομηνία Τελευταίας Εξαφάνισης</span>
              <b>{pet.lastSeenDate}</b>
            </div>
          </>

        </div>
      </div>
    );
  }

  return (
    <div className="pet-card-x pet-card-profile">
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

        <>
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
        </>
      </div>
    </div>
  );
}
