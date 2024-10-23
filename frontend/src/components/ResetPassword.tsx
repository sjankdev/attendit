import React, { useState } from "react";
import axios from "axios";
import "../assets/css/ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      alert("Password has been reset successfully.");
    } catch (error) {
      alert("Error resetting password. Please try again.");
    }
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
    </div>
  );
}

export default ResetPassword;
