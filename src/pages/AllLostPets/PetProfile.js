import "./PetProfile.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


export default function PetProfile() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;


  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await fetch(`http://localhost:3001/pets/${id}`);
        if (!res.ok) throw new Error("Το κατοικίδιο δεν βρέθηκε");
        const data = await res.json();
        if (!data.lost) throw new Error("Το συγκεκριμένο κατοικίδιο δεν είναι χαμένο");
        if (!data.ownerId) throw new Error("Λείπει ownerId από το κατοικίδιο.");
        let resOwner = await fetch(`http://localhost:3001/owners/${data.ownerId}`);
        if (!resOwner.ok) resOwner = await fetch(`http://localhost:3001/vets/${data.ownerId}`);
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
  const isOwnerOfPet =
    user?.id != null && pet?.ownerId != null && String(user.id) === String(pet.ownerId);

  if (error) return <p>{error}</p>;
  if (!pet || !owner) return <p>Φόρτωση...</p>;

  return (
    <div className="petProfilePage">
      <div className="petBreadcrumb">
        <Link to="/">Αρχική</Link> /
        <Link to="/all-lost-pets"> Χαμένα Κατοικίδια </Link> /
        <span>Προφίλ Κατοικιδίου</span>
      </div>

      <div className="petProfileCard">
        <div className="petProfileLeft">
          <img className="petProfilePhoto" src={pet.photoUrl || "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"}
            alt={pet.name}
            onError={(e) => {
              e.target.src = "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
            }} />

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
                  <span className="value">{pet.lastSeenAddress || "-"}</span>
                </div>

                <div className="petField">
                  <span className="label">Ημερομηνία</span>
                  <span className="value">{pet.lastSeenDate || "-"}</span>
                </div>

                <div className="petField">
                  <span className="label">Κατάσταση</span>
                  <span className="value">
                    {pet.condition || "-"}
                  </span>
                </div>

                <div className="petField">
                  <span className="label">Περιοχή (Νομός)</span>
                  <span className="value">{pet.region || "-"}</span>
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
          {!isOwnerOfPet ? (
            <button
              className="petPrimaryButton"
              onClick={() => navigate(`/foundLostPet/${pet.id}`)}
            >
              Δήλωση Εύρεσης
            </button>
          ) : (
            <p style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
              Δεν μπορείτε να κάνετε δήλωση εύρεσης για το δικό σας κατοικίδιο.
            </p>
          )}


        </div>
      </div>
    </div >
  );
}
