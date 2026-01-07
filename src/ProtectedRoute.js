import { Navigate, Outlet,useLocation  } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  
  // Αν ΔΕΝ είναι συνδεδεμένος → άφησέ τον να δει το dashboard
  if (!user) {
    return <Outlet />;
  }

  // Αν είναι συνδεδεμένος αλλά με λάθος ρόλο
  if (user?.role && user.role !== allowedRole && !location.state?.ignoreMismatch) {
    return <Navigate to={`/role-mismatch/${allowedRole}`} />;
  }

  // Σωστός ρόλος
  return <Outlet />;
}
