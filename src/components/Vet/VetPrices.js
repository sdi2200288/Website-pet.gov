import React from "react";
import "./VetPrices.css";

export default function VetPrices({ schedule, days, formatHours, enabledServicesByCategory }) {
    return (
        <>
            <div className="vet-schedule">
                <h4 className="price-col-title">Ωράριο λειτουργίας</h4>

                {!schedule || Object.keys(schedule).length === 0 ? (
                    <p>Δεν έχει οριστεί ωράριο.</p>
                ) : (
                    <div className="schedule-grid">
                        {days.map((day) => {
                            const d = schedule?.[day.id];
                            return (
                                <div key={day.id} className={`schedule-row ${d?.enabled ? "open" : "closed"}`}>
                                    <span className="schedule-day">{day.label}</span>
                                    <span className="schedule-hours">{formatHours(d)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="vet-prices">
                {enabledServicesByCategory.length === 0 ? (
                    <p className="muted">Δεν έχει οριστεί τιμοκατάλογος.</p>
                ) : (
                    <div className="prices-grid">
                        {enabledServicesByCategory.map((cat) => (
                            <div key={cat.id} className="price-col">
                                <h4 className="price-col-title">{cat.title}</h4>
                                <div className="price-items">
                                    {cat.enabledItems.map((it) => (
                                        <div key={it.id} className="price-item">
                                            <span className="price-item-name">{it.label}</span>
                                            <span className="price-item-price"> {it.price ? `${it.price}€` : "-"} </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
