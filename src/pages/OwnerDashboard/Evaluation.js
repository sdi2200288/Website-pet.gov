import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "./Evaluation.css";

export default function Evaluation() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [vet, setVet] = useState(null);
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);
    
  const searchParams = new URLSearchParams(location.search);
  const vetIdFromParams = searchParams.get("vetId");

  useEffect(() => {
     if (location.state) {
      setAppointmentData(location.state);
    }
    const fetchVetData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/vets/${vetId}`);
        if (!response.ok) throw new Error("Δεν βρέθηκε ο κτηνίατρος");
        const data = await response.json();
        setVet(data);
      } catch (error) {
        console.error("Σφάλμα:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVetData();
  },  [vetId, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      alert("Παρακαλώ επιλέξτε βαθμολογία");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Πρέπει να είστε συνδεδεμένοι για να υποβάλετε αξιολόγηση");
        navigate("/login");
        return;
      }

      const reviewData = {
        vetId: vetId,
        ownerId: user.id,
        rating: rating,
        comments: comments,
        date: new Date().toISOString()
      };

      // 1. Αποθήκευση αξιολόγησης
      const reviewResponse = await fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
      });

      if (!reviewResponse.ok) throw new Error("Αποτυχία υποβολής αξιολόγησης");

      // 2. Ενημέρωση στατιστικών του κτηνίατρου
      const updatedVet = {
        ...vet,
        reviewCount: vet.reviewCount + 1,
        totalScore: vet.totalScore + (rating === "good" ? 5 : 1) // Υποθέτουμε 5 για Δριστή, 1 για Κακή
      };

      await fetch(`http://localhost:3001/vets/${vetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedVet)
      });

      alert("Η αξιολόγησή σας υποβλήθηκε επιτυχώς!");
      navigate(`/vet-profile/${vetId}`);
      
    } catch (error) {
      console.error("Σφάλμα:", error);
      alert("Υπήρξε σφάλμα κατά την υποβολή της αξιολόγησης");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Είστε βέβαιοι ότι θέλετε να ακυρώσετε; Οι αλλαγές δεν θα αποθηκευτούν.")) {
      navigate(-1); // Πίσω στην προηγούμενη σελίδα
    }
  };

  if (loading) {
    return <div className="loading">Φόρτωση...</div>;
  }

  if (!vet) {
    return <div className="error">Δεν βρέθηκε ο κτηνίατρος</div>;
  }

  return (
    <div className="review-page">
      {/* Breadcrumbs */}
      {/* <nav className="breadcrumbs">
        <Link to="/">Αρχική</Link> / 
        <Link to="/owner-dashboard">Ιδιοκτήτης</Link> / 
        <Link to="/owner-dashboard/history-bookings-owner">Ιστορικό Ραντεβού</Link> / 
        <span>Αξιολόγηση {appointmentData?.vetName ? `- ${appointmentData.vetName}` : ''}</span>
      </nav> */}

      <div className="review-container">
        {/* Καρτέλα Κτηνίατρου */}
        <div className="vet-card-review">
          <div className="vet-header">
            <h1>{vet.Name || "Όνομα Κτηνίατρου"}</h1>
            <p className="vet-specialty">{vet.specialization || "Χειρουργός Μεγάλων Ζώων"}</p>
          </div>
          
          <div className="vet-contact-info">
            <div className="contact-item">
              <span className="contact-label">Τηλέφωνο:</span>
              <span className="contact-value">{vet.phone || "210 3213 457"}</span>
            </div>
            
            <div className="contact-item">
              <span className="contact-label">Διεύθυνση:</span>
              <span className="contact-value">{vet.address || "Καποδίστρια 7, Σεπάλια Αττικής"}</span>
            </div>
            
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{vet.email || "eleni_tontou@gmail.com"}</span>
            </div>
          </div>
        </div>

        {/* Φόρμα Αξιολόγησης */}
        <div className="review-form-section">
          <h2>Γράψτε την κριτική σας</h2>
          <p className="review-subtitle">
            Η γνώμη σας έχει σημασία! Μοιραστείτε μας την εμπειρία σας από 
            την επίσκεψή σας στην κτηγίατρο {vet.name}.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <p className="rating-label">Βαθμολογία:</p>
              <div className="rating-buttons">
                <button
                  type="button"
                  className={`rating-btn ${rating === 'bad' ? 'selected' : ''}`}
                  onClick={() => setRating('bad')}
                >
                  Κακή
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'good' ? 'selected' : ''}`}
                  onClick={() => setRating('good')}
                >
                  Δριστή
                </button>
              </div>
            </div>

            <div className="comments-section">
              <label htmlFor="comments">Σχόλια:</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Γράψτε τα σχόλιά σας εδώ..."
                rows="6"
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Ακύρωση
              </button>
              <button
                type="submit"
                className="submit-btn"
              >
                Οριστική Υποβολή
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer με βοήθεια */}
      <div className="help-section">
        <p><strong>Χρειάζεστε βοήθεια;</strong></p>
        <div className="help-links">
          <div className="help-column">
            <Link to="/terms">Όροι Χρήσης</Link>
            <Link to="/about">Σχετικά με εμάς</Link>
            <Link to="/contact">Επικοινωνήστε με εμάς</Link>
          </div>
          <div className="help-column">
            <Link to="/faq">FAQ</Link>
            <Link to="/privacy">Πολιτική Απορρήτου</Link>
            <Link to="/terms-en">Terms & Conditions</Link>
          </div>
          <div className="help-column">
            <span>Συχνές Ερωτήσεις για Κτηγίατρους</span>
            <span>Συχνές Ερωτήσεις για Ιδιοκτήτες</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
}{}