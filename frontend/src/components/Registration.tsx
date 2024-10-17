import React, { useState } from "react";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import "../assets/css/Registration.css";

const Registration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    email?: string;
    password?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    dob?: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string>("");

  const handleNextStep = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinishRegistration = async (data: {
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    const registrationData = { ...formData, ...data };
    setServerError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        registrationData
      );
      alert(response.data.message);
      if (response.data.token && response.data.refreshToken) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.data);
        setServerError(error.response.data.message || "An error occurred");
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Join Our Event Management Community</h2>
      <p>Streamline your event planning and invitations!</p>
      {currentStep === 1 && (
        <Step1 onNext={handleNextStep} serverError={serverError} />
      )}
      {currentStep === 2 && (
        <Step2
          onNext={(role) => handleNextStep({ role })}
          onBack={handleBackStep}
        />
      )}
      {currentStep === 3 && (
        <Step3 onSubmit={handleFinishRegistration} onBack={handleBackStep} />
      )}
    </div>
  );
};

export default Registration;
