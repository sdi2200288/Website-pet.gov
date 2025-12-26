import React from "react";
import "./PetProfile.css";
import petPhoto from "../../images/lostPet1.png";
import { pet } from "../Utils/Util"

export default function PetProfile() {
  return (
    <div className="petProfilePage">
      <div className="petBreadcrumb">
        <a href="/">Αρχική</a> /
        <a href="/all-lost-pets"> Χαμένα Κατοικίδια </a> /
        <span>Προφίλ Κατοικιδίου</span>
      </div>


      <div className="petProfileCard">
        <div className="petProfileLeft">
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="petProfilePhoto"
          />
        </div>

        <div className="petProfileRight">
          <div className="petProfileMain">
            <section className="petSection">
              <h2>Στοιχεία Κατοικιδίου</h2>

              <div className="petSectionGrid">
                <div className="petField">
                  <span className="label">Microchip</span>
                  <span className="value">{pet.microchip}</span>
                </div>

                <div className="petField">
                  <span className="label">Όνομα</span>
                  <span className="value">{pet.name}</span>
                </div>

                <div className="petField">
                  <span className="label">Είδος</span>
                  <span className="value">{pet.species}</span>
                </div>

                <div className="petField">
                  <span className="label">Ημερομηνία γέννησης</span>
                  <span className="value">2023</span>
                </div>

                <div className="petField">
                  <span className="label">Ράτσα</span>
                  <span className="value">{pet.breed}</span>
                </div>

                <div className="petField">
                  <span className="label">Φύλο</span>
                  <span className="value">{pet.gender}</span>
                </div>

                <div className="petField">
                  <span className="label">Ηλικία (έτη)</span>
                  <span className="value"> 2 </span>
                </div>
              </div>
            </section>

            <section className="petSection">
              <h2>Στοιχεία Εξαφάνισης</h2>

              <div className="petSectionGrid">
                <div className="petField">
                  <span className="label">Διεύθυνση</span>
                  <span className="value">{pet.lastSeenAddress}</span>
                </div>

                <div className="petField">
                  <span className="label">Ημερομηνία</span>
                  <span className="value">{pet.lastSeenDate}</span>
                </div>

                <div className="petField">
                  <span className="label">Κατάσταση</span>
                  <span className="value">
                    {"Εξαφανισμένο"}
                  </span>
                </div>

                <div className="petField">
                  <span className="label">Περιοχή (Νομός)</span>
                  <span className="value">{pet.region}</span>
                </div>
              </div>
            </section>

            <section className="petSection">
              <h2>Στοιχεία Ιδιοκτήτη</h2>

              <div className="petSectionGrid">
                <div className="petField">
                  <span className="label">Ονοματεπώνυμο</span>
                  <span className="value"> Ελένη Τόντου</span>
                </div>
                <div className="petField">
                  <span className="label">Τηλέφωνο</span>
                  <span className="value">6900000000</span>
                </div>
                <div className="petField">
                  <span className="label">Διεύθυνση</span>
                  <span className="value">Καποδίστρια 7, Σεπόλια Αττικής</span>
                </div>
                <div className="petField">
                  <span className="label">Email</span>
                  <span className="value">eleni@gmail.com</span>
                </div>
              </div>
            </section>
          </div>
          <button className="petPrimaryButton">
            Δήλωση Εύρεσης
          </button>
        </div>
      </div>
    </div >
  );
}
