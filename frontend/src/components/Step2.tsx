import React, { useState } from "react";
import eventAdminIcon from "../assets/photos/icons/event-admin.png";
import eventParticipantIcon from "../assets/photos/icons/event-participant.png";
import "../assets/css/Step2.css";

interface Step2Props {
  onNext: (roles: string[]) => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onNext([selectedRole]);
    }
  };

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="step2-container">
      <h2 className="step2-title">You are joining as?</h2>
      <form className="step2-form" onSubmit={handleNext}>
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
          <button type="button" className="back-button" onClick={onBack}>
            Back
          </button>
          <button
            type="submit"
            className="next-button"
            disabled={!selectedRole}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
