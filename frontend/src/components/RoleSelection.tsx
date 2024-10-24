import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import eventAdminIcon from "../assets/photos/icons/event-admin.png";
import eventParticipantIcon from "../assets/photos/icons/event-participant.png";
import "../assets/css/Step2.css";

const RoleSelection: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
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

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  const handleRoleSubmit = () => {
    if (selectedRole) {
      navigate(
        `/select-dob?userId=${userId}&role=${selectedRole}&token=${token}&refreshToken=${refreshToken}`
      );
    }
  };

  return (
    <div className="step2-container">
      <h2 className="step2-title">Select Your Role</h2>
      <div className="role-selection">
        <div
          className={`role-option ${
            selectedRole === "admin" ? "selected" : ""
          }`}
          onClick={() => handleRoleSelection("admin")}
          role="button"
          aria-pressed={selectedRole === "admin"}
        >
          <img src={eventAdminIcon} alt="Event Organizer" />
          <span>Event Organizer</span>
        </div>
        <div
          className={`role-option ${
            selectedRole === "participant" ? "selected" : ""
          }`}
          onClick={() => handleRoleSelection("participant")}
          role="button"
          aria-pressed={selectedRole === "participant"}
        >
          <img src={eventParticipantIcon} alt="Attender" />
          <span>Attender</span>
        </div>
      </div>
      <div className="button-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          type="button"
          className="next-button"
          onClick={handleRoleSubmit}
          disabled={!selectedRole}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
