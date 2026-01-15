import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PetProfile.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import DeclarationModal from "../../pages/Owner-Vet/WatchDeclaration";

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

  // recent (default)
  return list.sort((a, b) => getCreated(b) - getCreated(a));
}

export default function ProfilePetOwner() {
  const { id } = useParams();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const myId = user?.id;

  const [pet, setPet] = useState(null);

  // β€Ξ”ΞΉΞΊΞ­Ο‚ ΞΌΞΏΟ…β€ Ξ΄Ξ·Ξ»ΟΟƒΞµΞΉΟ‚ Ξ³ΞΉΞ± Ο„ΞΏ ΞΊΞ±Ο„ΞΏΞΉΞΊΞ―Ξ΄ΞΉΞΏ
  const [lossDeclarations, setLossDeclarations] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);

  // β€Ξ›ΞΏΞΉΟ€Ξ­Ο‚β€ Ξ΄Ξ·Ξ»ΟΟƒΞµΞΉΟ‚ (ΞΊΟ„Ξ·Ξ½Ξ―Ξ±Ο„ΟΞΏΞΉ/Ο€ΞΏΞ»Ξ―Ο„ΞµΟ‚/Ο€ΟΞΏΞ·Ξ³. ΞΉΞ΄ΞΉΞΏΞΊΟ„Ξ®Ο„ΞµΟ‚)
  const [otherDeclarations, setOtherDeclarations] = useState([]);

  // Tabs
  const [activeTab, setActiveTab] = useState("booklet");

  // Booklet - medical
  const [medicalActions, setMedicalActions] = useState([]);

  // Modal
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    (async () => {
      try {
        const petRes = await fetch(`http://localhost:3001/pets/${id}`);
        const petData = await petRes.json();
        setPet(petData);

        // ---- LOST REPORTS (ΟΞ»ΞµΟ‚ Ξ³ΞΉΞ± petId)
        const lostRes = await fetch(`http://localhost:3001/lostReports?petId=${id}`);
        const lostAll = await lostRes.json();
        const lostAllArr = Array.isArray(lostAll) ? lostAll : [];

        // ---- FOUND REPORTS (ΟΞ»ΞµΟ‚ Ξ³ΞΉΞ± petId)
        const foundRes = await fetch(`http://localhost:3001/foundReports?petId=${id}`);
        const foundAll = await foundRes.json();
        const foundAllArr = Array.isArray(foundAll) ? foundAll : [];

        // ---- FOUND REPORTS WITHOUT ACCOUNT (Ο€ΞΏΞ»Ξ―Ο„ΞµΟ‚)
        const noAccRes = await fetch(`http://localhost:3001/foundReportsWithoutAcc?petId=${id}`);
        const noAccAll = await noAccRes.json();
        const noAccArr = Array.isArray(noAccAll) ? noAccAll : [];

        // ---- adoption/foster/transfer
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

        // ---- medical
        const medRes = await fetch(`http://localhost:3001/medicalReports?petId=${id}`);
        const medAll = await medRes.json();
        setMedicalActions(Array.isArray(medAll) ? medAll : []);

        // ========== Ξ¦Ξ™Ξ›Ξ¤Ξ΅Ξ‘ ==========
        // β€Ξ”Ξ™ΞΞ•Ξ£ ΞΞΞ¥β€: ΞΌΟΞ½ΞΏ ΟΟƒΞµΟ‚ Ξ­Ο‡ΞΏΟ…Ξ½ ownerId = myId
        const myLost = lostAllArr
          .filter((r) => myId && r.ownerId === myId)
          .map((r) => ({ ...withNames(r), type: "loss" }));

        const myFound = foundAllArr
          .filter((r) => myId && r.ownerId === myId)
          .map((r) => ({ ...withNames(r), type: "found" }));

        setLossDeclarations(myLost);
        setFoundDeclarations(myFound);

        // β€Ξ›ΞΞ™Ξ Ξ•Ξ£β€: ΟΞ»ΞµΟ‚ ΞΏΞΉ Ξ¬Ξ»Ξ»ΞµΟ‚ (ΞΏΟ€ΞΏΞΉΞΏΟƒΞ΄Ξ®Ο€ΞΏΟ„Ξµ Ξ¬Ξ»Ξ»ΞΏΟ‚ ownerId Ξ® Ο‡Ο‰ΟΞ―Ο‚ ownerId)
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

  if (!pet) return <p>Ξ¦ΟΟΟ„Ο‰ΟƒΞ· ΞΊΞ±Ο„ΞΏΞΉΞΊΞΉΞ΄Ξ―ΞΏΟ…...</p>;

  function handleViewDeclaration(declaration) {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedDeclaration(null);
  }

  function formatDateTime(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("el-GR");
  }

  function labelForType(t) {
    if (t === "loss" || t === "lost") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ‘Ο€ΟΞ»ΞµΞΉΞ±Ο‚";
    if (t === "found") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ•ΟΟΞµΟƒΞ·Ο‚";
    if (t === "foundNoAcc") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ•ΟΟΞµΟƒΞ·Ο‚ (Ο‡Ο‰ΟΞ―Ο‚ Ξ»ΞΏΞ³Ξ±ΟΞΉΞ±ΟƒΞΌΟ)";
    if (t === "adoption") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ¥ΞΉΞΏΞΈΞµΟƒΞ―Ξ±Ο‚";
    if (t === "foster") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ¦ΞΉΞ»ΞΏΞΎΞµΞ½Ξ―Ξ±Ο‚";
    if (t === "transfer") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· ΞΞµΟ„Ξ±Ξ²Ξ―Ξ²Ξ±ΟƒΞ·Ο‚";
    return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ·";
  }

  function buildPrintRows(declaration) {
    const rows = [
      ["ID", declaration.id],
      ["Pet ID", declaration.petId],
      ["Status", declaration.status],
      ["Created At", formatDateTime(declaration.createdAt)],
    ];

    const t = declaration.type;

    if (t === "loss" || t === "lost" || t === "found" || t === "foundNoAcc") {
      rows.push(
        ["Date", declaration.date],
        ["Region", declaration.region],
        ["Address", declaration.address],
        ["Condition", declaration.condition]
      );
      if ("ownerId" in declaration) {
        rows.push(["Submitted By", declaration.ownerName || declaration.ownerId]);
      }
    }

    if (t === "foundNoAcc") {
      rows.push(
        ["First Name", declaration.firstname],
        ["Last Name", declaration.lastname],
        ["Email", declaration.email],
        ["Phone", declaration.phone]
      );
    }

    if (t === "adoption") {
      rows.push(
        ["Vet", declaration.vetName || declaration.vetId],
        ["Status", declaration.status],
        ["Created At", formatDateTime(declaration.createdAt)]
      );
    }

    if (t === "foster") {
      rows.push(
        ["Vet", declaration.vetName || declaration.vetId],
        ["Status", declaration.status],
        ["Created At", formatDateTime(declaration.createdAt)]
      );
    }

    if (t === "transfer") {
      rows.push(
        ["Vet", declaration.vetName || declaration.vetId],
        ["Current Owner", declaration.currentOwnerName || declaration.currentOwnerId],
        ["New Owner", declaration.newOwnerName || declaration.newOwnerId],
        ["Status", declaration.status],
        ["Created At", formatDateTime(declaration.createdAt)]
      );
    }

    return rows;
  }

  function handlePrintDeclaration(declaration) {
    const title = labelForType(declaration.type);
    const rows = buildPrintRows(declaration)
      .map(
        ([label, value]) =>
          `<tr><td class="label">${label}</td><td class="value">${value ?? "-"}</td></tr>`
      )
      .join("");

    const photo = declaration.photoUrl
      ? `<img class="photo" src="${declaration.photoUrl}" alt="Photo" />`
      : "";

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(`<!doctype html>
<html lang="el">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; margin: 16mm; color: #111; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 6px 0; vertical-align: top; border-bottom: 1px solid #e5e7eb; }
    .label { width: 160px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.3px; color: #4b5563; }
    .value { font-size: 13px; font-weight: 600; color: #111827; }
    .photo { width: 100%; max-height: 240px; object-fit: cover; margin: 10px 0; border: 1px solid #e5e7eb; }
    @page { margin: 12mm; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${photo}
  <table>${rows}</table>
</body>
</html>`);
    doc.close();

    const win = iframe.contentWindow;
    const cleanup = () => {
      document.body.removeChild(iframe);
    };

    setTimeout(() => {
      if (!win) return cleanup();
      win.focus();
      win.print();
      cleanup();
    }, 250);
  }

  const lossSorted = sortDecls(lossDeclarations, sortOrder);
  const foundSorted = sortDecls(foundDeclarations, sortOrder);
  const otherSorted = sortDecls(otherDeclarations, sortOrder);

  const handleDeleteDeclaration = async (id, type) => {
    if (!window.confirm("Ξ•Ξ―ΟƒΞ±ΞΉ ΟƒΞ―Ξ³ΞΏΟ…ΟΞΏΟ‚/Ξ· ΟΟ„ΞΉ ΞΈΞ­Ξ»ΞµΞΉΟ‚ Ξ½Ξ± Ξ΄ΞΉΞ±Ξ³ΟΞ¬ΟΞµΞΉΟ‚ Ο„Ξ· Ξ΄Ξ®Ξ»Ο‰ΟƒΞ·;")) return;

    const map = {
      loss: "lostReports",
      lost: "lostReports",
      found: "foundReports",
    };

    const resource = map[type];
    if (!resource) return;

    try {
      await fetch(`http://localhost:3001/${resource}/${id}`, { method: "DELETE" });
      setLossDeclarations((prev) => prev.filter((r) => r.id !== id));
      setFoundDeclarations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="petProfilePage">
      <div className="petBreadcrumb">
        <a href="/">Ξ‘ΟΟ‡ΞΉΞΊΞ®</a> / <a href="/profile"> Ξ¤ΞΏ Ο€ΟΞΏΟ†Ξ―Ξ» ΞΌΞΏΟ…</a> /{" "}
        <span> Ξ ΟΞΏΟ†Ξ―Ξ» ΞΞ±Ο„ΞΏΞΉΞΊΞΉΞ΄Ξ―ΞΏΟ…</span>
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
            <h3 className="petProfileBoxTitle">Ξ£Ο„ΞΏΞΉΟ‡ΞµΞ―Ξ± ΞΞ±Ο„ΞΏΞΉΞΊΞΉΞ΄Ξ―ΞΏΟ…</h3>

            <div className="petProfileGrid two-columns">
              <div className="petProfileColumn">
                <div className="petInfoRow">
                  <span className="label">Microchip</span>
                  <span className="value">{pet.microchip || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">ΞΞ½ΞΏΞΌΞ±</span>
                  <span className="value">{pet.name || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ξ•Ξ―Ξ΄ΞΏΟ‚</span>
                  <span className="value">{pet.species || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ξ¦ΟΞ»ΞΏ</span>
                  <span className="value">{pet.gender || "-"}</span>
                </div>
              </div>

              <div className="petProfileColumn">
                <div className="petInfoRow">
                  <span className="label">Ξ΅Ξ¬Ο„ΟƒΞ±</span>
                  <span className="value">{pet.breed || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ξ—ΞΌΞµΟΞΏΞΌΞ·Ξ½Ξ―Ξ± Ξ³Ξ­Ξ½Ξ½Ξ·ΟƒΞ·Ο‚</span>
                  <span className="value">{pet.birthDate || pet.birthdate || "-"}</span>
                </div>
                <div className="petInfoRow">
                  <span className="label">Ξ—Ξ»ΞΉΞΊΞ―Ξ±</span>
                  <span className="value">{pet.age || "-"}</span>
                </div>
              </div>
            </div>

            {pet.lost && (
              <div className="petMissingAlert">
                <div className="petMissingTitle">ΞΞ±Ο„ΞΏΞΉΞΊΞ―Ξ΄ΞΉΞΏ Ξ•ΞΎΞ±Ο†Ξ±Ξ½ΞΉΟƒΞΌΞ­Ξ½ΞΏ</div>

                <div className="petMissingRow">
                  <span>Ξ—ΞΌΞµΟΞΏΞΌΞ·Ξ½Ξ―Ξ± ΞµΞΎΞ±Ο†Ξ¬Ξ½ΞΉΟƒΞ·Ο‚:</span>
                  <strong>{pet.lastSeenDate || "-"}</strong>
                </div>

                <div className="petMissingRow">
                  <span>Ξ”ΞΉΞµΟΞΈΟ…Ξ½ΟƒΞ·:</span>
                  <strong>{pet.lastSeenAddress || "-"}</strong>
                </div>

                <div className="petMissingRow">
                  <span>Ξ ΞµΟΞΉΞΏΟ‡Ξ® (ΞΞΏΞΌΟΟ‚):</span>
                  <strong>{pet.region || "-"}</strong>
                </div>

                <div className="petMissingRow">
                  <span>ΞΞ±Ο„Ξ¬ΟƒΟ„Ξ±ΟƒΞ·:</span>
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
            Ξ’ΞΉΞ²Ξ»ΞΉΞ¬ΟΞΉΞΏ
          </button>

          <button
            className={`petTab ${activeTab === "loss" ? "active" : ""}`}
            onClick={() => setActiveTab("loss")}
            type="button"
          >
            Ξ”Ξ·Ξ»ΟΟƒΞµΞΉΟ‚ Ξ±Ο€ΟΞ»ΞµΞΉΞ±Ο‚ 
          </button>

          <button
            className={`petTab ${activeTab === "found" ? "active" : ""}`}
            onClick={() => setActiveTab("found")}
            type="button"
          >
            Ξ”Ξ·Ξ»ΟΟƒΞµΞΉΟ‚ ΞµΟΟΞµΟƒΞ·Ο‚
          </button>

          <button
            className={`petTab ${activeTab === "foundByOthers" ? "active" : ""}`}
            onClick={() => setActiveTab("foundByOthers")}
            type="button"
          >
            Ξ›ΞΏΞΉΟ€Ξ­Ο‚ Ξ΄Ξ·Ξ»ΟΟƒΞµΞΉΟ‚ (ΞΊΟ„Ξ·Ξ½Ξ―Ξ±Ο„ΟΞΏΞΉ/Ο€ΞΏΞ»Ξ―Ο„ΞµΟ‚/Ο€ΟΞΏΞ·Ξ³. ΞΉΞ΄ΞΉΞΏΞΊΟ„Ξ®Ο„ΞµΟ‚)
          </button>
        </div>

        {activeTab === "booklet" && (
          <div className="petTabPanel">
            <div className="booklet-layout">
              <div className="booklet-bottom">
                <div className="info-box large">
                  <h4>Ξ™Ξ±Ο„ΟΞΉΞΊΞ­Ο‚ Ξ ΟΞ¬ΞΎΞµΞΉΟ‚</h4>
                  {medicalActions.length === 0 ? (
                    <p className="empty">β€” Ξ”ΞµΞ½ Ο…Ο€Ξ¬ΟΟ‡ΞΏΟ…Ξ½ ΞΊΞ±Ο„Ξ±Ο‡Ο‰ΟΞ®ΟƒΞµΞΉΟ‚ β€”</p>
                  ) : (
                    <div className="medical-actions-list">
                      {medicalActions.map((action) => (
                        <div key={action.id} className="medical-action-item">
                          <p><strong>Ξ—ΞΌΞµΟΞΏΞΌΞ·Ξ½Ξ―Ξ±:</strong> {action.date}</p>
                          <p><strong>Ξ¤ΟΟ€ΞΏΟ‚:</strong> {action.type}</p>
                          <p><strong>Ξ ΞµΟΞΉΞ³ΟΞ±Ο†Ξ®:</strong> {action.description}</p>
                          <p><strong>Ξ¦Ξ¬ΟΞΌΞ±ΞΊΞ±/ΞΞ΄Ξ·Ξ³Ξ―ΞµΟ‚:</strong> {action.medications}</p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="info-box large">
                  <h4>Ξ¤Ο…Ο‡ΟΞ½ Ξ£Ο…ΞΌΞ²Ξ¬Ξ½Ο„Ξ±</h4>
                  <p className="empty">β€” Ξ”ΞµΞ½ Ο…Ο€Ξ¬ΟΟ‡ΞΏΟ…Ξ½ ΞΊΞ±Ο„Ξ±Ο‡Ο‰ΟΞ®ΟƒΞµΞΉΟ‚ β€”</p>
                </div>
              </div>

              <div className="bookletPrintCenter">
                <button className="next-btn" type="button" onClick={() => window.print()}>
                  Ξ•ΞΊΟ„ΟΟ€Ο‰ΟƒΞ·
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


