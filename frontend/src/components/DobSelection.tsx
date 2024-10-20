import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DobSelection: React.FC = () => {
  const [dob, setDob] = useState<string>("");
  const [serverError, setServerError] = useState<string>("");
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const userId = query.get("userId");
  const role = query.get("role");
  const token = query.get("token");
  const refreshToken = query.get("refreshToken");

  const handleDobSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/select-role",
        { userId, role, dob },
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
      console.error("Error during DOB submission:", error);
      setServerError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Select Your Date of Birth</h2>
      <div>
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      <button onClick={handleDobSubmit}>Submit</button>
      {serverError && <p className="error">{serverError}</p>}
    </div>
  );
};

export default DobSelection;
