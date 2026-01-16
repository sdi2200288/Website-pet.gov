import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import { useNavigate } from "react-router-dom";
import "./HistoryBookings.css";

const getAppointmentDateTime = (a) => {
  const [hour, minute] = a.time.split(":").map(Number);
  const d = new Date(a.date);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export default function AppointmentHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [openId, setOpenId] = useState(null);

  const getMedicalActLabel = (id) => {
    const act = MEDICAL_ACTS.find(a => a.id === id);
    return act ? act.label : "Άγνωστη Πράξη";
  };

  const handleRepeatAppointment = (appointment) => {
    navigate(`/owner-dashboard/book-date?vetId=${appointment.vetId}`);
  };

  const handleReviewAppointment = (appointment) => {
    navigate(`/review/${appointment.vetId}`, {
      state: {
        appointmentId: appointment.id,
        vetId: appointment.vetId
      }
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    Promise.all([
      fetch(`http://localhost:3001/appointments?ownerId=${user.id}`).then(r => r.json()),
      fetch(`http://localhost:3001/pets?ownerId=${user.id}`).then(r => r.json()),
      fetch(`http://localhost:3001/reviews`).then(r => r.json()),
      fetch(`http://localhost:3001/vets`).then(r => r.json())
    ]).then(([appointments, pets, reviews, vets]) => {
      const now = new Date();

      const pastAppointments = appointments
        .filter(a => {
          const apptDate = getAppointmentDateTime(a);
          return (
            apptDate < now ||
            ["cancelled", "rejected"].includes(a.status)
          );
        })
        .map(a => ({
          ...a,
          pet: pets.find(p => p.id === a.petId),
          vet: vets.find(v => v.id === a.vetId),
          reviewed: reviews.some(r => r.appointmentId === a.id)
        }))
        .sort(
          (a, b) =>
            getAppointmentDateTime(b) - getAppointmentDateTime(a)
        );

      setHistory(pastAppointments);
    });
  }, []);

  const toggle = id => setOpenId(openId === id ? null : id);

  return (
    <div className="history-appointment-history">
      <h2>Ιστορικό Ραντεβού</h2>

      {history.length === 0 && <p>Δεν υπάρχει ιστορικό ραντεβού.</p>}

      {history.map(a => (
        <div key={a.id} className={`history-booking-card history ${a.status}`}>
          <div className="history-booking-header" onClick={() => toggle(a.id)}>
            <div className="history-main">
              <div className="history-pet-name">{a.pet?.name}</div>
              <div className="history-datetime">
                {getAppointmentDateTime(a).toLocaleDateString("el-GR")} • {a.time}
              </div>
            </div>

            <div className="history-actions">
              <span className={`history-status ${a.status}`}>
                {a.status === "cancelled" && "Ακυρώθηκε"}
                {a.status === "rejected" && "Απορρίφθηκε"}
                {a.status === "confirmed" && "Ολοκληρώθηκε"}
                {a.status === "pending" && "Δεν ολοκληρώθηκε"}
              </span>
              <span className="history-arrow">
                {openId === a.id ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {openId === a.id && (
            <div className="history-booking-body">
              <div className="history-info-grid">
                <div><strong>Κτηνίατρος:</strong> {a.vet ? `${a.vet.firstname} ${a.vet.lastname}` : a.vetId}</div>
                <div><strong>Ιατρική Πράξη:</strong> {getMedicalActLabel(a.reason)}</div>
                <div><strong>Είδος:</strong> {a.pet?.species}</div>
                <div><strong>Microchip:</strong> {a.pet?.microchip}</div>
                {a.cancelledBy && (
                  <div><strong>Ακυρώθηκε από:</strong> {a.cancelledBy === "owner" ? "Ιδιοκτήτη" : "Κτηνίατρο"}</div>
                )}
              </div>

              <div className="history-buttons">
                <button className="history-btn repeat" onClick={() => handleRepeatAppointment(a)}>
                  Ραντεβού Ξανά
                </button>

                {!a.reviewed && ["confirmed", "cancelled", "rejected", "pending"].includes(a.status) && (
                  <button className="history-btn review" onClick={() => handleReviewAppointment(a)}>
                    Αξιολόγησε
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
