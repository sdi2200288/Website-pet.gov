import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "./Evaluation.css";

export default function Evaluation() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = location.state?.appointmentId;
  const [vet, setVet] = useState(null);
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState(null);

  const ratingToStars = {
    "very bad": 0,
    "bad": 1,
    "okey": 2,
    "medium": 3,
    "great": 4,
    "excellent": 5
  };


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
  }, [vetId, location.state]);

  const checkIfReviewed = async () => {
    const res = await fetch(
      `http://localhost:3001/reviews?appointmentId=${appointmentId}`
    );
    const data = await res.json();
    return Array.isArray(data) && data.length > 0;
  };
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
        appointmentId: appointmentId,
        stars: ratingToStars[rating],
        text: comments,
        createdAt: new Date().toISOString()
      };

      if (await checkIfReviewed()) {
        alert("Έχετε ήδη αξιολογήσει αυτό το ραντεβού.");
        navigate(-1);
        return;
      }

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
      reviewCount: String(Number(vet.reviewCount || "0") + 1),
      totalScore: String(Number(vet.totalScore || "0") + ratingToStars[rating])
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
      <div className="review-container">
        {/* Καρτέλα Κτηνίατρου */}
        <div className="vet-card-review">
          <div className="vet-header">
            <h1>{vet.firstname || "Όνομα Κτηνίατρου"}</h1>
            <div className="contact-item">
              <span className="contact-value">{vet.firstname} {vet.lastname}</span>
            </div>
            <p className="vet-specialty">{vet.specializations || "-"}</p>
          </div>

          <div className="vet-contact-info">
            <div className="contact-item">
              <span className="contact-label">Τηλέφωνο:</span>
              <span className="contact-value">{vet.phone || "-"}</span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Διεύθυνση:</span>
              <span className="contact-value">{vet.address || "-"}</span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <span className="contact-value">{vet.email || "-"}</span>
            </div>
          </div>
        </div>

        {/* Φόρμα Αξιολόγησης */}
        <div className="review-form-section">
          <h2>Γράψτε την κριτική σας</h2>
          <p className="review-subtitle">
            Η γνώμη σας έχει σημασία! Μοιραστείτε μας την εμπειρία σας από
            την επίσκεψή σας στην κτηνίατρο {vet.firstname} {vet.lastname}.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="rating-section">
              <p className="rating-label">Βαθμολογία:</p>
              <div className="rating-buttons">
                <button
                  type="button"
                  className={`rating-btn ${rating === 'very bad' ? 'selected' : ''}`}
                  onClick={() => setRating('very bad')}
                >
                  0
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'bad' ? 'selected' : ''}`}
                  onClick={() => setRating('bad')}
                >
                  1
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'okey' ? 'selected' : ''}`}
                  onClick={() => setRating('okey')}
                >
                  2
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'medium' ? 'selected' : ''}`}
                  onClick={() => setRating('medium')}
                >
                  3
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'great' ? 'selected' : ''}`}
                  onClick={() => setRating('great')}
                >
                  4
                </button>
                <button
                  type="button"
                  className={`rating-btn ${rating === 'excellent' ? 'selected' : ''}`}
                  onClick={() => setRating('excellent')}
                >
                  5
                </button>
              </div>
            </div>

            <div className="comments-section">
              <label htmlFor="comments">Σχόλια: (Προαιρετικά)</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Γράψτε τα σχόλιά σας εδώ..."
                rows="6"
              />
            </div>

            <div className="form-buttons">
              <button type="button" className="cancel-btn" onClick={handleCancel} >  Ακύρωση</button>
              {/* <button type="button" className="submit-btn" onClick={handleSubmit} > Οριστική Υποβολή  </button> */}
              <button type="submit" className="submit-btn">
                Οριστική Υποβολή
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}