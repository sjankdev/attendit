import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const [serverError, setServerError] = useState<string>('');
    const navigate = useNavigate();
    const [emailForResend, setEmailForResend] = useState<string>('');

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        setServerError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', data);
            if (response.data.token && response.data.refreshToken) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                navigate('/home');
            } else {
                setServerError('Invalid login credentials');
            }
        } catch (error: any) {
            setServerError('Invalid email or password');
            if (error.response.status === 403) {
                setEmailForResend(data.email);
            }
        }
    };

    const handleResendVerification = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-verification', { email: emailForResend });
            alert('Verification email resent successfully.');
        } catch (error) {
            alert('Failed to resend verification email.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                </div>
                {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
                <button type="submit">Login</button>
            </form>
            {emailForResend && (
                <div>
                    <p>Your account is not verified. Click below to resend the verification email:</p>
                    <button onClick={handleResendVerification}>Resend Verification Email</button>
                </div>
            )}
        </div>
    );
};

export default Login;
