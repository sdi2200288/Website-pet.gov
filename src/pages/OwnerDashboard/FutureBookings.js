import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import { updateVetAvailability, sendNotification } from "../../AppointmentUtils";
import "./FutureBookings.css";

// Helper: date + time → Date object
const getAppointmentDateTime = (a) => {
  if (!a?.date || !a?.time) return null;
  const [hour, minute] = a.time.split(":").map(Number);
  const d = new Date(a.date);
  d.setHours(hour, minute, 0, 0);
  return d;
};

export default function FutureBookings() {
  const [bookings, setBookings] = useState([]);
  const [openId, setOpenId] = useState(null);

  const getMedicalActLabel = (id) => {
    const act = MEDICAL_ACTS.find(a => a.id === id);
    return act ? act.label : "Άγνωστη Πράξη";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed": return "ok";
      case "pending": return "waiting";
      case "cancelled": return "cancelled";
      default: return "";
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    Promise.all([
      fetch(`http://localhost:3001/appointments?ownerId=${user.id}`).then(r => r.json()),
      fetch(`http://localhost:3001/pets?ownerId=${user.id}`).then(r => r.json()),
      fetch(`http://localhost:3001/vets`).then(r => r.json())
    ]).then(([appointments, pets, vets]) => {
      const now = new Date();

      const futureAppointments = appointments
        .filter(a => {
          const apptDate = getAppointmentDateTime(a);
          if (!apptDate) return false;
          return apptDate >= now && !["cancelled", "rejected"].includes(a.status);
        })
        .map(a => ({
          ...a,
          pet: pets.find(p => p.id === a.petId),
          vet: vets.find(v => v.id === a.vetId)
        }))
        .sort((a, b) => getAppointmentDateTime(a) - getAppointmentDateTime(b));

      console.log("Future appointments:", futureAppointments.map(a => ({
        id: a.id,
        pet: a.pet?.name,
        vet: a.vet ? `${a.vet.firstname} ${a.vet.lastname}` : a.vetId,
        date: a.date,
        time: a.time,
        status: a.status
      })));

      setBookings(futureAppointments);
    }).catch(err => console.error("Error fetching future bookings:", err));
  }, []);

  const toggle = id => setOpenId(openId === id ? null : id);

  const cancelBooking = async (appointment) => {
    const updated = {
      ...appointment,
      status: "cancelled",
      cancelledBy: "owner",
      cancelledAt: new Date().toISOString()
    };

    await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    if (appointment.status === "confirmed") {
      await updateVetAvailability(
        appointment.vetId,
        appointment.date,
        appointment.time,
        "add"
      );
    }

    await sendNotification({
      userId: appointment.vetId,
      userType: "vet",
      title: "Ακύρωση Ραντεβού",
      message: `Ο ιδιοκτήτης ακύρωσε το ραντεβού για ${appointment.pet?.name}`,
      appointmentId: appointment.id
    });

    setBookings(prev => prev.filter(b => b.id !== appointment.id));
  };

  return (
    <div className="future-bookings">
      <h2>Μελλοντικά Ραντεβού</h2>

      {bookings.length === 0 && <p>Δεν υπάρχουν μελλοντικά ραντεβού.</p>}

      {bookings.map(b => (
        <div key={b.id} className={`booking-card ${b.status}`}>
          <div className="booking-header" onClick={() => toggle(b.id)}>
            <strong>{b.pet?.name}</strong>

            <div className="right">
              <span className="time">
                {getAppointmentDateTime(b)?.toLocaleDateString("el-GR")} • {b.time}
              </span>

              <span className={`status ${getStatusClass(b.status)}`}>
                {b.status.toUpperCase()}
              </span>

              <span className={`arrow ${openId === b.id ? "open" : ""}`}>
                ▼
              </span>
            </div>
          </div>


          {openId === b.id && (
            <div className="booking-body">
              <div className="info-grid">
                <p><strong>Κτηνίατρος:</strong> {b.vet ? `${b.vet.firstname} ${b.vet.lastname}` : b.vetId}</p>
                <p><strong>Ιατρική Πράξη:</strong> {getMedicalActLabel(b.reason)}</p>
                <p><strong>Microchip:</strong> {b.pet?.microchip}</p>
              </div>

              <button className="cancel-btn" onClick={() => cancelBooking(b)}>
                Ακύρωση Ραντεβού
              </button>

            </div>
          )}
        </div>
      ))}
    </div>
  );
}
