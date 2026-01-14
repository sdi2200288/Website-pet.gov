import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Availability.css";

export default function Availability() {
    const user = JSON.parse(localStorage.getItem("user"));
    const vetId = user?.id;

    const [availability, setAvailability] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [vetSchedule, setVetSchedule] = useState(null);
    const [appointmentDuration, setAppointmentDuration] = useState(30); // Διάρκεια ραντεβού

    const [startDate, setStartDate] = useState("");
    const [times, setTimes] = useState([]); // Επιλεγμένες ώρες για τη νέα διαθεσιμότητα

    // Φόρτωση availability + schedule
    useEffect(() => {
        if (!vetId) return;

        fetch(`http://localhost:3001/vets/${vetId}`)
            .then((res) => res.json())
            .then((data) => {
                setAvailability(data.availability || []);
                setVetSchedule(data.schedule);
            });
    }, [vetId]);

    // Διαγραφή διαθεσιμότητας
    const deleteAvailability = async (dateToDelete) => {
        const updatedAvailability = availability.filter(
            (slot) => slot.date !== dateToDelete
        );

        await fetch(`http://localhost:3001/vets/${vetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availability: updatedAvailability }),
        });

        setAvailability(updatedAvailability);
        setSelectedDate(null);
    };

    // Helper για format ημερομηνίας
    const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

    const availableDates = availability.map((a) => a.date);

    // Δημιουργία ωρών με βάση from-to & duration
    const generateTimeSlots = (from, to, duration) => {
        const slots = [];
        const [fromHour, fromMinute] = from.split(":").map(Number);
        const [toHour, toMinute] = to.split(":").map(Number);

        let currentHour = fromHour;
        let currentMinute = fromMinute;

        while (
            currentHour < toHour ||
            (currentHour === toHour && currentMinute < toMinute)
        ) {
            const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute
                .toString()
                .padStart(2, "0")}`;
            slots.push(timeStr);

            currentMinute += duration;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }

        return slots;
    };

    // Λήψη διαθέσιμων ωρών για συγκεκριμένη ημερομηνία από schedule
    const getAvailableTimesForDate = (dateStr) => {
        if (!vetSchedule) return [];

        const dayMapping = {
            0: "sun", 1: "mon", 2: "tue", 3: "wed",
            4: "thu", 5: "fri", 6: "sat",
        };

        const dayOfWeek = dayMapping[new Date(dateStr).getDay()];
        const daySchedule = vetSchedule[dayOfWeek];

        if (!daySchedule?.enabled) return [];

        return generateTimeSlots(daySchedule.from, daySchedule.to, appointmentDuration);
    };

    // Αποθήκευση νέας διαθεσιμότητας
    const handleAddAvailability = async () => {
        if (!startDate || times.length === 0) {
            alert("Παρακαλώ επιλέξτε ημερομηνία και ώρες");
            return;
        }

        const newDay = { date: startDate, times };

        const updatedAvailability = [...availability];
        const existingIndex = updatedAvailability.findIndex(a => a.date === startDate);
        if (existingIndex >= 0) {
            updatedAvailability[existingIndex] = newDay;
        } else {
            updatedAvailability.push(newDay);
        }

        await fetch(`http://localhost:3001/vets/${vetId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ availability: updatedAvailability }),
        });

        setAvailability(updatedAvailability);
        setStartDate("");
        setTimes([]);
        setShowForm(false);
    };

    return (
        <div className="availability-page">
            <div className="availability-header">
                <h1>Διαχείριση Διαθεσιμότητας</h1>
                <p>Επιλέξτε ημερομηνία και ώρες με βάση το ωράριο σας</p>
            </div>

            {/* Calendar */}
            <div className="calendar-section">
                <p>Οι χρωματισμένες ημερομηνίες είναι ήδη διαθέσιμες</p>
                <Calendar
                    onClickDay={(value) => {
                        const formatted = formatDate(value);
                        // Αν η ημερομηνία είναι ήδη επιλεγμένη, την αποεπιλέγουμε
                        if (selectedDate === formatted) {
                            setSelectedDate(null);
                        } else if (availableDates.includes(formatted)) {
                            setSelectedDate(formatted);
                        } else {
                            setSelectedDate(null);
                        }
                    }}
                    tileDisabled={({ date }) => !availableDates.includes(formatDate(date))}
                    tileClassName={({ date }) => {
                        const formatted = formatDate(date);
                        return availableDates.includes(formatted) ? "available-day" : null;
                    }}
                />

            </div>

            {/* Selected date */}
            {selectedDate && (
                <div className="selected-date">
                    <div className="date-header">
                        <h3>Διαθέσιμες ώρες για {selectedDate}</h3>
                        <button
                            className="delete-btn"
                            onClick={() => deleteAvailability(selectedDate)}
                        >
                            Διαγραφή ημέρας
                        </button>
                    </div>
                    <div className="time-slots">
                        {availability
                            .find((a) => a.date === selectedDate)
                            ?.times.map((time) => (
                                <span key={time} className="time-chip">{time}</span>
                            ))}
                    </div>
                </div>
            )}

            {/* Add availability */}
            <button
                className="add-availability-btn"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Ακύρωση" : "Προσθήκη Διαθεσιμότητας"}
            </button>

            {/* Form */}
            {showForm && (
                <div className="availability-form">
                    <h3>Προσθήκη Διαθεσιμότητας</h3>

                    <div className="form-group">
                        <label>Ημερομηνία:</label>
                        <input
                            type="date"
                            value={startDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    {startDate && (
                        <div className="form-group">
                            <label>Ώρες (σύμφωνα με ωράριο)</label>
                            <div className="time-options">
                                {getAvailableTimesForDate(startDate).map((time) => (
                                    <label key={time} className="time-checkbox">
                                        <input
                                            type="checkbox"
                                            value={time}
                                            checked={times.includes(time)}
                                            onChange={(e) => {
                                                if (e.target.checked) setTimes([...times, time]);
                                                else setTimes(times.filter(t => t !== time));
                                            }}
                                        />
                                        {time}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={handleAddAvailability}>Αποθήκευση</button>
                </div>
            )}
        </div>
    );
}
