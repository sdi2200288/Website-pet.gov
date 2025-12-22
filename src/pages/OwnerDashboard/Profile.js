import React from "react";
import "./Profile.css";

export default function Profile() {
  return (
    
    <div className="owner-profile">

      {/* ΚΑΡΤΑ ΠΡΟΦΙΛ */}
      <div className="profile-card">

        <div className="profile-columns">

          {/* Αριστερή στήλη */}
          <div className="profile-section">
            <h3>Προσωπικά στοιχεία</h3>
            <ul>
              <li><span>Όνομα</span><p>Μαρία</p></li>
              <li><span>Επώνυμο</span><p>Παπαδοπούλου</p></li>
              <li><span>Φύλο</span><p>Γυναίκα</p></li>
              <li><span>ΑΦΜ</span><p>123456789</p></li>
              <li><span>Ημερομηνία γέννησης</span><p>12/05/1998</p></li>
            </ul>
          </div>

          {/* Δεξιά στήλη */}
          <div className="profile-section">
            <h3>Στοιχεία επικοινωνίας</h3>
            <ul>
              <li><span>Διεύθυνση</span><p>Αθήνα</p></li>
              <li><span>Τηλέφωνο</span><p>6900000000</p></li>
              <li><span>Email</span><p>maria@email.com</p></li>
            </ul>
          </div>

        </div>

        {/* Κουμπιά */}
        <div className="profile-actions">
          <button className="secondary-btn">Αλλαγή κωδικού</button>
          <button className="primary-btn">Ενημέρωση στοιχείων</button>
        </div>
    </div> 
    
    {/* ΚΑΤΟΙΚΙΔΙΑ */}
    <div className="pets-section">
        <h3>Τα κατοικίδιά μου (2)</h3>
       
        <div className="pets-filters">
            <select>
                <option value="">Ταξινόμηση</option>
                <option value="name">Όνομα (Α-Ω)</option>
                <option value="age">Ηλικία (Μικρότερο-Μεγαλύτερο)</option>
            </select>
    
            <select>
                <option value="">Είδος</option>
                <option value="dog">Σκύλος</option>
                <option value="cat">Γάτα</option>
                <option value="other">Άλλο</option>
            </select>

            <div className="hero-search">
            <input
                type="text"
                placeholder="Εισάγετε αριθμό μικροτσίπ..."
                className="hero-input"
            />
            <button className="hero-button" aria-label="Αναζήτηση">
                <span>Αναζήτηση</span>
            </button>
            </div>
        </div>
        <div className="pets-grid">
            <div className="pet-card">Barbie</div>
            <div className="pet-card">Μπαλού</div>
        </div>
        </div>
    </div>
  );
}
