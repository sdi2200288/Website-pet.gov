import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import VetDashboard from "./pages/VetDashboard/VetDashboard";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import Profile from "./pages/OwnerDashboard/Profile";
import HealthBooklet from "./pages/OwnerDashboard/HealthBooklet";
import AllLostPets from "./pages/AllLostPets/AllLostPets";
import AdoptionPage from "./pages/AdoptionPage/AdoptionPage";
import Menu from "./components/Menu/Menu";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import Cookies from "./pages/FooterPages/Others/Cookies";
import AboutUs from "./pages/FooterPages/Others/AboutUs";
import Privacy from "./pages/FooterPages/Others/Privacy";
import TermsAndConditions from "./pages/FooterPages/Others/TermsAndConditions";
import Communication from "./pages/FooterPages/Communication/Communication";


function App() {
  return (
    <BrowserRouter>
      <Menu />

      <main className="main-content">
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />

          {/* OWNER DASHBOARD */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="health-booklet" element={<HealthBooklet />} />
          </Route>

          <Route path="/all-lost-pets" element={<AllLostPets />} />
          <Route path="/adoption" element={<AdoptionPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/Communication" element={<Communication />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
