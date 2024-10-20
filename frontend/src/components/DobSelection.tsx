import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import "../assets/css/Step3.css";

interface DobSelectionForm {
  dob: string;
}

const DobSelection: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DobSelectionForm>();
  const [serverError, setServerError] = useState<string>("");

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const userId = query.get("userId");
  const role = query.get("role");
  const token = query.get("token");
  const refreshToken = query.get("refreshToken");

  const onSubmitHandler: SubmitHandler<DobSelectionForm> = async (data) => {
    const { dob } = data;

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
    <div className="step3-container">
      <h2 className="step3-title">Select Your Date of Birth</h2>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        noValidate
        className="step3-form"
      >
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            {...register("dob", { required: "Date of birth is required" })}
            className={`form-input ${errors.dob ? "input-error" : ""}`}
          />
          {errors.dob && <p className="error-message">{errors.dob.message}</p>}
        </div>

        <div className="button-container">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="step3-back-button"
          >
            Back
          </button>
          <button type="submit" className="step3-submit-button">
            Submit
          </button>
        </div>

        {serverError && <p className="error">{serverError}</p>}
      </form>
    </div>
  );
};

export default DobSelection;
