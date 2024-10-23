import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/Login.css";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();
  const [emailForResend, setEmailForResend] = useState<string>("");

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setServerError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      if (response.data.token && response.data.refreshToken) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/home");
      } else {
        setServerError("Invalid login credentials");
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        setEmailForResend(data.email);
      } else {
        setServerError("Invalid email or password");
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-verification", {
        email: emailForResend,
      });
      alert("Verification email resent successfully.");
    } catch (error) {
      alert("Failed to resend verification email.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            aria-describedby="emailError"
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && (
            <p id="emailError" className="error-message">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            autoComplete="current-password"
            aria-describedby="passwordError"
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && (
            <p id="passwordError" className="error-message">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && !emailForResend && (
          <p className="error-message">{serverError}</p>
        )}

        <button type="submit" className="submit-button">
          Login
        </button>

        {emailForResend && (
          <div className="resend-verification">
            <p>
              Your account is not verified. Click below to resend the
              verification email:
            </p>
            <button
              type="button"
              className="resend-button"
              onClick={handleResendVerification}
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <Link to="/request-password-reset" className="forgot-password">
          Forgot Password?
        </Link>

        <p className="register-link">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="register-button"
          >
            Register now
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
