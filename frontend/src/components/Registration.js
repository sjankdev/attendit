import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setServerError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', data);
            alert(response.data.message);
        } catch (error) {
            if (error.response) {
                console.error(error.response.data);
                setServerError(error.response.data.message || 'An error occurred');
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        {...register("username", {
                            required: "Username is required",
                            minLength: { value: 3, message: "Username must be at least 3 characters long" }
                        })}
                    />
                    {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
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
        </div>
    );
};

export default Registration;
