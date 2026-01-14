// VetReview.js
import React from "react";
import "./VetReview.css";

export default function VetReviews({ reviews = [], Stars }) {
  // Υπολόγισε τα στατιστικά από τα reviews
  const reviewCount = reviews.length;
  const totalScore = reviews.reduce((sum, r) => sum + Number(r.stars), 0);
  const avgRating = reviewCount > 0 ? (totalScore / reviewCount).toFixed(1) : "0.0";

  return (
    <div className="vet-reviews">
      <div className="reviews-header">
        <div className="reviews-summary">
          <Stars value={Number(avgRating)} />
          <div className="reviews-summary-text">
            <div className="reviews-score">
              {avgRating}
            </div>
            <div className="muted">{reviewCount} Αξιολογήσεις</div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p>Δεν υπάρχουν αξιολογήσεις ακόμα.</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id ?? `${r.ownerId}-${r.createdAt}`} className="review-card">
              <div className="review-card-top">
                <div className="review-author">{r.author}</div>
                <div className="review-date">
                  {new Date(r.createdAt).toLocaleDateString("el-GR")}
                </div>
              </div>

              <div className="review-stars">
                <Stars value={Number(r.stars)} />
              </div>

              <div className="review-text">{r.text || ""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}