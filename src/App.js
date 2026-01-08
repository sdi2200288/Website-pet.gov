import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleMismatch from "./RoleMismatch";

import Menu from "./components/Menu/Menu";
import Footer from "./components/Footer/Footer";
import ScrollTop from "./components/ScrollTop";

import HomePage from "./pages/HomePage/HomePage";
import VetDashboard from "./pages/VetDashboard/VetDashboard";
import OwnerDashboard from "./pages/OwnerDashboard/OwnerDashboard";

import Found from "./pages/OwnerDashboard/Found";
import Loss from "./pages/OwnerDashboard/Loss";
import BookDate from "./pages/OwnerDashboard/BookDate";
import FutureBookings from "./pages/OwnerDashboard/FutureBookings";

import Found2 from "./pages/VetDashboard/Found2";
import Loss2 from "./pages/VetDashboard/Loss2";
import Anadoxi from "./pages/VetDashboard/Anadoxi";
import Transfer from "./pages/VetDashboard/Transfer";
import Identity from "./pages/VetDashboard/Identity";
import Adopt from "./pages/VetDashboard/Adopt";

import MedicalActions from "./pages/VetDashboard/MedicalActions";
import HealthBookletOwner from "./pages/OwnerDashboard/HealthBookletOwner";
import HealthBookletVet from "./pages/VetDashboard/HealthBookletVet";
import FutureBookingsVet from "./pages/VetDashboard/FutureBookingsVet";

import AllLostPets from "./pages/AllLostPets/AllLostPets";
import PetProfile from "./pages/AllLostPets/PetProfile";
import FoundLost from "./pages/AllLostPets/found";

import ProfileOwner from "./pages/OwnerDashboard/Profile";

import ProfilePetOwner from "./pages/Owner-Vet/PetProfile";
import HistoryDeclaration from "./pages/Owner-Vet/HistoryDeclaration";

import Login from "./pages/Login-Register/Login";
import Register from "./pages/Login-Register/Register";
import ChangeCode from "./pages/Login-Register/ChangeCode";
import UpdateProfile from "./pages/Login-Register/UpdateProfile";

import Cookies from "./pages/FooterPages/Others/Cookies";
import AboutUs from "./pages/FooterPages/Others/AboutUs";
import Privacy from "./pages/FooterPages/Others/Privacy";
import TermsAndConditions from "./pages/FooterPages/Others/TermsAndConditions";
import Communication from "./pages/FooterPages/Communication/Communication";
import FAQOwner from "./pages/FooterPages/FAQ/FAQOwner";
import FAQVet from "./pages/FooterPages/FAQ/FAQVet";

function RoleMismatchWrapper() {
  const { role } = useParams();
  return <RoleMismatch expectedRole={role} />;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const showMenuFooter = !location.pathname.startsWith("/foundLostPet/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState(1);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserData(user);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserRole(user.role);
    setUserData(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem("user");
    navigate("/login")
  };

  return (
    <>
      <ScrollTop />
      {showMenuFooter && (<Menu isLoggedIn={isLoggedIn} onLogout={handleLogout} activeMenu={activeMenu} setActiveMenu={setActiveMenu} userRole={userRole} />)}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* VET DASHBOARD */}
          <Route element={<ProtectedRoute allowedRole="vet" />}>
            <Route path="/vet-dashboard" element={<VetDashboard />}>
              <Route path="found2" element={<Found2 />} />
              <Route path="loss2" element={<Loss2 />} />
              <Route path="anadoxi" element={<Anadoxi />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="adopt" element={<Adopt />} />
              <Route path="identity" element={<Identity />} />
              <Route path="history-statement" element={<HistoryDeclaration />} />
              <Route path="medical" element={<MedicalActions />} />
              <Route path="booklet" element={<HealthBookletVet />} />
              <Route path="future-bookings-vet" element={<FutureBookingsVet />} />
            </Route>
          </Route>

          {/* OWNER DASHBOARD */}
          <Route element={<ProtectedRoute allowedRole="owner" />}>
            <Route path="/owner-dashboard" element={<OwnerDashboard />}>
              <Route path="health-booklet" element={<HealthBookletOwner />} />
              <Route path="found" element={<Found />} />
              <Route path="loss" element={<Loss />} />
              <Route path="history-statement" element={<HistoryDeclaration />} />
              <Route path="book-date" element={<BookDate />} />
              <Route path="future-bookings" element={<FutureBookings />} />
            </Route>
          </Route>

          <Route path="/ProfileOwner" element={<ProfileOwner />} />
          <Route path="/ProfilePetOwner/:id" element={<ProfilePetOwner />} />

          <Route path="/all-lost-pets" element={<AllLostPets />} />
          <Route path="/all-lost-pets/PetProfile/:id" element={<PetProfile />} />
          <Route path="/foundLostPet/:id" element={<FoundLost isLoggedIn={isLoggedIn} userData={userData} />} />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register/owner" element={
            <Register
              role="owner"
              onRegister={(user) => handleLogin(user)}
            />
          } />
          <Route path="/register/vet" element={
            <Register
              role="vet"
              onRegister={(user) => handleLogin(user)}
            />
          } />

          <Route path="/changecode" element={<ChangeCode />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />

          <Route path="/Communication" element={<Communication />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/FAQOwner" element={<FAQOwner />} />
          <Route path="/FAQVet" element={<FAQVet />} />

          <Route path="/role-mismatch/:role" element={<RoleMismatchWrapper />} />
        </Routes>
      </main>

      {showMenuFooter && <Footer setActiveMenu={setActiveMenu} />}
    </>
  );
}

export default App;
