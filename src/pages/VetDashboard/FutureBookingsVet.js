// import React, { useEffect, useState } from "react";
// import "./FutureBookingsVet.css";
// import { MEDICAL_ACTS } from "../Utils/Util";
// import { updateVetAvailability, sendNotification } from "../../AppointmentUtils";

// export default function FutureBookingsVet() {
//   const [bookings, setBookings] = useState([]);
//   const [openId, setOpenId] = useState(null);

//   // Προσθήκη state για φόρτωση και σφάλματα
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const getMedicalActLabel = (id) => {
//     const act = MEDICAL_ACTS.find(a => a.id === id);
//     return act ? act.label : id;
//   };

// useEffect(() => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) return;

//   fetch(`http://localhost:3001/appointments?vetId=${user.id}`)
//     .then(res => res.json())
//     .then(data => {
//       const today = new Date();
//       const future = data
//         .filter(a => new Date(a.date) >= today && 
//                     (a.status === "pending" || a.status === "confirmed"))
//         .sort((a, b) => new Date(a.date) - new Date(b.date));

//       setBookings(future);
//     })
//     .catch(err => console.error(err));
// }, []);

//   const toggle = (id) => {
//     setOpenId(openId === id ? null : id);
//   };
  
//  const updateStatus = async (appointment, newStatus) => {
//     try {
//       // Αν απορρίπτεται επιβεβαιωμένο ραντεβού, επαναφέρουμε την ώρα
//       if (appointment.status === "confirmed" && newStatus === "rejected") {
//         const vetRes = await fetch(`http://localhost:3001/vets/${appointment.vetId}`);
//         const vet = await vetRes.json();
        
//         const updatedAvailability = vet.availability.map(day => {
//           if (day.date === appointment.date) {
//             const times = day.times || [];
//             if (!times.includes(appointment.time)) {
//               return {
//                 ...day,
//                 times: [...times, appointment.time].sort()
//               };
//             }
//           }
//           return day;
//         });
        
//         await fetch(`http://localhost:3001/vets/${appointment.vetId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ availability: updatedAvailability })
//         });
//       }

//       // Update appointment status
//       const res = await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           status: newStatus,
//           ...(newStatus === "rejected" && appointment.status === "confirmed" ? {
//             cancelledBy: "vet",
//             cancelledAt: new Date().toISOString()
//           } : {})
//         })
//       });

//       const updatedAppointment = await res.json();

//       // Αν επιβεβαιώνεται
//       if (newStatus === "confirmed") {
//         const vetRes = await fetch(`http://localhost:3001/vets/${appointment.vetId}`);
//         const vet = await vetRes.json();

//         const updatedAvailability = vet.availability.map(day => {
//           if (day.date !== appointment.date) return day;
//           return {
//             ...day,
//             times: (day.times || []).filter(t => t !== appointment.time)
//           };
//         });

//         await fetch(`http://localhost:3001/vets/${appointment.vetId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ availability: updatedAvailability })
//         });
//       }

//       // Δημιουργία ειδοποίησης για επιβεβαίωση ή απόρριψη
//       if (newStatus === "confirmed" || newStatus === "rejected") {
//       await fetch('http://localhost:3001/notifications', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: appointment.ownerId,
//           userType: "owner",
//           title: newStatus === "confirmed" ? "Επιβεβαίωση Ραντεβού" : "Απόρριψη Ραντεβού",
//           message: newStatus === "confirmed" 
//             ? `Ο κτηνίατρος ${appointment.vetName} επιβεβαίωσε το ραντεβού για ${appointment.petName} στις ${appointment.date} ${appointment.time}`
//             : `Ο κτηνίατρος ${appointment.vetName} απέρριψε το ραντεβού για ${appointment.petName}`,
//           appointmentId: appointment.id,
//           read: false,
//           createdAt: new Date().toISOString()
//         })
//       });

//       }

//       // Update UI
//       setBookings(prev =>
//         prev.map(b => (b.id === updatedAppointment.id ? updatedAppointment : b))
//       );

//     } catch (err) {
//       console.error("Σφάλμα:", err);
//       alert("Σφάλμα κατά την ενημέρωση του ραντεβού");
//     }
//   };

//   const renderStatusText = (status) => {
//     if (status === "pending") return "Περιμένει απάντηση από ιδιοκτήτη";
//     if (status === "confirmed") return "Επιβεβαιωμένο";
//     if (status === "rejected") return "Απορρίφθηκε";
//     if (status === "cancelled") return "Ακυρώθηκε";
//     return status;
//   };

//  const cancelBooking = async (appointment) => {
//     try {
//       const updatedAppointment = {
//         ...appointment,
//         status: "cancelled",
//         cancelledBy: "vet",
//         cancelledAt: new Date().toISOString()
//       };

//       // 1. Update status appointment
//       const res = await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedAppointment)
//       });

//       // 2. Αν ήταν επιβεβαιωμένο, επαναφέρουμε την ώρα
//       if (appointment.status === "confirmed") {
//         const vetRes = await fetch(`http://localhost:3001/vets/${appointment.vetId}`);
//         const vet = await vetRes.json();
        
//         const updatedAvailability = vet.availability.map(day => {
//           if (day.date === appointment.date) {
//             const times = day.times || [];
//             if (!times.includes(appointment.time)) {
//               return {
//                 ...day,
//                 times: [...times, appointment.time].sort()
//               };
//             }
//           }
//           return day;
//         });
        
//         await fetch(`http://localhost:3001/vets/${appointment.vetId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ availability: updatedAvailability })
//         });
//       }

//       // 3. Δημιουργία ειδοποίησης για τον ιδιοκτήτη (ΓΙΑ ΟΛΑ ΤΑ ΡΑΝΤΕΒΟΥ)
//      await fetch('http://localhost:3001/notifications', {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: appointment.ownerId,
//         userType: "owner",
//         title: "Ακύρωση Ραντεβού",
//         message: `Ο κτηνίατρος ${appointment.vetName} ακύρωσε το ραντεβού για ${appointment.petName} στις ${appointment.date} ${appointment.time}`,
//         appointmentId: appointment.id,
//         read: false,
//         createdAt: new Date().toISOString()
//       })
//     });

//       // 4. Αφαίρεση από UI
//       setBookings(prev => prev.filter(b => b.id !== appointment.id));
      
//       alert("Το ραντεβού ακυρώθηκε επιτυχώς και ο ιδιοκτήτης ενημερώθηκε");

//     } catch (err) {
//       console.error(err);
//       alert("Σφάλμα κατά την ακύρωση του ραντεβού.");
//     }
//   };


//   return (
//     <div className="future-bookings">
//       <h2>Μελλοντικά Ραντεβού Κτηνιάτρου</h2>

//       <div className="bookings-list">
//         {bookings.map(b => (
//           <div
//             key={b.id}
//             className={`booking-card ${b.status}`}
//           >
//             {/* Header */}
//             <div className="booking-header" onClick={() => toggle(b.id)}>
//               <div className="left">
//                 <div className="pet-name">{b.petName}</div>
//                 <div className="owner-name">Ιδιοκτήτης: {b.ownerName}</div>
//               </div>

//               <div className="right">
//                 <span className="time">
//                   🕒 {new Date(b.date).toLocaleDateString("el-GR")} • {b.time}
//                 </span>

//                 <span className={`status ${b.status}`}>
//                   {renderStatusText(b.status)}
//                 </span>

//                 <span className="action">
//                   {getMedicalActLabel(b.reason)}
//                 </span>

//                 <span className="arrow">
//                   {openId === b.id ? "▲" : "▼"}
//                 </span>
//               </div>
//             </div>

//             {/* Body */}
//             {openId === b.id && (
//               <div className="booking-body">
//                 <div className="info-grid">
//                   <div><strong>Κατοικίδιο:</strong> {b.petName}</div>
//                   <div><strong>Είδος:</strong> {b.petSpecies}</div>
//                   <div><strong>Microchip:</strong> {b.petMicrochip}</div>
//                   <div><strong>Ιδιοκτήτης:</strong> {b.ownerName}</div>
//                   <div><strong>Email:</strong> {b.ownerEmail}</div>
//                   <div><strong>Τηλέφωνο:</strong> {b.ownerPhone}</div>
//                 </div>

//                  {(b.status === "pending" || b.status === "confirmed") && (
//                   <div className="vet-actions">
//                     {b.status === "pending" && (
//                       <>
//                         <button
//                           className="confirm-btn"
//                           onClick={() => updateStatus(b, "confirmed")}
//                         >
//                           Επιβεβαίωση
//                         </button>
//                         <button
//                           className="reject-btn"
//                           onClick={() => updateStatus(b, "rejected")}
//                         >
//                           Απόρριψη
//                         </button>
//                       </>
//                     )}
                    
//                     <button
//                       className="cancel-btn"
//                       onClick={() => cancelBooking(b)}
//                     >
//                       {b.status === "pending" ? "Ακύρωση" : "Ακύρωση Επιβεβαιωμένου"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { MEDICAL_ACTS } from "../Utils/Util";
import { updateVetAvailability, sendNotification } from "../../AppointmentUtils";
import "./FutureBookingsVet.css";

export default function FutureBookingsVet() {
  const [bookings, setBookings] = useState([]);
  const [openId, setOpenId] = useState(null);

  const getMedicalActLabel = (id) => {
    const act = MEDICAL_ACTS.find(a => a.id === id);
    return act ? act.label : "Άγνωστη Πράξη";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`http://localhost:3001/appointments?vetId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const today = new Date();
        const future = data
          .filter(a => new Date(a.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setBookings(future);
      });
  }, []);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  const updateStatus = async (appointment, newStatus) => {
    if (appointment.status === "cancelled") {
      alert("Το ραντεβού έχει ακυρωθεί και δεν μπορεί να τροποποιηθεί.");
      return;
    }

    try {
      // Αν απορρίπτεται επιβεβαιωμένο ραντεβού → επαναφορά ώρας
      if (appointment.status === "confirmed" && newStatus === "rejected") {
        await updateVetAvailability(appointment.vetId, appointment.date, appointment.time, "add");
      }

      // Update status appointment
      const res = await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "rejected" && appointment.status === "confirmed" ? {
            cancelledBy: "vet",
            cancelledAt: new Date().toISOString()
          } : {})
        })
      });
      const updatedAppointment = await res.json();

      // Αν επιβεβαιώνεται → αφαιρούμε ώρα
      if (newStatus === "confirmed") {
        await updateVetAvailability(appointment.vetId, appointment.date, appointment.time, "remove");
      }

      // Δημιουργία ειδοποίησης στον owner
      if (newStatus === "confirmed" || newStatus === "rejected") {
        await sendNotification({
          userId: appointment.ownerId,
          userType: "owner",
          title: newStatus === "confirmed" ? "Επιβεβαίωση Ραντεβού" : "Απόρριψη Ραντεβού",
          message: newStatus === "confirmed" 
            ? `Ο κτηνίατρος ${appointment.vetName} επιβεβαίωσε το ραντεβού για ${appointment.petName} στις ${appointment.date} ${appointment.time}`
            : `Ο κτηνίατρος ${appointment.vetName} απέρριψε το ραντεβού για ${appointment.petName}`,
          appointmentId: appointment.id
        });
      }

      setBookings(prev => prev.map(b => b.id === updatedAppointment.id ? updatedAppointment : b));
    } catch (err) {
      console.error(err);
      alert("Σφάλμα κατά την ενημέρωση του ραντεβού");
    }
  };

  const cancelBooking = async (appointment) => {
    if (appointment.status === "cancelled") {
      alert("Το ραντεβού έχει ήδη ακυρωθεί.");
      return;
    }

    try {
      const updatedAppointment = {
        ...appointment,
        status: "cancelled",
        cancelledBy: "vet",
        cancelledAt: new Date().toISOString()
      };

      await fetch(`http://localhost:3001/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointment)
      });

      if (appointment.status === "confirmed") {
        await updateVetAvailability(appointment.vetId, appointment.date, appointment.time, "add");
      }

      await sendNotification({
        userId: appointment.ownerId,
        userType: "owner",
        title: "Ακύρωση Ραντεβού",
        message: `Ο κτηνίατρος ${appointment.vetName} ακύρωσε το ραντεβού για ${appointment.petName} στις ${appointment.date} ${appointment.time}`,
        appointmentId: appointment.id
      });

      setBookings(prev => prev.map(b => b.id === appointment.id ? updatedAppointment : b));
    } catch (err) {
      console.error(err);
      alert("Σφάλμα κατά την ακύρωση του ραντεβού");
    }
  };

  const renderStatusText = (status) => {
    if (status === "pending") return "Περιμένει απάντηση από ιδιοκτήτη";
    if (status === "confirmed") return "Επιβεβαιωμένο";
    if (status === "rejected") return "Απορρίφθηκε";
    if (status === "cancelled") return "Ακυρώθηκε";
  };

  return (
    <div className="future-bookings">
      <h2>Μελλοντικά Ραντεβού Κτηνιάτρου</h2>
      <div className="bookings-list">
        {bookings.map(b => (
          <div key={b.id} className={`booking-card ${b.status}`}>
            <div className="booking-header" onClick={() => toggle(b.id)}>
              <div className="left">
                <div className="pet-name">{b.petName}</div>
                <div className="owner-name">Ιδιοκτήτης: {b.ownerName}</div>
              </div>
              <div className="right">
                <span className="time">🕒 {new Date(b.date).toLocaleDateString("el-GR")} • {b.time}</span>
                <span className={`status ${b.status}`}>{renderStatusText(b.status)}</span>
                <span className="action">{getMedicalActLabel(b.reason)}</span>
                <span className="arrow">{openId === b.id ? "▲" : "▼"}</span>
              </div>
            </div>
            {openId === b.id && (
              <div className="booking-body">
                <div className="info-grid">
                  <div><strong>Κατοικίδιο:</strong> {b.petName}</div>
                  <div><strong>Είδος:</strong> {b.petSpecies}</div>
                  <div><strong>Microchip:</strong> {b.petMicrochip}</div>
                  <div><strong>Ιδιοκτήτης:</strong> {b.ownerName}</div>
                  <div><strong>Email:</strong> {b.ownerEmail}</div>
                  <div><strong>Τηλέφωνο:</strong> {b.ownerPhone}</div>
                </div>
                {(b.status !== "cancelled") && (
                  <div className="vet-actions">
                    {b.status === "pending" && (
                      <>
                        <button className="confirm-btn" onClick={() => updateStatus(b, "confirmed")}>Επιβεβαίωση</button>
                        <button className="reject-btn" onClick={() => updateStatus(b, "rejected")}>Απόρριψη</button>
                      </>
                    )}
                    <button className="cancel-btn" onClick={() => cancelBooking(b)}>
                      {b.status === "pending" ? "Ακύρωση" : "Ακύρωση Επιβεβαιωμένου"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
