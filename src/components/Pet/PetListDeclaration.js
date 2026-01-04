import "./PetDeclaration.css";
import React from "react";
import PetDeclaration from "./PetDeclaration";

export default function PetDeclarationsList({ type, declarations =[],  onDeleteDeclaration }) {
  return (
    <div className="petTabPanel">
      <div className="petDeclarationsHeader">
        <div className="petDeclarationsSort">
          <span>Ταξινόμηση:</span>
          <select>
            <option>Πρόσφατες</option>
            <option>Παλαιότερες</option>
          </select>
        </div>
      </div>

      <div className="petDeclarationsList">
        {declarations.map(item => (
          <PetDeclaration key={item.id} item={item} type={item.type} onDeleteDeclaration={onDeleteDeclaration} />
        ))}
      </div>

      <div className="petDeclarationsMore">
        <button className="petButtonSecondary">Περισσότερα</button>
      </div>
    </div>
  );
}
