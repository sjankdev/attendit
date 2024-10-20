import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    <div className="login-wrapper">
      {" "}
      {/* New wrapper div for centering */}
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="login-form"
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              autoComplete="email"
              className={errors.email ? "input-error" : ""}
              aria-describedby="emailError"
            />
            {errors.email && (
              <p id="emailError" className="error-message">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              autoComplete="current-password"
              className={errors.password ? "input-error" : ""}
              aria-describedby="passwordError"
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

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

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

        <p className="register-prompt">
          Don't have an account?
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
