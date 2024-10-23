import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setResetSuccess(true);
    } catch (error) {
      alert("Error resetting password. Please try again.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="reset-password-container">
      <h2>Create a New Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          className="form-input"
          required
        />
        <button type="submit" className="form-button">
          Reset Password
        </button>
      </form>

      {resetSuccess && (
        <div className="success-container">
          <p className="success-message">
            Password has been reset successfully.
          </p>
          <button onClick={handleGoToLogin} className="form-button">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
