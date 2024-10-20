import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "../assets/css/Step1.css";
import googleSignInIcon from "../assets/photos/logos/google-sign-in-icon.png";
import BannerSlider from "../utils/Slider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Step1Props {
  onNext: (data: { email: string; password: string }) => void;
  serverError: string;
}

const Step1: React.FC<Step1Props> = ({ onNext, serverError }) => {
  const navigate = useNavigate();

  const [emailExistsError, setEmailExistsError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const onSubmit: SubmitHandler<{ email: string; password: string }> = async (
    data
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/check-email",
        {
          email: data.email,
        }
      );

      if (response.data.exists) {
        setEmailExistsError(
          "Email already exists, please use a different email."
        );
      } else {
        setEmailExistsError("");
        onNext(data);
      }
    } catch (error) {
      console.error(error);
      setEmailExistsError("An error occurred while checking the email.");
    }
  };

  return (
    <div className="step1-container">
      <div className="form-section">
        <form
          className="step1-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2 className="form-title">Create Your Account</h2>

          <div className="form-group">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              autoComplete="email"
              placeholder="Email..."
              className="form-input"
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
            {emailExistsError && (
              <p className="error-message">{emailExistsError}</p>
            )}
          </div>

          <div className="form-group">
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
              className="form-input"
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>

          <button
            type="button"
            className="google-signin-button"
            onClick={() =>
              (window.location.href = "http://localhost:5000/auth/google")
            }
          >
            <img
              src={googleSignInIcon}
              alt="Google icon"
              className="google-icon"
            />
            Sign in with Google
          </button>

          <div
            className="custom-login-div"
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have an account? Login
          </div>
        </form>
      </div>

      <div className="image-section">
        <BannerSlider />
      </div>
    </div>
  );
};

export default Step1;
