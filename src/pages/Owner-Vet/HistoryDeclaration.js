import React, { useState } from "react";
import "./HistoryDeclaration.css";
import PetDeclarationsList from "../../components/Pet/PetListDeclaration";
import { REGIONS, SPECIES,GENDERS,dogPopular,catPopular,foundDeclarations,lossDeclarations,} from "../Utils/Util";

export default function HistoryDeclaration() {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedChip, setSelectedChip] = useState(""); 
  const breeds = selectedSpecies === "Σκύλος"? dogPopular: selectedSpecies === "Γάτα"? catPopular: [...dogPopular, ...catPopular];
  const historyDeclarations = [...lossDeclarations, ...foundDeclarations];
  const filteredDeclarations = selectedChip? historyDeclarations.filter((d) => String(d.microchip || "") === String(selectedChip)) : historyDeclarations;

  return (
    <div className="history-page">
      <h3 className="history-title">Ιστορικό Δηλώσεων</h3>

      <div className="pets-filters history-filters-panel">
        <div className="filter-item">
          <span className="filter-label">Είδος:</span>
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="">Όλα</option>
            {SPECIES.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ράτσα:</span>
          <select>
            <option value="">Όλες</option>
            {breeds.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Φύλο:</span>
          <select>
            <option value="">Όλα</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Περιοχή:</span>
          <select>
            <option value="">Όλες</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία από:</span>
          <input type="date" />
        </div>

        <div className="filter-item">
          <span className="filter-label">Ημερομηνία έως:</span>
          <input type="date" />
        </div>

        <div className="filter-item history-chip-filter">
          <span className="filter-label">Κατοικίδιο:</span>
          <select
            value={selectedChip}
            onChange={(e) => setSelectedChip(e.target.value)}
          >
            <option value="">Όλα</option>
            {historyDeclarations
              .filter((d) => d.microchip) 
              .map((d) => (
                <option key={d.id} value={String(d.microchip)}>
                  {d.microchip} - {d.petName || "Χωρίς όνομα"} -{" "}
                  {d.breed || "Άγνωστη ράτσα"}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div className="history-list-panel">
        <PetDeclarationsList type="loss" declarations={filteredDeclarations} />
      </div>
    </div>
  );
}
