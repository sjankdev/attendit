import React, { useState } from "react";
import axios from "axios";

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
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter your new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPassword;
