import React from 'react';
import arxikieikona from './images/Arxiki_eikona.png';
import owner from './images/owner.png';
import vet from './images/vet.png';
import logo from './images/logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* ΜΕΝΟΥ ΠΑΝΩ */}
      <header className="top-header">
        <div className="menu-container">
          <img src={logo} className="header-logo" alt="PetCare Logo" />
          <nav className="main-menu">
            <a href="#home" className="menu-item active">Αρχική</a>
            <a href="#microchip" className="menu-item">Ιδιοκτήτης</a>
            <a href="#vet" className="menu-item">Κτηνίατρος</a>
            <a href="#find" className="menu-item">Χαμένα Κατοικίδια</a>
            <a href="#about" className="menu-item">Προς Υιοθεσία</a>
            <a href="#register" className="menu-item">Εγγραφή</a>
            <a href="#login" className="menu-item">Σύνδεση</a>
          </nav>
        </div>
      </header>

      {/* ΚΥΡΙΟ ΠΕΡΙΕΧΟΜΕΝΟ */}
      <main className="main-content">
        {/* Η ΚΥΡΙΑ ΕΙΚΟΝΑ ΜΕ ΤΗ ΜΙΚΡΗ ΚΑΡΤΕΛΑ ΑΡΙΣΤΕΡΑ */}
        <section className="hero-section-simple">
          <div className="hero-image-container">
            <img src={arxikieikona} alt="Κατοικίδιο" className="main-image" />
            <div className="transparent-card-left">
              <h1>Βρήκατε Κατοικίδιο;</h1>
              <p className="card-description">
                Είσαι ιδιοκτήτης, κτηνίατρος ή απλός πολίτης και βρήκες κάποιο κατοικίδιο:
              </p>
              <p className="card-instruction">
                Δεν χρειάζεται να συνδεθείς. Απλά βάλε το μικροτσίπ για να βρείς το κατοικίδιο
                και να δηλώσεις εύρεση.
              </p>
              <div className="search-container-transparent">
                <input 
                  type="text" 
                  placeholder="Εισάγετε αριθμό μικροτσίπ..." 
                  className="search-input-small"
                />
                <button className="search-button-transparent">
                  Αναζήτηση
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ΟΙ ΔΥΟ ΚΑΡΤΕΛΕΣ ΑΠΛΕΣ */}
        <div className="simple-cards-container">
          
          {/* ΚΑΡΤΑ ΚΤΗΝΙΑΤΡΟΥ */}
          <div className="simple-card">
            <a href="#vet-login" className="card-title-simple">
              <h2>Είμαι Κτηνίατρος</h2>
            </a>
            <div className="card-content-simple">
              <img src={vet} alt="Κτηνίατρος" className="card-image-simple" />
              <div className="card-text-simple">
                <ul className="simple-list">
                  <li>Να εγγραφείτε εύκολα και να ενημερωθείτε για τη λειτουργία της υπηρεσίας</li>
                  <li>Να δημιουργήσετε το επαγγελματικό σας προφίλ με στοιχεία όπως ΑΦΜ, σπουδές, εμπειρία και στοιχεία ιατρείου</li>
                  <li>Να καταγράφετε στοιχεία κατοικιδίων (π.χ. μικροτσίπ, είδος, ηλικία, φύλο) και σχετικά συμβάντα (απώλεια, εύρεση, υιοθεσία, κ.ά.)</li>
                  <li>Να καταχωρίζετε ιατρικές πράξεις (εμβολιασμοί, στείρωση, επεμβάσεις κ.ά.) και να εκτυπώνετε βιβλιάρια υγείας</li>
                  <li>Να ορίζετε τη διαθεσιμότητά σας και να διαχειρίζεστε ραντεβού με ιδιοκτήτες</li>
                  <li>Να προβάλλετε το ιστορικό επισκέψεων και τις αξιολογήσεις</li>
                </ul>
                <a href="#vet-login" className="login-link-simple">Σύνδεση ως Κτηνίατρος</a>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ ΙΔΙΟΚΤΗΤΗ */}
          <div className="simple-card">
            <a href="#owner-login" className="card-title-simple">
              <h2>Είμαι Ιδιοκτήτης</h2>
            </a>
            <div className="card-content-simple reverse">
              <div className="card-text-simple">
                <ul className="simple-list">
                  <li>Να παρακολουθείτε τις ιατρικές πράξεις και το ηλεκτρονικό βιβλιάριο υγείας των κατοικιδίων σας</li>
                  <li>Να δηλώνετε απώλεια ή εύρεση κατοικιδίου και να βλέπετε το ιστορικό των δηλώσεών σας</li>
                  <li>Να αναζητάτε κτηνιάτρους βάσει περιοχής, διαθεσιμότητας και ειδικότητας</li>
                  <li>Να κλείνετε, τροποποιείτε ή ακυρώνετε ραντεβού με επαγγελματίες και να ενημερώνεστε αυτόματα για αλλαγές</li>
                  <li>Να προβάλλετε το ιστορικό ραντεβού σας και να αξιολογείτε τους κτηνιάτρους</li>
                </ul>
                <a href="#owner-login" className="login-link-simple">Σύνδεση ως Ιδιοκτήτης</a>
              </div>
              <img src={owner} alt="Ιδιοκτήτης" className="card-image-simple" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;