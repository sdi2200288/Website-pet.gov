import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import ScrollTop from "./components/ScrollTop";

import HomePage from "./pages/HomePage/HomePage";
import VetDashboard from "./pages/VetDashboard/VetDashboard";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import Found from "./pages/OwnerDashboard/Found";
import Loss from "./pages/OwnerDashboard/Loss";
import Found2 from "./pages/VetDashboard/Found2";
import Loss2 from "./pages/VetDashboard/Loss2";
import HealthBooklet from "./pages/OwnerDashboard/HealthBooklet";
import AllLostPets from "./pages/AllLostPets/AllLostPets";
import PetProfile from "./pages/AllLostPets/PetProfile";
import AdoptionPage from "./pages/AdoptionPage/AdoptionPage";


import ProfileOwner from "./pages/OwnerDashboard/Profile";
import ProfileVet from "./pages/VetDashboard/Profile";
import ProfilePetOwner from "./pages/PetProfile/PetProfile";


import Login from "./pages/Login-Register/Login";
import Register from "./pages/Login-Register/Register";
import ChangeCode from "./pages/Login-Register/ChangeCode";


import Cookies from "./pages/FooterPages/Others/Cookies";
import AboutUs from "./pages/FooterPages/Others/AboutUs";
import Privacy from "./pages/FooterPages/Others/Privacy";
import TermsAndConditions from "./pages/FooterPages/Others/TermsAndConditions";
import Communication from "./pages/FooterPages/Communication/Communication";
import FAQOwner from "./pages/FooterPages/FAQ/FAQOwner";
import FAQVet from "./pages/FooterPages/FAQ/FAQVet";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState(1);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <BrowserRouter>
      <ScrollTop />

      <Menu isLoggedIn={isLoggedIn} onLogout={handleLogout} activeMenu={activeMenu} setActiveMenu={setActiveMenu} userRole={userRole} />

      <main className="main-content">
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/vet-dashboard" element={<VetDashboard />}>
            <Route path="found2" element={<Found2 />} />
            <Route path="loss2" element={<Loss2 />} />
          </Route>

          {/* OWNER DASHBOARD */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />}>
            <Route path="health-booklet" element={<HealthBooklet />} />
            <Route path="found" element={<Found />} />
            <Route path="loss" element={<Loss />} />
          </Route>
          <Route path="ProfileOwner" element={<ProfileOwner />} />
          <Route path="ProfileVet" element={<ProfileVet />} />
          <Route path="/ProfilePetOwner" element={<ProfilePetOwner />} />


          <Route path="/all-lost-pets" element={<AllLostPets />} />
          <Route path="/PetProfile" element={<PetProfile />} />
          <Route path="/adoption" element={<AdoptionPage />} />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register/owner" element={<Register role="owner" />} />
          <Route path="/register/vet" element={<Register role="vet" />} />
          <Route path="/changecode" element={<ChangeCode />} />



          <Route path="/Communication" element={<Communication />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/FAQOwner" element={<FAQOwner />} />
          <Route path="/FAQVet" element={<FAQVet />} />

        </Routes>
      </main>

      <Footer setActiveMenu={setActiveMenu} />
    </BrowserRouter>
  );
}

export default App;
