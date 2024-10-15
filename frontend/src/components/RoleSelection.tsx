import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RoleSelection: React.FC = () => {
  const [role, setRole] = useState<string>("participant");
  const [serverError, setServerError] = useState<string>("");
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const userId = query.get("userId");
  const token = query.get("token");
  const refreshToken = query.get("refreshToken");
  const firstTime = query.get("firstTime") === "true";

  useEffect(() => {
    if (!firstTime) {
      window.location.href = `/home?token=${token}&refreshToken=${refreshToken}`;
    }
  }, [firstTime, token, refreshToken]);

  const handleRoleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/select-role",
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      alert(response.data.message);
      window.location.href = `/home?token=${token}&refreshToken=${refreshToken}`;
    } catch (error: any) {
      console.error("Error during role submission:", error);
      setServerError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="participant">Participant</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRoleSubmit}>Submit</button>
      {serverError && <p className="error">{serverError}</p>}
    </div>
  );
};

export default RoleSelection;
