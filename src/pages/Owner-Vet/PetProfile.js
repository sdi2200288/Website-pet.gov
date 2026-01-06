import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PetProfile.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";

export default function ProfilePetOwner() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [lossDeclarations, setLossDeclarations] = useState([]);
    const [foundDeclarations, setFoundDeclarations] = useState([]);
    const [foundByOthers, setFoundByOthers] = useState([]);
    const [activeTab, setActiveTab] = useState("booklet");

    useEffect(() => {
        fetch(`http://localhost:3001/pets/${id}`)
            .then((res) => res.json())
            .then((data) => setPet(data));
        fetch(`http://localhost:3001/lostReports?petId=${id}`)
            .then((res) => res.json())
            .then(setLossDeclarations);

        fetch(`http://localhost:3001/foundReports?petId=${id}`)
            .then((res) => res.json())
            .then(setFoundDeclarations);

        fetch(`http://localhost:3001/foundReports?petId=${id}`)
            .then((res) => res.json())
            .then(setFoundByOthers);
    }, [id]);
    if (!pet) return <p>Φόρτωση κατοικιδίου...</p>;

    return (
        <div className="petProfilePage">
            <div className="petBreadcrumb">
                <a href="/">Αρχική</a> /
                <a href="/profile"> Το προφίλ μου</a> /
                <span> Προφίλ Κατοικιδίου</span>
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
                    <div className="petProfileInfoBox">
                        <h3 className="petProfileBoxTitle">Στοιχεία Κατοικιδίου</h3>

                        <div className="petProfileGrid two-columns">
                            {/* Αριστερή στήλη */}
                            <div className="petProfileColumn">
                                <div className="petInfoRow">
                                    <span className="label">Microchip</span>
                                    <span className="value">{pet.microchip || "-"}</span>
                                </div>

                                <div className="petInfoRow">
                                    <span className="label">Όνομα</span>
                                    <span className="value">{pet.name || "-"}</span>
                                </div>

                                <div className="petInfoRow">
                                    <span className="label">Είδος</span>
                                    <span className="value">{pet.species || "-"}</span>
                                </div>

                                <div className="petInfoRow">
                                    <span className="label">Φύλο</span>
                                    <span className="value">{pet.gender || "-"}</span>
                                </div>
                            </div>

                            {/* Δεξιά στήλη */}
                            <div className="petProfileColumn">
                                <div className="petInfoRow">
                                    <span className="label">Ράτσα</span>
                                    <span className="value">{pet.breed || "-"}</span>
                                </div>

                                <div className="petInfoRow">
                                    <span className="label">Ημερομηνία γέννησης</span>
                                    <span className="value">{pet.birthDate || "-"}</span>
                                </div>

                                <div className="petInfoRow">
                                    <span className="label">Ηλικία</span>
                                    <span className="value">{pet.age || "-"}</span>
                                </div>
                            </div>
                        </div>
                        {pet.lost && (
                            <div className="petMissingAlert">
                                <div className="petMissingTitle">
                                    Κατοικίδιο Εξαφανισμένο
                                </div>

                                <div className="petMissingRow">
                                    <span>Ημερομηνία εξαφάνισης:</span>
                                    <strong>{pet.lastSeenDate || "-"}</strong>
                                </div>

                                <div className="petMissingRow">
                                    <span>Διεύθυνση:</span>
                                    <strong>{pet.lastSeenAddress || "-"}</strong>
                                </div>
                                <div className="petMissingRow">
                                    <span>Περιοχή (Νομός):</span>
                                    <strong>{pet.region || "-"}</strong>
                                </div>
                                <div className="petMissingRow">
                                    <span>Κατάσταση:</span>
                                    <strong>Εξαφανισμένο</strong>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <div className="petTabsWrapper">
                <div className="petTabs">
                    <button
                        className={`petTab ${activeTab === "booklet" ? "active" : ""}`}
                        onClick={() => setActiveTab("booklet")}
                    >
                        Βιβλιάριο
                    </button>

                    <button
                        className={`petTab ${activeTab === "loss" ? "active" : ""}`}
                        onClick={() => setActiveTab("loss")}
                    >
                        Δηλώσεις απώλειας
                    </button>

                    <button
                        className={`petTab ${activeTab === "found" ? "active" : ""}`}
                        onClick={() => setActiveTab("found")}
                    >
                        Δηλώσεις εύρεσης
                    </button>

                    <button
                        className={`petTab ${activeTab === "foundByOthers" ? "active" : ""
                            }`}
                        onClick={() => setActiveTab("foundByOthers")}
                    >
                        Δηλώσεις εύρεσης πολιτών
                    </button>
                </div>


                {activeTab === "booklet" && (
                    <div className="petTabPanel">
                        <div className="booklet-layout">
                            <div className="booklet-bottom">
                                <div className="info-box large">
                                    <h4>Ιατρικές Πράξεις</h4>
                                    <p className="empty">— Δεν υπάρχουν καταχωρήσεις —</p>
                                </div>
                                <div className="info-box large">
                                    <h4>Τυχόν Συμβάντα</h4>
                                    <p className="empty">— Δεν υπάρχουν καταχωρήσεις —</p>
                                </div>
                            </div>
                            <div className="bookletPrintCenter">
                                <button className="next-btn">Εκτύπωση</button>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === "loss" && (
                    <PetDeclarationsList
                        type="loss"
                        declarations={lossDeclarations}
                    />
                )}

                {activeTab === "found" && (
                    <PetDeclarationsList
                        type="found"
                        declarations={foundDeclarations}
                    />
                )}

                {activeTab === "foundByOthers" && (
                    <PetDeclarationsList
                        type="found"
                        declarations={foundByOthers}
                    />
                )}
            </div>
        </div>
    );
}
