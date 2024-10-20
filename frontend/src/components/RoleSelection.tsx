import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RoleSelection: React.FC = () => {
  const [role, setRole] = useState<string>("participant");
  const { search } = useLocation();
  const navigate = useNavigate();

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

  const handleRoleSubmit = () => {
    navigate(
      `/select-dob?userId=${userId}&role=${role}&token=${token}&refreshToken=${refreshToken}`
    );
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="participant">Participant</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleRoleSubmit}>Next</button>
    </div>
  );
};

export default RoleSelection;
