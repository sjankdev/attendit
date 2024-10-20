import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "../assets/css/Step3.css";

interface Step3Props {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    dob: string;
  }) => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ onSubmit, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ firstName: string; lastName: string; dob: string }>();

  const onSubmitHandler: SubmitHandler<{
    firstName: string;
    lastName: string;
    dob: string;
  }> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="step3-container">
      <h2 className="step3-title">Complete Your Registration</h2>
      <form onSubmit={handleSubmit(onSubmitHandler)} noValidate className="step3-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: "First name is required" })}
            className={`form-input ${errors.firstName ? "input-error" : ""}`}
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: "Last name is required" })}
            className={`form-input ${errors.lastName ? "input-error" : ""}`}
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
        </div>

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
          <button type="button" onClick={onBack} className="step3-back-button">
            Back
          </button>
          <button type="submit" className="step3-submit-button">
            Finish Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
