// src/Utils/bookingUtils.js
export const updateVetAvailability = async (vetId, date, time, action) => {
  const res = await fetch(`http://localhost:3001/vets/${vetId}`);
  const vet = await res.json();
  const updatedAvailability = vet.availability.map(d => {
    if (d.date !== date) return d;
    let times = d.times || [];
    if (action === "remove") times = times.filter(t => t !== time);
    if (action === "add" && !times.includes(time)) times = [...times, time].sort();
    return { ...d, times };
  });
  await fetch(`http://localhost:3001/vets/${vetId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability: updatedAvailability })
  });
};

export const sendNotification = async ({ userId, userType, title, message, appointmentId }) => {
  // Αποφυγή διπλών notifications
  const existingRes = await fetch(`http://localhost:3001/notifications?userId=${userId}&appointmentId=${appointmentId}&title=${title}`);
  const existing = await existingRes.json();
  if (existing.length > 0) return;

  await fetch('http://localhost:3001/notifications', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      userType,
      title,
      message,
      appointmentId,
      read: false,
      createdAt: new Date().toISOString()
    })
  });
};
