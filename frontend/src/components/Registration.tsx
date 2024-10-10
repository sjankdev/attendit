import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import '../assets/css/Registration.css';

interface RegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const Registration: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>();
    const [serverError, setServerError] = useState<string>('');

    const onSubmit: SubmitHandler<RegistrationForm> = async (data) => {
        setServerError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', data);
            alert(response.data.message);

            if (response.data.token && response.data.refreshToken) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        } catch (error: any) {
            if (error.response) {
                console.error(error.response.data);
                setServerError(error.response.data.message || 'An error occurred');
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <div className="registration-container">
            <h2>Join Our Event Management Community</h2>
            <p>Streamline your event planning and invitations!</p>
            <form className="registration-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        {...register("firstName", {
                            required: "First name is required"
                        })}
                        autoComplete="given-name"
                        aria-describedby="firstNameError"
                    />
                    {errors.firstName && <p id="firstNameError" className="error-message">{errors.firstName.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        {...register("lastName", {
                            required: "Last name is required"
                        })}
                        autoComplete="family-name"
                        aria-describedby="lastNameError"
                    />
                    {errors.lastName && <p id="lastNameError" className="error-message">{errors.lastName.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email format"
                            }
                        })}
                        autoComplete="email"
                        aria-describedby="emailError"
                    />
                    {errors.email && <p id="emailError" className="error-message">{errors.email.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters long" }
                        })}
                        autoComplete="new-password"
                        aria-describedby="passwordError"
                    />
                    {errors.password && <p id="passwordError" className="error-message">{errors.password.message}</p>}
                </div>

                {serverError && <p className="server-error">{serverError}</p>}
                <button type="submit" className="submit-button">Register</button>
            </form>

            <h3>Or sign in with:</h3>
            <button type="button" onClick={handleGoogleLogin} className="google-button">Sign in with Google</button>

            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default Registration;
