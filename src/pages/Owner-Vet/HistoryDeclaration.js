import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES, GENDERS, dogPopular, catPopular } from "../Utils/Util";
import DeclarationModal from "../../pages/Owner-Vet/WatchDeclaration";


export default function HistoryDeclaration() {
  const navigate = useNavigate();
  // Filters
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedChip, setSelectedChip] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("recent"); // recent | old
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Data
  const [allPets, setAllPets] = useState([]);
  const [foundDeclarations, setFoundDeclarations] = useState([]);
  const [lossDeclarations, setLossDeclarations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));
  const isOwner = user?.role === "owner";
  const isVet = user?.role === "vet";

  // Ξ¦ΟΟΟ„Ο‰ΟƒΞ· ΞΊΞ±Ο„ΞΏΞΉΞΊΞΉΞ΄Ξ―Ο‰Ξ½ (Ξ΄ΞΉΞ±Ο†ΞΏΟΞµΟ„ΞΉΞΊΞ¬ Ξ³ΞΉΞ± owner ΞΊΞ±ΞΉ vet)
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const petsReq = fetch("http://localhost:3001/pets").then(r => r.json());

        const foundUrl = isOwner
          ? `http://localhost:3001/foundReports?ownerId=${user.id}`
          : `http://localhost:3001/foundReports?vetId=${user.id}`;

        const lostUrl = isOwner
          ? `http://localhost:3001/lostReports?ownerId=${user.id}`
          : `http://localhost:3001/lostReports?vetId=${user.id}`;

        const [pets, found, lost] = await Promise.all([
          petsReq,
          fetch(foundUrl).then(r => r.json()),
          fetch(lostUrl).then(r => r.json()),
        ]);

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

        const ownerIds = new Set();
        (Array.isArray(found) ? found : []).forEach((r) => r.ownerId && ownerIds.add(r.ownerId));
        (Array.isArray(lost) ? lost : []).forEach((r) => r.ownerId && ownerIds.add(r.ownerId));

        const nameMap = {};
        await Promise.all(
          [...ownerIds].map(async (personId) => {
            nameMap[personId] = await fetchPersonName(personId);
          })
        );

        const foundWithNames = (Array.isArray(found) ? found : []).map((r) => ({
          ...r,
          ownerName: nameMap[r.ownerId] || null,
        }));
        const lostWithNames = (Array.isArray(lost) ? lost : []).map((r) => ({
          ...r,
          ownerName: nameMap[r.ownerId] || null,
        }));

        setAllPets(pets);
        setFoundDeclarations(foundWithNames);
        setLossDeclarations(lostWithNames);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, isOwner, isVet]);

  const handleViewDeclaration = (declaration) => {
    setSelectedDeclaration(declaration);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDeclaration(null);
    setIsModalOpen(false);
  };

  const formatDateTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("el-GR");
  };

  const labelForType = (t) => {
    if (t === "loss" || t === "lost") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ‘Ο€ΟΞ»ΞµΞΉΞ±Ο‚";
    if (t === "found") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ•ΟΟΞµΟƒΞ·Ο‚";
    if (t === "foundNoAcc") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ•ΟΟΞµΟƒΞ·Ο‚ (Ο‡Ο‰ΟΞ―Ο‚ Ξ»ΞΏΞ³Ξ±ΟΞΉΞ±ΟƒΞΌΟ)";
    if (t === "adoption") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ¥ΞΉΞΏΞΈΞµΟƒΞ―Ξ±Ο‚";
    if (t === "foster") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· Ξ¦ΞΉΞ»ΞΏΞΎΞµΞ½Ξ―Ξ±Ο‚";
    if (t === "transfer") return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ· ΞΞµΟ„Ξ±Ξ²Ξ―Ξ²Ξ±ΟƒΞ·Ο‚";
    return "Ξ”Ξ®Ξ»Ο‰ΟƒΞ·";
  };

      const buildPrintRows = (declaration) => {
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
  };

  const handlePrintDeclaration = (declaration) => {
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
  };
  // Ξ£Ο…Ξ½Ξ¬ΟΟ„Ξ·ΟƒΞ· Ξ³ΞΉΞ± ΞµΟΟΞµΟƒΞ· ΞΊΞ±Ο„ΞΏΞΉΞΊΞ―Ξ΄ΞΉΞΏΟ… ΞΌΞµ Ξ²Ξ¬ΟƒΞ· Ο„ΞΏ petId
  const findPetById = (petId) => {
    return allPets.find(p => p.id === petId) || null;
  };


  // Ξ”Ξ·ΞΌΞΉΞΏΟ…ΟΞ³Ξ―Ξ± ΞΉΟƒΟ„ΞΏΟΞΉΞΊΞΏΟ Ξ΄Ξ·Ξ»ΟΟƒΞµΟ‰Ξ½ ΞΌΞµ ΟƒΟ‰ΟƒΟ„Ξ¬ Ξ΄ΞµΞ΄ΞΏΞΌΞ­Ξ½Ξ±
  const historyDeclarations = useMemo(() => {
    const combined = [];

    lossDeclarations.forEach(r => {
      const pet = findPetById(r.petId);
      combined.push({
        ...r,
        type: "lost",
        petName: pet?.name || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        microchip: pet?.microchip || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        species: pet?.species || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        breed: pet?.breed || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        gender: pet?.gender || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        photo: pet?.photoUrl || "",
        region: r.region || pet?.region || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
      });
    });

    foundDeclarations.forEach(r => {
      const pet = findPetById(r.petId);
      combined.push({
        ...r,
        type: "found",
        petName: pet?.name || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        microchip: pet?.microchip || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        species: pet?.species || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        breed: pet?.breed || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        gender: pet?.gender || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
        photo: pet?.photoUrl || "",
        region: r.region || pet?.region || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„ΞΏ",
      });
    });

    return combined;
  }, [lossDeclarations, foundDeclarations, allPets]);

  const breeds = selectedSpecies === "Ξ£ΞΊΟΞ»ΞΏΟ‚" ? dogPopular : selectedSpecies === "Ξ“Ξ¬Ο„Ξ±" ? catPopular : [...dogPopular, ...catPopular];

  const filteredDeclarations = useMemo(() => {
    return historyDeclarations

      .filter((d) => {
        if (selectedChip && d.microchip !== selectedChip) return false;
        if (selectedSpecies && d.species !== selectedSpecies) return false;
        if (selectedBreed && d.breed !== selectedBreed) return false;
        if (selectedGender && normalizeGender(d.gender) !== selectedGender) return false;
        if (selectedRegion && !d.region?.includes(selectedRegion) && !selectedRegion.includes(d.region)) return false;
        if (dateFrom && new Date(d.date) < new Date(dateFrom)) return false;
        if (dateTo && new Date(d.date) > new Date(dateTo)) return false;

        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.createdAt || a.date);
        const db = new Date(b.createdAt || b.date);

        return sortOrder === "recent" ? db - da : da - db;
      });

  }, [
    historyDeclarations,
    selectedChip,
    selectedSpecies,
    selectedBreed,
    selectedGender,
    selectedRegion,
    dateFrom,
    dateTo,
    sortOrder
  ]);

  const normalizeGender = (g) => {
    if (!g) return "";
    if (g === "male") return "Ξ‘ΟΟƒΞµΞ½ΞΉΞΊΟ";
    if (g === "female") return "ΞΞ·Ξ»Ο…ΞΊΟ";
    return g;
  };


  // ΞΞΏΞ½Ξ±Ξ΄ΞΉΞΊΞ¬ microchips Ξ³ΞΉΞ± Ο„ΞΏ dropdown
  const uniqueMicrochips = [...new Set(historyDeclarations.map(d => d.microchip))];

  // Ξ£Ο…Ξ½Ξ¬ΟΟ„Ξ·ΟƒΞ· Ξ΄ΞΉΞ±Ξ³ΟΞ±Ο†Ξ®Ο‚ Ξ΄Ξ®Ξ»Ο‰ΟƒΞ·Ο‚
  const handleDeleteDeclaration = async (id, type) => {
    if (!window.confirm("Ξ£Ξ―Ξ³ΞΏΟ…ΟΞ± Ξ΄ΞΉΞ±Ξ³ΟΞ±Ο†Ξ®;")) return;

    const map = {
      lost: "lostReports",
      found: "foundReports",
    };

    await fetch(`http://localhost:3001/${map[type]}/${id}`, { method: "DELETE" });
    window.location.reload();
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Ξ¦ΟΟΟ„Ο‰ΟƒΞ· ΞΉΟƒΟ„ΞΏΟΞΉΞΊΞΏΟ...</p>;
  }

  return (

    <div className="history-page">
      <h3 className="history-title">Ξ™ΟƒΟ„ΞΏΟΞΉΞΊΟ Ξ”Ξ·Ξ»ΟΟƒΞµΟ‰Ξ½</h3>

      <div className="pets-filters history-filters-panel">
        <div className="filter-item">
          <span className="filter-label">Ξ•Ξ―Ξ΄ΞΏΟ‚:</span>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="">ΞΞ»Ξ±</option>
            {SPECIES.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ξ΅Ξ¬Ο„ΟƒΞ±:</span>
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
            <option value="">ΞΞ»ΞµΟ‚</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ξ¦ΟΞ»ΞΏ:</span>
          <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
            <option value="">ΞΞ»Ξ±</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ξ ΞµΟΞΉΞΏΟ‡Ξ®:</span>
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="">ΞΞ»ΞµΟ‚</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ξ—ΞΌΞµΟΞΏΞΌΞ·Ξ½Ξ―Ξ± Ξ±Ο€Ο:</span>
          {/* <input type="date" /> */}
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>

        <div className="filter-item">
          <span className="filter-label">Ξ—ΞΌΞµΟΞΏΞΌΞ·Ξ½Ξ―Ξ± Ξ­Ο‰Ο‚:</span>
          {/* <input type="date" /> */}
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>

        <div className="filter-item history-chip-filter">
          <span className="filter-label">ΞΞ±Ο„ΞΏΞΉΞΊΞ―Ξ΄ΞΉΞΏ:</span>
          <select value={selectedChip} onChange={(e) => setSelectedChip(e.target.value)}>
            <option value="">ΞΞ»Ξ±</option>
            {uniqueMicrochips.map(microchip => {
              const pet = allPets.find(p => p.microchip === microchip);
              return (
                <option key={microchip} value={microchip}>
                  {microchip} - {pet?.name || "Ξ§Ο‰ΟΞ―Ο‚ ΟΞ½ΞΏΞΌΞ±"} - {pet?.breed || "Ξ†Ξ³Ξ½Ο‰ΟƒΟ„Ξ· ΟΞ¬Ο„ΟƒΞ±"}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="history-list-panel">
        <PetDeclarationsList
          declarations={filteredDeclarations}
          onDeleteDeclaration={handleDeleteDeclaration}
          onViewDeclaration={handleViewDeclaration}
          onPrintDeclaration={handlePrintDeclaration}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
                />
        <DeclarationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          declaration={selectedDeclaration}
        />
      </div>
    </div>
  );
}


