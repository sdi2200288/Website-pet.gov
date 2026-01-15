import "./PetDeclaration.css";
import React from "react";
import PetDeclaration from "./PetDeclaration";

export default function PetDeclarationsList({ type, declarations = [], onDeleteDeclaration, onViewDeclaration, onPrintDeclaration, sortOrder, onSortChange }) {
  return (
    <div className="petTabPanel">
      <div className="results-center">
        <h2>Αποτελέσματα ({declarations.length})</h2>
      </div>
      <div className="petDeclarationsHeader">
        <div className="petDeclarationsSort">
          <span>Ταξινόμηση:</span>
           <select value={sortOrder} onChange={e => onSortChange(e.target.value)}>
            <option value="recent">Πρόσφατες</option>
            <option value="old">Παλαιότερες</option>
          </select>
        </div>
      </div>

      <div className="petDeclarationsList">
        {declarations.map(item => (
          <PetDeclaration
            key={item.id}
            item={item}
            type={type}
            onDeleteDeclaration={onDeleteDeclaration}
            onViewDeclaration={onViewDeclaration}
            onPrintDeclaration={onPrintDeclaration}
          />
        ))}
      </div>
    </div>
  );
}
