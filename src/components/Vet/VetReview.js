import React from "react";
import "./VetReview.css";

export default function VetReviews({ reviews, avgRating, reviewCount, Stars }) {
  return (
    <div className="vet-reviews">
      <div className="reviews-header">
        <div className="reviews-summary">
          <Stars value={avgRating} />
          <div className="reviews-summary-text">
            <div className="reviews-score">
              {avgRating ? avgRating.toFixed(1) : ""}
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
            <div key={r.id ?? `${r.author}-${r.date}-${r.stars}`} className="review-card">
              <div className="review-card-top">
                <div className="review-author">{r.author}</div>
                <div className="review-date">{r.date}</div>
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
