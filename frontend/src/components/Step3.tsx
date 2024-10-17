import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
    <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          {...register("firstName", { required: "First name is required" })}
        />
        {errors.firstName && (
          <p className="error-message">{errors.firstName.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          {...register("lastName", { required: "Last name is required" })}
        />
        {errors.lastName && (
          <p className="error-message">{errors.lastName.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dob">Date of Birth:</label>
        <input
          type="date"
          id="dob"
          {...register("dob", { required: "Date of birth is required" })}
        />
        {errors.dob && <p className="error-message">{errors.dob.message}</p>}
      </div>

      <button type="button" onClick={onBack} className="back-button">
        Back
      </button>
      <button type="submit" className="submit-button">
        Finish Registration
      </button>
    </form>
  );
};

export default Step3;
