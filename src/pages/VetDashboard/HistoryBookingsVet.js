import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import "./HistoryBookingsVet.css";

export default function AppointmentHistoryVet() {
  const [history, setHistory] = useState([]);
  const [openId, setOpenId] = useState(null);

  const getMedicalActLabel = (id) => {
    const act = MEDICAL_ACTS.find(a => a.id === id);
    return act ? act.label : "Άγνωστη Πράξη";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Promise.all([
    //   fetch(`http://localhost:3001/appointments?ownerId=${user.id}`).then(r => r.json()),
    //   fetch(`http://localhost:3001/pets?ownerId=${user.id}`).then(r => r.json())
    // ])
      Promise.all([
        fetch(`http://localhost:3001/appointments?vetId=${user.id}`).then(r => r.json()),
        fetch(`http://localhost:3001/pets`).then(r => r.json()) // Πέρνουμε όλα τα pets
      ])
    .then(([appointments, pets]) => {
      const today = new Date();

      const pastAppointments = appointments
        .filter(a =>
          new Date(`${a.date}T${a.time}`) < today ||
          ["cancelled", "rejected"].includes(a.status)
        )
        .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

      setHistory(pastAppointments);
    });
  }, []);

  const toggle = id => setOpenId(openId === id ? null : id);

  return (
    <div className="history-appointment-history-vet">
      <h2>Ιστορικό Ραντεβού</h2>

      {history.length === 0 && <p>Δεν υπάρχει ιστορικό ραντεβού.</p>}

      {history.map(a => (
        <div key={a.id} className={`history-booking-card-vet history ${a.status}`}>
          <div className="history-booking-header-vet" onClick={() => toggle(a.id)}>
            <div className="history-left-vet">
              <div className="history-pet-name-vet">{a.pet?.name || a.petName}</div>
            </div>
            <div className="history-right">
              <span>🕒 {new Date(a.date).toLocaleDateString("el-GR")} • {a.time}</span>
              
              <span className={`history-status-vet ${a.status}`}>
                {a.status === "cancelled" && "Ακυρώθηκε"}
                {a.status === "rejected" && "Απορρίφθηκε"}
                {a.status === "confirmed" && "Ολοκληρώθηκε"}
              </span>
              
              <span className="arrow">{openId === a.id ? "▲" : "▼"}</span>
            </div>
          </div>

          {openId === a.id && (
            <div className="history-booking-body-vet">
              <div className="history-info-grid-vet">
                <div><strong>Κτηνίατρος:</strong> {a.vetName}</div>
                <div><strong>Ιατρική Πράξη:</strong> {getMedicalActLabel(a.reason)}</div>
                <div><strong>Είδος:</strong> {a.pet?.species}</div>
                <div><strong>Microchip:</strong> {a.pet?.microchip}</div>
                {a.cancelledBy && (
                  <div><strong>Ακυρώθηκε από:</strong> {a.cancelledBy === "owner" ? "Ιδιοκτήτη" : "Κτηνίατρο"}</div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}