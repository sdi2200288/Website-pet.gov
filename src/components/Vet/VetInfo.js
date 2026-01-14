import React from "react";
import "./VetInfo.css";

export default function VetInfo({ user }) {
    if (!user) return null;
    return (
        <div className="vet-info-grid">
            <div className="vet-info-block">
                <h3>Προσωπικά στοιχεία</h3>
                <ul>
                    <li className="profile-row"><span>Όνομα</span><p>{user.firstname}</p></li>
                    <li className="profile-row"><span>Επώνυμο</span><p>{user.lastname}</p></li>
                    <li className="profile-row"><span>Φύλο</span><p>{user.gender}</p></li>
                    <li className="profile-row"><span>ΑΦΜ</span><p>{user.afm}</p></li>
                    <li className="profile-row"><span>Ημερομηνία γέννησης</span><p>{user.birthdate}</p></li>
                </ul>
            </div>

            <div className="vet-info-block">
                <h3>Στοιχεία επικοινωνίας</h3>
                <ul>
                    <li className="profile-row"><span>Διεύθυνση</span><p>{user.address}</p></li>
                    <li className="profile-row"><span>Τηλέφωνο</span><p>{user.phone}</p></li>
                    <li className="profile-row"><span>Email</span><p>{user.email}</p></li>
                    {user.region && (<li className="profile-row"><span>Περιοχή</span><p>{user.region}</p></li>)}
                </ul>
            </div>

            <div className="vet-info-block vet-info-wide">
                <h3>Εκπαίδευση και επαγγελματικά προσόντα</h3>
                <ul>
                    <li className="profile-row"><span>Επίπεδο σπουδών</span><p>{user.studyLevel || "-"}</p></li>
                    <li className="profile-row">
                        <span>Εμπειρία</span> <p>{user.experience !== "" && user.experience != null ? `${user.experience} έτη` : "-"}</p>
                    </li>
                    <li className="profile-row">
                        <span>Ειδίκευση</span><p>{(user.specializations && user.specializations.join(", ")) || "-"}</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
