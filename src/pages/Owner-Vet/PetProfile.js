import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PetProfile.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import DeclarationModal from "../../pages/Owner-Vet/WatchDeclaration";
import { MEDICAL_ACTS } from "../Utils/Util";

const DEFAULT_PET_PHOTO =
  "https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

function sortDecls(arr, sortOrder) {
  const list = Array.isArray(arr) ? [...arr] : [];

  const getCreated = (x) => {
    const t = x?.createdAt ? new Date(x.createdAt).getTime() : 0;
    return Number.isNaN(t) ? 0 : t;
  };
  const getDate = (x) => {
    const t = x?.date ? new Date(x.date).getTime() : 0;
    return Number.isNaN(t) ? 0 : t;
  };

  if (sortOrder === "old") return list.sort((a, b) => getCreated(a) - getCreated(b));
  if (sortOrder === "dateDesc") return list.sort((a, b) => getDate(b) - getDate(a));
  if (sortOrder === "dateAsc") return list.sort((a, b) => getDate(a) - getDate(b));
  if (sortOrder === "submitted") return list.sort((a, b) => String(b.status || "").localeCompare(String(a.status || "")));
  if (sortOrder === "draft") return list.sort((a, b) => String(a.status || "").localeCompare(String(b.status || "")));

  return list.sort((a, b) => getCreated(b) - getCreated(a));
}

export default function ProfilePetOwner() {
  const { id } = useParams();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const myId = user?.id;

  const [pet, setPet] = useState(null);
  const [lossDeclarations, setLossDeclarations] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [otherDeclarations, setOtherDeclarations] = useState([]);

  const [activeTab, setActiveTab] = useState("booklet");
  const [medicalActions, setMedicalActions] = useState([]);

  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    (async () => {
      try {
        const petRes = await fetch(`http://localhost:3001/pets/${id}`);
        const petData = await petRes.json();
        setPet(petData);

        const lostRes = await fetch(`http://localhost:3001/lostReports?petId=${id}`);
        const lostAll = await lostRes.json();
        const lostAllArr = Array.isArray(lostAll) ? lostAll : [];

        const foundRes = await fetch(`http://localhost:3001/foundReports?petId=${id}`);
        const foundAll = await foundRes.json();
        const foundAllArr = Array.isArray(foundAll) ? foundAll : [];

        const noAccRes = await fetch(`http://localhost:3001/foundReportsWithoutAcc?petId=${id}`);
        const noAccAll = await noAccRes.json();
        const noAccArr = Array.isArray(noAccAll) ? noAccAll : [];

        const adoptionRes = await fetch(`http://localhost:3001/adoptionReports?petId=${id}&status=submitted`);
        const adoptionAll = await adoptionRes.json();
        const adoptionArr = Array.isArray(adoptionAll) ? adoptionAll : [];

        const fosterRes = await fetch(`http://localhost:3001/fosterReports?petId=${id}&status=submitted`);
        const fosterAll = await fosterRes.json();
        const fosterArr = Array.isArray(fosterAll) ? fosterAll : [];

        const transferRes = await fetch(`http://localhost:3001/transferReports?petId=${id}`);
        const transferAll = await transferRes.json();
        const transferArr = Array.isArray(transferAll) ? transferAll : [];

        const nameCache = new Map();
        const fetchPersonName = async (personId) => {
          if (!personId) return null;
          if (nameCache.has(personId)) return nameCache.get(personId);

          const tryFetch = async (url) => {
            const res = await fetch(url);
            if (!res.ok) return null;
            return res.json();
          };

          let person = await tryFetch(`http://localhost:3001/owners/${personId}`);
          if (!person || !person.id) {
            person = await tryFetch(`http://localhost:3001/vets/${personId}`);
          }

          const fullName = person
            ? [person.firstname, person.lastname].filter(Boolean).join(" ").trim()
            : "";
          const value = fullName || null;
          nameCache.set(personId, value);
          return value;
        };

        const personIds = new Set();
        lostAllArr.forEach((r) => r.ownerId && personIds.add(r.ownerId));
        foundAllArr.forEach((r) => r.ownerId && personIds.add(r.ownerId));
        adoptionArr.forEach((r) => r.vetId && personIds.add(r.vetId));
        fosterArr.forEach((r) => r.vetId && personIds.add(r.vetId));
        transferArr.forEach((r) => {
          if (r.vetId) personIds.add(r.vetId);
          if (r.currentOwnerId) personIds.add(r.currentOwnerId);
          if (r.newOwnerId) personIds.add(r.newOwnerId);
        });

        const nameMap = {};
        await Promise.all(
          [...personIds].map(async (personId) => {
            nameMap[personId] = await fetchPersonName(personId);
          })
        );

        const withNames = (r) => ({
          ...r,
          ownerName: nameMap[r.ownerId] || null,
          vetName: nameMap[r.vetId] || null,
          currentOwnerName: nameMap[r.currentOwnerId] || null,
          newOwnerName: nameMap[r.newOwnerId] || null,
        });

        const medRes = await fetch(`http://localhost:3001/medicalReports?petId=${id}`);
        const medAll = await medRes.json();
        setMedicalActions(Array.isArray(medAll) ? medAll : []);

        const myLost = lostAllArr
          .filter((r) => myId && r.ownerId === myId)
          .map((r) => ({ ...withNames(r), type: "loss" }));

        const myFound = foundAllArr
          .filter((r) => myId && r.ownerId === myId)
          .map((r) => ({ ...withNames(r), type: "found" }));

        setLossDeclarations(myLost);
        setFoundDeclarations(myFound);

        const othersLost = lostAllArr
          .filter((r) => !(myId && r.ownerId === myId))
          .filter((r) => r.status === "submitted")
          .map((r) => ({ ...withNames(r), type: "loss" }));

        const othersFound = foundAllArr
          .filter((r) => !(myId && r.ownerId === myId))
          .filter((r) => r.status === "submitted")
          .map((r) => ({ ...withNames(r), type: "found" }));

        const othersNoAcc = noAccArr
          .filter((r) => r.status === "submitted")
          .map((r) => ({ ...withNames(r), type: "foundNoAcc" }));
        const adoption = adoptionArr.map((r) => ({ ...withNames(r), type: "adoption" }));
        const foster = fosterArr.map((r) => ({ ...withNames(r), type: "foster" }));
        const transfer = transferArr
          .filter((r) => r.status === "submitted")
          .map((r) => ({ ...withNames(r), type: "transfer" }));

        const combined = [
          ...othersLost,
          ...othersFound,
          ...othersNoAcc,
          ...adoption,
          ...foster,
          ...transfer,
        ];

        setOtherDeclarations(combined);
      } catch (err) {
        console.error(err);
        setPet(null);
        setLossDeclarations([]);
        setFoundDeclarations([]);
        setOtherDeclarations([]);
        setMedicalActions([]);
      }
    })();
  }, [id, myId]);

  if (!pet) return <p>Φόρτωση κατοικιδίου...</p>;

  function handleViewDeclaration(declaration) {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedDeclaration(null);
  }


  function handlePrintDeclaration(declaration) {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 0);
  }

  const lossSorted = sortDecls(lossDeclarations, sortOrder);
  const foundSorted = sortDecls(foundDeclarations, sortOrder);
  const otherSorted = sortDecls(otherDeclarations, sortOrder);

  const handleDeleteDeclaration = async (declId, declType) => {
    if (!window.confirm("Είσαι σίγουρος/η ότι θέλεις να διαγράψεις τη δήλωση;")) return;

    const map = {
      loss: "lostReports",
      lost: "lostReports",
      found: "foundReports",
    };

    const resource = map[declType];
    if (!resource) return;

    try {
      await fetch(`http://localhost:3001/${resource}/${declId}`, { method: "DELETE" });
      setLossDeclarations((prev) => prev.filter((r) => r.id !== declId));
      setFoundDeclarations((prev) => prev.filter((r) => r.id !== declId));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedMedicalAct = MEDICAL_ACTS.find((act) => act.id === medicalActions.type);

  return (
    <div className="petProfilePage">
      <div className="petBreadcrumb">
        <a href="/">Αρχική</a> / <a href="/profile">Το Προφίλ μου</a> /{" "}
        <span>Προφίλ Κατοικιδίου</span>
      </div>

      <div className="petProfileCard">
        <div className="petProfileLeft">
          <img
            src={pet.photoUrl || DEFAULT_PET_PHOTO}
            alt={pet.name}
            className="petProfilePhoto"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PET_PHOTO;
            }}
          />
        </div>

        <div className="petProfileRight">
          <div className="petProfileInfoBox">
            <h3 className="petProfileBoxTitle">Στοιχεία Κατοικιδίου</h3>

            <div className="petProfileGrid two-columns">
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

              <div className="petProfileColumn">
                <div className="petInfoRow">
                  <span className="label">Ράτσα</span>
                  <span className="value">{pet.breed || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ημερομηνία γέννησης</span>
                  <span className="value">{pet.birthDate || pet.birthdate || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ηλικία</span>
                  <span className="value">{pet.age || "-"}</span>
                </div>
              </div>
            </div>

            {pet.lost && (
              <div className="petMissingAlert">
                <div className="petMissingTitle">Κατοικίδιο Εξαφανισμένο</div>

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
                  <strong>{pet.condition || "-"}</strong>
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
            type="button"
          >
            Βιβλιάριο
          </button>

          <button
            className={`petTab ${activeTab === "loss" ? "active" : ""}`}
            onClick={() => setActiveTab("loss")}
            type="button"
          >
            Δηλώσεις Απώλειας
          </button>

          <button
            className={`petTab ${activeTab === "found" ? "active" : ""}`}
            onClick={() => setActiveTab("found")}
            type="button"
          >
            Δηλώσεις Εύρεσης
          </button>

          <button
            className={`petTab ${activeTab === "foundByOthers" ? "active" : ""}`}
            onClick={() => setActiveTab("foundByOthers")}
            type="button"
          >
            Λοιπές Δηλώσεις (πολίτες/κτηνίατροι/προηγούμενοι ιδιοκτήτες)
          </button>
        </div>

        {activeTab === "booklet" && (
          <div className="petTabPanel">
            <div className="booklet-layout">
              <div className="booklet-bottom">
                <div className="info-box large">
                  <h4>Ιστορικό Πράξεων</h4>
                  {medicalActions.length === 0 ? (
                    <p className="empty">Δεν υπάρχουν καταχωρημένες πράξεις.</p>
                  ) : (
                    <div className="medical-actions-list">
                      {medicalActions.map((action) => {
                        const actLabel =
                          MEDICAL_ACTS.find((a) => a.id === action.type)?.label ?? action.type ?? "—";

                        return (
                          <div key={action.id} className="medical-action-item">
                            <p><strong>Ημερομηνία:</strong> {action.date}</p>
                            <p><strong>Είδος:</strong> {actLabel}</p>
                            <p><strong>Περιγραφή:</strong> {action.description}</p>
                            <p><strong>Φάρμακα/Αγωγή:</strong> {action.medications}</p>
                            <hr />
                          </div>
                        );
                      })}

                    </div>
                  )}
                </div>
              </div>

              <div className="bookletPrintCenter">
                <button className="next-btn" type="button" onClick={() => window.print()}>
                  Εκτύπωση
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "loss" && (
          <PetDeclarationsList
            type="loss"
            declarations={lossSorted}
            onDeleteDeclaration={handleDeleteDeclaration}
            onViewDeclaration={handleViewDeclaration}
            onPrintDeclaration={handlePrintDeclaration}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        )}

        {activeTab === "found" && (
          <PetDeclarationsList
            type="found"
            declarations={foundSorted}
            onDeleteDeclaration={handleDeleteDeclaration}
            onViewDeclaration={handleViewDeclaration}
            onPrintDeclaration={handlePrintDeclaration}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        )}

        {activeTab === "foundByOthers" && (
          <PetDeclarationsList
            type="mixed"
            declarations={otherSorted}
            onDeleteDeclaration={handleDeleteDeclaration}
            onViewDeclaration={handleViewDeclaration}
            onPrintDeclaration={handlePrintDeclaration}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        )}
      </div>

      {selectedDeclaration && (
        <DeclarationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          declaration={selectedDeclaration}
        />
      )}
    </div>
  );
}
