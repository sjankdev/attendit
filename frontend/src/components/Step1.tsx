import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "../assets/css/Step1.css";
import googleSignInIcon from "../assets/photos/logos/google-sign-in-icon.png";
import BannerSlider from "../utils/Slider";

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
    <div className="centered-container">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            placeholder="Email..."
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}

          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            autoComplete="new-password"
            placeholder="Password..."
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit" className="create-account-button">
            Create Account
          </button>

          <button
            className="google-signin-button"
            type="button"
            onClick={() =>
              (window.location.href = "http://localhost:5000/auth/google")
            }
          >
            <img src={googleSignInIcon} alt="Google icon" width="20" />
            Sign in with Google
          </button>

          <button
            type="button"
            className="login-button"
            onClick={() => {
              console.log("Redirect to login");
            }}
          >
            Already have an account? Login
          </button>
        </form>
      </div>

      <div className="slideshow-container">
        <BannerSlider />
      </div>
    </div>
  );
};

export default Step1;
