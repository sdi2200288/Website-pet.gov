import React, { useEffect, useState, useCallback } from "react";
import "./BookDate.css";
import { Link } from "react-router-dom";
import { 
  FiSearch, 
  FiCheck, 
  FiUser, 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiEdit2 
} from "react-icons/fi";
import BookDateImage from "../../images/BookDate.png";
import { REGIONS, VET_GENDERS, EDUCATION_OPTIONS, EXPERIENCE_OPTIONS, MEDICAL_ACTS } from "../Utils/Util";

export default function BookDate() {
  const [step, setStep] = useState(1);
  const [selectedVet, setSelectedVet] = useState(null);
  const [myPets, setMyPets] = useState([]);

  const [veterinarians, setVeterinarians] = useState([]);
  const [allVeterinarians, setAllVeterinarians] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
    
  const [selectedPet, setSelectedPet] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [description, setDescription] = useState("");

  const [availableDates, setAvailableDates] = useState([]);
  
  // Φίλτρα
  const [region, setRegion] = useState("");
  const [experience, setExperience] = useState("");
  const [date, setDate] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [education, setEducation] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [gender, setGender] = useState("");
  const [sortOrder, setSortOrder] = useState("ratingDesc");

  // Μοναδικές τιμές για τα φίλτρα
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [educationOptions, setEducationOptions] = useState([]);

  const applyFiltersAndSort = useCallback(() => {
    let result = [...allVeterinarians];
    
    if (region) result = result.filter(v => v.region === region);
    if (experience) {
      if (experience === "10+") {
        result = result.filter(v => v.experience >= 10);
      } else {
        const expNum = parseInt(experience);
        result = result.filter(v => v.experience === expNum);
      }
    }
    if (date) {
      result = result.filter(v => 
        v.availability && v.availability.some(avail => avail.date === date)
      );
    }
    if (specialization) result = result.filter(v => v.specialization === specialization);
    if (education) result = result.filter(v => v.education === education);
    if (gender) result = result.filter(v => v.gender === gender);
    
    // Φιλτράρισμα με βάση ώρα (μόνο αν έχει επιλεγεί ημερομηνία)
    if (date && (timeFrom || timeTo)) {
      result = result.filter(v => {
        const availability = v.availability.find(avail => avail.date === date);
        if (!availability) return false;
        
        if (timeFrom && availability.timeFrom < timeFrom) return false;
        if (timeTo && availability.timeTo > timeTo) return false;
        
        return true;
      });
    }
    
    // Ταξινόμηση
    if (sortOrder === "ratingDesc") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortOrder === "ratingAsc") {
      result.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
    } else if (sortOrder === "nameAsc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "nameDesc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "experienceDesc") {
      result.sort((a, b) => b.experience - a.experience);
    }
    
    setVeterinarians(result);
  }, [allVeterinarians, region, experience, date, specialization, education, gender, timeFrom, timeTo, sortOrder]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch("http://localhost:3001/pets")
        .then(res => res.json())
        .then(pets => {
        const userPets = pets.filter(
            pet => pet.ownerId === user.id
        );
        setMyPets(userPets);
        })
        .catch(err => console.error("Pets error:", err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Προσομοίωση δεδομένων κτηνιάτρων - θα αλλάξεις στο δικό σου API
        const res = await fetch("http://localhost:3001/vets");
        const vets = await res.json();

        // Εξαγωγή μοναδικών τιμών για τα φίλτρα από τη βάση
        const specializations = [...new Set(vets.map(vet => vet.specialization).filter(Boolean))];
        const educations = [...new Set(vets.map(vet => vet.education).filter(Boolean))];
        
        // Εξαγωγή διαθέσιμων ημερομηνιών από όλους τους κτηνιάτρους
        const dates = [];
        vets.forEach(vet => {
          if (vet.availability && Array.isArray(vet.availability)) {
            vet.availability.forEach(avail => {
              if (avail.date && !dates.includes(avail.date)) {
                dates.push(avail.date);
              }
            });
          }
        });
        
        // Ταξινόμηση ημερομηνιών
        dates.sort((a, b) => new Date(a) - new Date(b));
        
        setSpecializationOptions(specializations);
        setEducationOptions(educations);
        setAvailableDates(dates);
        
         // Μετατροπή δεδομένων για εμφάνιση
        const formattedVets = vets.map(vet => ({
          id: vet.id,
          name: `${vet.firstname} ${vet.lastname}`,
          region: vet.region || "Άγνωστη",
          rating: vet.totalScore && vet.reviewCount ? 
            (parseInt(vet.totalScore) / parseInt(vet.reviewCount)).toFixed(1) : "0.0",
          specialization: vet.specialization || "Γενικός",
          experience: vet.experience || 0,
          education: vet.education || "Πτυχίο",
          gender: vet.gender || "other",
          phone: vet.phone,
          email: vet.email,
          address: vet.address,
          availability: vet.availability || [],
          image: vet.image || "/default-vet.jpg",
          reviewCount: vet.reviewCount || 0
        }));

        setAllVeterinarians(formattedVets);
        setVeterinarians(formattedVets);
      } catch (err) {
        console.error("Σφάλμα φόρτωσης δεδομένων", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const clearFilters = () => {
    setRegion("");
    setExperience("");
    setDate("");
    setSpecialization("");
    setTimeFrom("");
    setEducation("");
    setTimeTo("");
    setGender("");
    setVeterinarians(allVeterinarians);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      applyFiltersAndSort();
      return;
    }
    
   const filtered = allVeterinarians.filter(v => 
      v.name.toLowerCase().includes(searchTerm) ||
      (v.region && v.region.toLowerCase().includes(searchTerm)) ||
      (v.specialization && v.specialization.toLowerCase().includes(searchTerm)) ||
      (v.address && v.address.toLowerCase().includes(searchTerm))
    );
    setVeterinarians(filtered);
  };

  const handleGoToPreview = () => {
    // Έλεγχος ότι όλα τα απαραίτητα πεδία είναι συμπληρωμένα
    if (!selectedPet) {
      alert("Παρακαλώ επιλέξτε κατοικίδιο");
      return;
    }
    if (!selectedDate) {
      alert("Παρακαλώ επιλέξτε ημερομηνία");
      return;
    }
    // if (!selectedTime) {
    //   alert("Παρακαλώ επιλέξτε ώρα");
    //   return;
    // }
    if (!visitReason) {
      alert("Παρακαλώ επιλέξτε λόγο επίσκεψης");
      return;
    }
    setStep(3);
  };

  const handleConfirmAppointment = () => {
    // Εδώ θα προσθέσεις τη λογική για την αποθήκευση του ραντεβού
    const appointmentData = {
      vetId: selectedVet.id,
      vetName: selectedVet.name,
      petId: selectedPet,
      date: selectedDate,
      time: selectedTime,
      reason: visitReason,
      description: description,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Αποστολή στο backend
    fetch("http://localhost:3001/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    })
      .then(response => response.json())
      .then(data => {
        alert("Το ραντεβού σας καταχωρήθηκε με επιτυχία!");
        // Επιστροφή στο αρχικό βήμα ή επαναφορά των πεδίων
        setStep(1);
        setSelectedVet(null);
        setSelectedPet("");
        setSelectedDate("");
        setSelectedTime("");
        setVisitReason("");
        setDescription("");
      })
      .catch(error => {
        console.error("Σφάλμα κατά την καταχώρηση ραντεβού:", error);
        alert("Υπήρξε ένα σφάλμα κατά την καταχώρηση του ραντεβού. Παρακαλώ δοκιμάστε ξανά.");
      });
  };

  function BookAppointmentStep({ vet, pets, onBack }) {
    if (!vet) return null;
    
    const selectedAvailability = vet.availability.find(a => a.date === selectedDate);
    const availableTimes = selectedAvailability?.times || [];

    return (
      <div className="appointment-wrapper">
        <h2>Κλείσιμο Ραντεβού</h2>
        
        <div className="vet-info-appointment">
          <img src={vet.image || "/default-vet.jpg"} alt={vet.name} />
          <div className="vet-details">
            <h4>{vet.name}</h4>
            <p><strong>Περιοχή:</strong> {vet.region}</p>
            <p><strong>Ειδίκευση:</strong> {vet.specialization}</p>
            <p><strong>Εμπειρία:</strong> {vet.experience} χρόνια</p>
          </div>
        </div>

        <div className="appointment-form">
          {/* ΚΑΤΟΙΚΙΔΙΟ */}
          <div className="form-group">
            <label>Κατοικίδιο (Microchip)</label>
            <select 
                required 
                value={selectedPet} 
                onChange={(e) => setSelectedPet(e.target.value)}
              >
                <option value="">Επιλέξτε κατοικίδιο</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} — {pet.microchip} ({pet.species})
                  </option>
                ))}
              </select>
          </div>

          {/* ΗΜΕΡΟΜΗΝΙΑ */}
          <div className="form-group">
            <label>Ημερομηνία Ραντεβού</label>
             <input
                type="date"
                required
                value={selectedDate}
                min={vet.availability[0]?.date}
                max={vet.availability[vet.availability.length - 1]?.date}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
              />
          </div>
          
          {/* ΩΡΑ */}
          <div className="form-group">
            <label>Ώρα Ραντεβού</label>
             <select
                required
                disabled={!selectedDate}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Επιλέξτε ώρα</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {!selectedDate && (
                <small className="hint">Επιλέξτε πρώτα ημερομηνία</small>
              )}
          </div>

          {/* ΛΟΓΟΣ ΕΠΙΣΚΕΨΗΣ */}
          <div className="form-group">
            <label>Λόγος επίσκεψης</label>
            <select 
                required 
                value={visitReason} 
                onChange={(e) => setVisitReason(e.target.value)}
              >
                <option value="">Επιλέξτε λόγο</option>
                {MEDICAL_ACTS.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.label}
                  </option>
                ))}
              </select>
          </div>

          {/* ΠΕΡΙΓΡΑΦΗ */}
          <div className="form-group full-width">
            <label>Σύντομη Περιγραφή (προαιρετικά)</label>
              <textarea 
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Περιγράψτε εν συντομία το πρόβλημα ή τον λόγο της επίσκεψης..."
              />
              <small className="hint">Μέγιστο 200 χαρακτήρες ({description.length}/200)</small>
          </div>

          {/* ΚΟΥΜΠΙΑ */}
          <div className="appointment-actions">
            <button className="secondary-btn" onClick={onBack}>
              Ακύρωση
            </button>
            <button className="primary-btn"  onClick={handleGoToPreview}>
              Προεπισκόπηση Ραντεβού 
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Βήμα 3: Προεπισκόπηση Ραντεβού
  function PreviewAppointmentStep({ vet, onBack, onEdit, onConfirm }) {
    if (!vet) return null;
    
    const selectedPetObj = myPets.find(pet => pet.id.toString() === selectedPet);
    const medicalAct = MEDICAL_ACTS.find(act => act.id === visitReason);
    
    // Μορφοποίηση ημερομηνίας
    const formattedDate = selectedDate ? new Date(selectedDate).toLocaleDateString('el-GR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : "";

    return (
      <div className="appointment-wrapper">
        <h2>Προεπισκόπηση Ραντεβού</h2>
        
        <div className="appointment-summary">
          <div className="summary-header">
            <FiCheck className="summary-icon" />
            <h3>Σύνοψη Ραντεβού</h3>
            <p className="summary-subtitle">Ελέγξτε τις λεπτομέρειες του ραντεβού σας</p>
          </div>
          
          <div className="summary-grid">
            {/* Κτηνίατρος */}
            <div className="summary-card">
              <div className="summary-card-header">
                <FiUser className="card-icon" />
                <h4>Κτηνίατρος</h4>
              </div>
              <div className="summary-card-content">
                <img src={vet.image || "/default-vet.jpg"} alt={vet.name} className="vet-preview-img" />
                <div className="vet-preview-info">
                  <h5>{vet.name}</h5>
                  <p><FiMapPin /> {vet.region}</p>
                  <p>Ειδίκευση: {vet.specialization}</p>
                  <p>Εμπειρία: {vet.experience} χρόνια</p>
                </div>
              </div>
            </div>

            {/* Κατοικίδιο */}
            <div className="summary-card">
              <div className="summary-card-header">
                <FiUser className="card-icon" />
                <h4>Κατοικίδιο</h4>
              </div>
              <div className="summary-card-content">
                {selectedPetObj ? (
                  <>
                    <h5>{selectedPetObj.name}</h5>
                    <p>Είδος: {selectedPetObj.species}</p>
                    <p>Φύλο: {selectedPetObj.gender}</p>
                    <p>Microchip: {selectedPetObj.microchip}</p>
                  </>
                ) : (
                  <p>Δεν έχει επιλεγεί κατοικίδιο</p>
                )}
              </div>
            </div>

            {/* Ημερομηνία & Ώρα */}
            <div className="summary-card">
              <div className="summary-card-header">
                <FiCalendar className="card-icon" />
                <h4>Ημερομηνία & Ώρα</h4>
              </div>
              <div className="summary-card-content">
                <div className="datetime-preview">
                  <FiCalendar className="datetime-icon" />
                  <div>
                    <p className="datetime-label">Ημερομηνία</p>
                    <p className="datetime-value">{formattedDate}</p>
                  </div>
                </div>
                <div className="datetime-preview">
                  <FiClock className="datetime-icon" />
                  <div>
                    <p className="datetime-label">Ώρα</p>
                    <p className="datetime-value">{selectedTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Λόγος Επίσκεψης */}
            <div className="summary-card">
              <div className="summary-card-header">
                <FiCheck className="card-icon" />
                <h4>Λόγος Επίσκεψης</h4>
              </div>
              <div className="summary-card-content">
                <p className="reason-label">{medicalAct ? medicalAct.label : "Δεν έχει επιλεγεί λόγος"}</p>
                {description && (
                  <>
                    <p className="description-label">Περιγραφή:</p>
                    <p className="description-text">{description}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ΚΟΥΜΠΙΑ */}
        <div className="appointment-actions preview-actions">
          <button className="edit-btn" onClick={onEdit}>
            <FiEdit2 /> Επεξεργασία
          </button>
          <div className="preview-action-buttons">
            <button className="cancel-btn" onClick={onBack}>
              Ακύρωση
            </button>
            <button className="confirm-btn" onClick={onConfirm}>
              Επιβεβαίωση Ραντεβού
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="BookDate">
    {step === 1 && (
    <>
      <section className="hero-section">
        <div className="hero-image-container">
          <img src={BookDateImage} alt="Βρείτε τον Ιδανικό Κτηνίατρο" className="main-image" />
          <div className="hero-filters-card">
            <div className="hero-filters-row">
              <div className="filter-field">
                <label>Περιοχή (Νομός)</label>
                <select value={region} className={region ? "filtered" : ""} onChange={(e) => setRegion(e.target.value)}>
                  <option value="">Όλες οι περιοχές</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="filter-field">
                <label>Εμπειρία</label>
                <select value={experience} className={experience ? "filtered" : ""} onChange={(e) => setExperience(e.target.value)}>
                  <option value="">Οποιαδήποτε</option>
                  {EXPERIENCE_OPTIONS.map((exp) => (
                    <option key={exp} value={exp}>{exp} {exp === "10+" ? "χρόνια+" : "χρόνια"}</option>
                  ))}
                </select>
              </div>
              <div className="filter-field">
                <label>Ημερομηνία</label>
                <select value={date} className={date ? "filtered" : ""} onChange={(e) => setDate(e.target.value)}>
                  <option value="">Οποιαδήποτε</option>
                  {availableDates.map((d) => (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString('el-GR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-field">
                <label>Ειδίκευση</label>
                <select value={specialization} className={specialization ? "filtered" : ""} onChange={(e) => setSpecialization(e.target.value)}>
                  <option value="">Οποιαδήποτε</option>
                  {specializationOptions.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="hero-filters-row">
              <div className="filter-field">
                <label>Ώρα από</label>
                <input 
                  type="time" 
                  value={timeFrom} 
                  className={timeFrom ? "filtered" : ""}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  disabled={!date}
                />
              </div>
              <div className="filter-field">
                <label>Επίπεδο σπουδών</label>
                <select value={education} className={education ? "filtered" : ""} onChange={(e) => setEducation(e.target.value)}>
                  <option value="">Οποιοδήποτε</option>
                  {educationOptions.map((edu) => (
                    <option key={edu} value={edu}>{edu}</option>
                  ))}
                </select>
              </div>
              <div className="filter-field">
                <label>Ώρα έως</label>
                <input 
                  type="time" 
                  value={timeTo} 
                  className={timeTo ? "filtered" : ""}
                  onChange={(e) => setTimeTo(e.target.value)}
                  disabled={!date}
                />
              </div>
              <div className="filter-field">
                <label>Φύλο</label>
                <select value={gender} className={gender ? "filtered" : ""} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Οποιοδήποτε</option>
                  {VET_GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="hero-actions-wrapper">
              <div className="hero-buttons hero-buttons-center">
                <button type="button" className="secondary-btn" onClick={clearFilters}>
                  Καθαρισμός φίλτρων
                </button>
                <button type="button" className="primary-btn" onClick={applyFiltersAndSort}>
                  Εφαρμογή φίλτρων
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="breadcrumb">
        <Link to="/">Αρχική /</Link>
        <span> Βρείτε Κτηνίατρο</span>
      </nav>

      <section className="results-section">
        <div className="results-header">
          <div className="results-left">
            <label>Ταξινόμηση</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="ratingDesc">Αξιολόγηση (Υψηλότερη)</option>
              <option value="ratingAsc">Αξιολόγηση (Χαμηλότερη)</option>
              <option value="nameAsc">Ονοματεπώνυμο (Α-Ω)</option>
              <option value="nameDesc">Ονοματεπώνυμο (Ω-Α)</option>
            </select>
          </div>

          <div className="results-center">
            <h2>Αποτελέσματα ({veterinarians.length})</h2>
          </div>

          <div className="results-right">
            <div className="hero-search">
              <input
                type="text"
                placeholder="Αναζήτηση κτηνίατρου..."
                className="hero-input"
                onChange={handleSearch}
              />
              <button className="hero-button" aria-label="Αναζήτηση">
                <FiSearch size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="veterinarians-grid">
          {veterinarians.length === 0 ? (
            <p className="empty-message">Δεν βρέθηκαν κτηνίατροι με τα τρέχοντα κριτήρια.</p>
          ) : (
            veterinarians.map((vet) => (
              <div className="veterinarian-card" key={vet.id}>
                <div className="vet-card-content">
                  <div className="vet-image">
                    <img src={vet.image} alt={vet.name} onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-vet.jpg";
                    }} />
                  </div>
                  <div className="vet-info">
                    <h3>{vet.name}</h3>
                    <p><strong>Περιοχή:</strong> {vet.region}</p>
                    <p><strong>Ειδίκευση:</strong> {vet.specialization}</p>
                    <p><strong>Εμπειρία:</strong> {vet.experience} χρόνια</p>
                    <p><strong>Βαθμολογία:</strong> ⭐ {vet.rating} ({vet.reviewCount || 0} αξιολογήσεις)</p>
                    <button className="book-btn"  onClick={() => {
                        setSelectedVet(vet);
                        setStep(2);
                    }}>Κλείστε Ραντεβού</button>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </section>
    </>
    )}
    {step === 2 && (
        <>
        <nav className="breadcrumb">
        <Link to="/">Αρχική</Link> / 
        <Link to="#" onClick={() => setStep(1)}> Κτηνίατροι</Link> / 
        <span> Κλείσιμο Ραντεβού</span>
        </nav>
        
        <div className="appointment-container">
        <BookAppointmentStep
            vet={selectedVet}
            pets={myPets}
            onBack={() => setStep(1)}
        />
        </div>
        </>
    )}
    {step === 3 && (
        <>
          <nav className="breadcrumb">
            <Link to="/">Αρχική</Link> / 
            <Link to="#" onClick={() => setStep(1)}> Κτηνίατροι</Link> / 
            <Link to="#" onClick={() => setStep(2)}> Κλείσιμο Ραντεβού</Link> / 
            <span> Προεπισκόπηση</span>
          </nav>
          
          <div className="appointment-container">
            <PreviewAppointmentStep
              vet={selectedVet}
              onBack={() => setStep(1)}
              onEdit={() => setStep(2)}
              onConfirm={handleConfirmAppointment}
            />
          </div>
        </>
      )}
    </div>
  );
}