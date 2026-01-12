import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useParams } from "react-router-dom";
import { DAYS, buildEnabledServicesByCategory, Stars, } from "../Utils/Util";
import VetInfo from "../../components/Vet/VetInfo";
import VetPrices from "../../components/Vet/VetPrices";
import VetReview from "../../components/Vet/VetReview";

export default function BookProfile() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("info");
    const [vet, setVet] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingVet, setLoadingVet] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoadingVet(true);
                const vetRes = await fetch(`http://localhost:3001/vets/${encodeURIComponent(id)}`);
                if (!vetRes.ok) {
                    setVet(null);
                    setReviews([]);
                    return;
                }
                const v = await vetRes.json();
                setVet(v);
                try {
                    const revRes = await fetch(`http://localhost:3001/reviews?vetId=${encodeURIComponent(id)}`);
                    const revData = await revRes.json();
                    const arr = Array.isArray(revData) ? revData : [];
                    const ownerIds = [...new Set(arr.map((r) => r.ownerId).filter(Boolean))];
                    const owners = await Promise.all(
                        ownerIds.map(async (oid) => {
                            const oRes = await fetch(`http://localhost:3001/owners/${encodeURIComponent(oid)}`);
                            if (!oRes.ok) return null;
                            return await oRes.json();
                        })
                    );
                    const ownersById = {};
                    owners.forEach((o) => {
                        if (o && o.id) ownersById[o.id] = o;
                    });
                    setReviews(
                        arr.map((r) => ({
                            ...r,
                            authorName: ownersById[r.ownerId]
                                ? `${ownersById[r.ownerId].firstname || ""} ${ownersById[r.ownerId].lastname || ""}`.trim()
                                : "Χρήστης",
                        }))
                    );
                } catch {
                    setReviews([]);
                }
            } catch (err) {
                console.error("BookProfile fetch error:", err);
                setVet(null);
                setReviews([]);
            } finally {
                setLoadingVet(false);
            }
        })();
    }, [id]);

    if (loadingVet) {
        return (
            <div className="owner-profile">
                <div className="profile-card">
                    <p>Φόρτωση...</p>
                </div>
            </div>
        );
    }

    if (!vet) {
        return (
            <div className="owner-profile">
                <div className="profile-card">
                    <h2>Δεν βρέθηκε κτηνίατρος</h2>
                    <p style={{ opacity: 0.8 }}> ID από route: <strong>{id}</strong> </p>
                    <div className="profile-actions">
                        <Link className="secondary-btn" to="/owner-dashboard/homepage">
                            Επιστροφή
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const fullName = `${vet.firstname || ""} ${vet.lastname || ""}`.trim();
    const specializationText = Array.isArray(vet.specializations) && vet.specializations.length > 0 ? vet.specializations.join(", ") : (vet.specializations || "—");
    const studyLevelText = vet.studyLevel || vet.education || "—";

    const experienceText = Number(vet.experience ?? 0);
    const experienceYears = Number.isFinite(experienceText) ? experienceText : 0;
    const profileImage = (typeof vet.photoFile === "string" && vet.photoFile.trim() !== "") ? vet.photoFile : (typeof vet.image === "string" && vet.image.trim() !== "") ? vet.image : "/default.jpg";

    const schedule = vet.schedule || {};
    const formatHours = (d) => {
        if (!d || !d.enabled) return "   Κλειστό";
        if (!d.from || !d.to) return " — ";
        return `   ${d.from} - ${d.to}`;
    };

    const enabledServicesByCategory = buildEnabledServicesByCategory(vet || {});

    const reviewCount = Number(vet.reviewCount || 0);
    const totalScore = Number(vet.totalScore || 0);
    const avgRating = reviewCount > 0 ? totalScore / reviewCount : 0;

    return (
        <div className="owner-profile">
            <div className="profile-card profile-card-top">
                <div className="vet-top">
                    <div className="vet-top-left">
                        <div className="vet-avatar"> <img src={profileImage} alt="Φωτογραφία κτηνιάτρου" /> </div>
                        <div className="vet-identity">
                            <div className="vet-name">{fullName || "—"}</div>

                            <div className="vet-subtitle" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Stars value={avgRating} />
                                <span style={{ fontWeight: 800 }}>
                                    {avgRating.toFixed(1)} ({reviewCount})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="vet-top-actions">
                        <Link className="primary-btn" to={`/owner-dashboard/book-date?vetId=${vet.id}`}>
                            Κλείστε Ραντεβού
                        </Link>
                    </div>
                </div>
            </div>
            <div className="vet-tabs">
                <button className={`vet-tab ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")} type="button">Βιογραφικό</button>
                <button className={`vet-tab ${activeTab === "prices" ? "active" : ""}`} onClick={() => setActiveTab("prices")} type="button">Τιμοκατάλογος-Ωράριο</button>
                <button className={`vet-tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")} type="button">Αξιολογήσεις</button>
            </div>
            <div className="profile-card vet-tab-card">
                {activeTab === "info" && (<VetInfo user={vet} vet={vet} days={DAYS} enabledServicesByCategory={enabledServicesByCategory} />)}
                {activeTab === "prices" && (<VetPrices vet={vet} schedule={schedule} days={DAYS} formatHours={formatHours} enabledServicesByCategory={enabledServicesByCategory} />)}
                {activeTab === "reviews" && (<VetReview reviews={reviews} avgRating={avgRating} reviewCount={reviewCount} Stars={Stars} />)}
            </div>
        </div>
    );
}
