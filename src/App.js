import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VetDashboard from "./pages/HomePage/VetDashboard";
import OwnerDashboard from "./pages/HomePage/OwnerDashboard";
import AllLostPets from "./pages/HomePage/AllLostPets";
import AdoptionPage from "./pages/HomePage/AdoptionPage";
import Menu from "./components/Menu/Menu";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vet-dashboard" element={<VetDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/all-lost-pets" element={<AllLostPets />} />
          <Route path="/adoption" element={<AdoptionPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
