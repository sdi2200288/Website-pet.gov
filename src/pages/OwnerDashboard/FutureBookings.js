import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import { updateVetAvailability, sendNotification } from "../../AppointmentUtils";
import "./FutureBookings.css";

export default function FutureBookings() {
  const [bookings, setBookings] = useState([]);
  const [openId, setOpenId] = useState(null);

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
        const future = appointments
          .filter(a => new Date(a.date) >= today)
          .map(a => ({
            ...a,
            pet: pets.find(p => p.id === a.petId)
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setBookings(future);
      });
  }, []);

  const toggle = id => setOpenId(openId === id ? null : id);

  const cancelBooking = async (appointment) => {
    if (appointment.status === "cancelled") {
      alert("Το ραντεβού έχει ήδη ακυρωθεί.");
      return;
    }

    try {
      const updatedAppointment = {
        ...appointment,
        status: "cancelled",
        cancelledBy: "owner",
        cancelledAt: new Date().toISOString()
      };

      // 1. Update appointment
      await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointment)
      });

      // 2. Αν ήταν επιβεβαιωμένο, επαναφέρουμε ώρα στο vet
      if (appointment.status === "confirmed") {
        await updateVetAvailability(appointment.vetId, appointment.date, appointment.time, "add");
      }

      // 3. Notification στον vet
      await sendNotification({
        userId: appointment.vetId,
        userType: "vet",
        title: "Ακύρωση Ραντεβού",
        message: `Ο ιδιοκτήτης ${appointment.ownerName} ακύρωσε το ραντεβού για ${appointment.petName} στις ${appointment.date} ${appointment.time}`,
        appointmentId: appointment.id
      });

      // 4. Update UI
      setBookings(prev => prev.map(b => b.id === appointment.id ? updatedAppointment : b));
      alert("Το ραντεβού ακυρώθηκε επιτυχώς");

    } catch (err) {
      console.error(err);
      alert("Σφάλμα κατά την ακύρωση του ραντεβού");
    }
  };

  return (
    <div className="future-bookings">
      <h2>Μελλοντικά Ραντεβού</h2>
      <div className="bookings-list">
        {bookings.map(b => (
          <div key={b.id} className={`booking-card ${b.status === "confirmed" ? "confirmed" : "pending"}`}>
            <div className="booking-header" onClick={() => toggle(b.id)}>
              <div className="left">
                <div className="pet-name">{b.petName}</div>
              </div>
              <div className="right">
                <span className="time">🕒 {new Date(b.date).toLocaleDateString("el-GR")} • {b.time}</span>
                <span className={`status ${b.status === "confirmed" ? "ok" : b.status === "pending" ? "waiting" : "cancelled"}`}>
                  {b.status === "confirmed" ? "Επιβεβαιωμένο" : b.status === "pending" ? "Περιμένει απάντηση από κτηνίατρο" : "Ακυρώθηκε"}
                </span>
                <span className="action">{getMedicalActLabel(b.reason)}</span>
                <span className="arrow">{openId === b.id ? "▲" : "▼"}</span>
              </div>
            </div>
            {openId === b.id && (
              <div className="booking-body">
                <div className="info-grid">
                  <div><strong>Είδος:</strong> {b.petSpecies}</div>
                  <div><strong>Microchip:</strong> {b.petMicrochip}</div>
                  <div><strong>Κτηνίατρος:</strong> {b.vetName}</div>
                  <div><strong>Ημερομηνία:</strong> {new Date(b.date).toLocaleDateString("el-GR")}</div>
                  <div><strong>Ιατρική Πράξη:</strong> {getMedicalActLabel(b.reason)}</div>
                </div>
                {b.status !== "cancelled" && (
                  <button className="cancel-btn" onClick={() => cancelBooking(b)}>Ακύρωση</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
