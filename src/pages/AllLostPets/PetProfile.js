import "./PetProfile.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


export default function PetProfile({ setActiveMenu }) {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3001/pets/${id}`);
        if (!res.ok) throw new Error("Το κατοικίδιο δεν βρέθηκε");
        const data = await res.json();
        if (!data.lost) throw new Error("Το συγκεκριμένο κατοικίδιο δεν είναι χαμένο");

        const resOwner = await fetch(`http://localhost:3001/owners/${data.ownerId}`);
        if (!resOwner.ok) throw new Error("Δεν βρέθηκε ο ιδιοκτήτης.");
        const ownerData = await resOwner.json();

        setOwner(ownerData);
        setPet(data);

      } catch (err) {
        setError(err.message);
      }
    };
    fetchPet();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!pet || !owner) return null;

  return (
    <div className="petProfilePage">
      <div className="petBreadcrumb">
        <Link to="/">Αρχική</Link> /
        <Link to="/all-lost-pets"> Χαμένα Κατοικίδια </Link> /
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
                  <span className="label">Ράτσα</span>
                  <span className="value">{pet.breed}</span>
                </div>

                <div className="petField">
                  <span className="label">Φύλο</span>
                  <span className="value">{pet.gender}</span>
                </div>

                <div className="petField">
                  <span className="label">Ημερομηνία γέννησης</span>
                  <span className="value">{pet.birthdate || "-"}</span>
                </div>

                <div className="petField">
                  <span className="label">Ηλικία (έτη)</span>
                  <span className="value">{pet.age || "-"}</span>
                </div>
              </div>
            </section>

            <section className="petSection">
              <h2>Στοιχεία Εξαφάνισης</h2>

              <div className="petSectionGrid">
                <div className="petField">
                  <span className="label">Διεύθυνση</span>
                  <span className="value">{pet.lostAddress}</span>
                </div>

                <div className="petField">
                  <span className="label">Ημερομηνία</span>
                  <span className="value">{pet.lostDate}</span>
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
                  <span className="value"> {owner.firstname} {owner.lastname}</span>
                </div>
                <div className="petField">
                  <span className="label">Τηλέφωνο</span>
                  <span className="value">{owner.phone}</span>
                </div>
                <div className="petField">
                  <span className="label">Διεύθυνση</span>
                  <span className="value">{owner.address}</span>
                </div>
                <div className="petField">
                  <span className="label">Email</span>
                  <span className="value">{owner.email}</span>
                </div>
              </div>
            </section>
          </div>
          <button className="petPrimaryButton" onClick={() => navigate(`/found/${pet.id}`)}>
            Δήλωση Εύρεσης
          </button>
        </div>
      </div>
    </div >
  );
}
