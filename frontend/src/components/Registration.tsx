import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

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
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        {...register("firstName", {
                            required: "First name is required"
                        })}
                    />
                    {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName.message}</p>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        {...register("lastName", {
                            required: "Last name is required"
                        })}
                    />
                    {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName.message}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters long" }
                        })}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <button type="submit">Register</button>
            </form>

            <div>
                <h3>Or sign in with:</h3>
                <button onClick={handleGoogleLogin}>Sign in with Google</button>
            </div>
        </div>
    );
};

export default Registration;
