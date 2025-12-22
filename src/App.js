import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import VetDashboard from "./pages/VetDashboard/VetDashboard";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";
import Profile from "./pages/OwnerDashboard/Profile";
import AllLostPets from "./pages/AllLostPets/AllLostPets";
import AdoptionPage from "./pages/AdoptionPage/AdoptionPage";
import Menu from "./components/Menu/Menu";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer/Footer";
import "./App.css";

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
          </Route>

          <Route path="/all-lost-pets" element={<AllLostPets />} />
          <Route path="/adoption" element={<AdoptionPage />} />

        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
