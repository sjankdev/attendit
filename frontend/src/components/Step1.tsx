import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Step1Props {
  onNext: (data: { email: string; password: string }) => void;
  serverError: string;
}

const Step1: React.FC<Step1Props> = ({ onNext, serverError }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit: SubmitHandler<{ email: string; password: string }> = (
    data
  ) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
          autoComplete="email"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="server-error">{serverError}</p>}
      <button type="submit" className="submit-button">
        Create Account
      </button>
      <button
        type="button"
        onClick={() =>
          (window.location.href = "http://localhost:5000/auth/google")
        }
        className="google-button"
      >
        Sign in with Google
      </button>
    </form>
  );
};

export default Step1;
