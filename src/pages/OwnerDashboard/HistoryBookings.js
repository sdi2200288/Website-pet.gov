import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import { useNavigate,useLocation } from "react-router-dom";
import "./HistoryBookings.css";

export default function AppointmentHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [openId, setOpenId] = useState(null);

  const handleRepeatAppointment = (appointment) => {
    // Προς το παρόν απλά alert, μετά μπορείς να κάνεις redirect στο νέο ραντεβού
    alert(`Θες σίγουρα Ραντεβού ξανά με τον κτηνίατρο: ${appointment.vetName}`);
    navigate(`/owner-dashboard/book-date?vetId=${appointment.vetId}`);
  };

  const handleReviewAppointment = (appointment) => {
    // Προς το παρόν απλά alert, μετά μπορείς να ανοίξεις φόρμα αξιολόγησης
    alert(`Θες σίγουρα να αξιολογήσεις τον: ${appointment.vetName}`);
     navigate(`/review/${appointment.vetId}`, { 
      state: { 
        appointmentId: appointment.id,
        vetName: appointment.vetName 
      }  
    });
  };

  const getMedicalActLabel = (id) => {
    const act = MEDICAL_ACTS.find(a => a.id === id);
    return act ? act.label : "Άγνωστη Πράξη";
  };
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    Promise.all([
      fetch(`http://localhost:3001/appointments?ownerId=${user.id}`).then(r => r.json()),
      fetch(`http://localhost:3001/pets?ownerId=${user.id}`).then(r => r.json())
    ])
    .then(([appointments, pets]) => {
      const today = new Date();

      const pastAppointments = appointments
        .filter(a =>
          new Date(`${a.date}T${a.time}`) < today ||
          ["cancelled", "rejected"].includes(a.status)
        )
        .map(a => ({
          ...a,
          pet: pets.find(p => p.id === a.petId)
        }))
        // .sort((a, b) => new Date(b.date) - new Date(a.date));
        .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));


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
          {/* <div className="history-booking-header" onClick={() => toggle(a.id)}>
            <div className="history-left">
              <div className="history-pet-name">{a.pet?.name}</div>
            </div>
            <div className="history-right">
              <span>🕒 {new Date(`${a.date}T${a.time}`).toLocaleDateString("el-GR")} • {a.time}</span>
              <span className={`history-status ${a.status}`}>
                {a.status === "cancelled" && "Ακυρώθηκε"}
                {a.status === "rejected" && "Απορρίφθηκε"}
                {a.status === "confirmed" && "Ολοκληρώθηκε"}
              </span>
              <span className="arrow">{openId === a.id ? "▲" : "▼"}</span>
            </div>
          </div> */}
          <div className="history-booking-header" onClick={() => toggle(a.id)}>
            <div className="history-main">
              <div className="history-pet-name">{a.pet?.name}</div>
              <div className="history-datetime">
                {new Date(`${a.date}T${a.time}`).toLocaleDateString("el-GR")} • {a.time}
              </div>
            </div>

            <div className="history-actions">
              <span className={`history-status ${a.status}`}>
                {a.status === "cancelled" && "Ακυρώθηκε"}
                {a.status === "rejected" && "Απορρίφθηκε"}
                {a.status === "confirmed" && "Ολοκληρώθηκε"}
              </span>
              <span className="history-arrow">{openId === a.id ? "▲" : "▼"}</span>
            </div>
          </div>


          {openId === a.id && (
            <div className="history-booking-body">
              <div className="history-info-grid">
                <div><strong>Κτηνίατρος:</strong> {a.vetName}</div>
                <div><strong>Ιατρική Πράξη:</strong> {getMedicalActLabel(a.reason)}</div>
                <div><strong>Είδος:</strong> {a.pet?.species}</div>
                <div><strong>Microchip:</strong> {a.pet?.microchip}</div>
                {a.cancelledBy && (
                  <div><strong>Ακυρώθηκε από:</strong> {a.cancelledBy === "owner" ? "Ιδιοκτήτη" : "Κτηνίατρο"}</div>
                )}
              </div>
              <div className="history-buttons">
                <button className="history-btn repeat" onClick={() => handleRepeatAppointment(a)}>Ραντεβού Ξανά</button>
                <button className="history-btn review" onClick={() => handleReviewAppointment(a)}>Αξιολόγησε</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
