import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Registration from "./components/Registration";
import Home from "./components/Home";
import Login from "./components/Login";
import Verify from "./components/Verify";
import RoleSelection from "./components/RoleSelection";
import DobSelection from "./components/DobSelection";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import AdminPage from "./components/AdminPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import { getUserRoles, isAuthenticated } from "./services/authService";

const App: React.FC = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (isAuthenticated()) {
        try {
          const userRoles = await getUserRoles();
          setRoles(userRoles);
        } catch (err) {}
      }
      setLoading(false);
    };

    fetchRoles();
  }, []);

  const isAdmin = roles.includes("admin");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/select-dob" element={<DobSelection />} />
          <Route
            path="/admin-page"
            element={isAdmin ? <AdminPage /> : <Navigate to="/unauthorized" />}
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />{" "}
          <Route
            path="/request-password-reset"
            element={<RequestPasswordReset />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
