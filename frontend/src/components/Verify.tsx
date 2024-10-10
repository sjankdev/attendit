import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Verify.css';

const Verify: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [verificationFailed, setVerificationFailed] = useState<boolean>(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        const verifyEmail = async () => {
            try {
                await axios.get(`http://localhost:5000/api/auth/verify?token=${token}`);
                alert('Email verified successfully! You can now log in.');
                navigate('/login');
            } catch (error) {
                alert('Email verification failed. The link may be expired. Please request a new verification email.');
                console.error(error);
                setVerificationFailed(true);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleResendVerification = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
            alert('Verification email resent successfully.');
        } catch (error) {
            alert('Failed to resend verification email. Please try again.');
        }
    };

    return (
        <div className="verification-page">
            <div className="verification-container">
                {verificationFailed ? (
                    <div className="verification-failed">
                        <h2 className="verification-header">Email Verification</h2>
                        <p className="verification-message">
                            Your verification link has expired.<br />
                            Please enter your email to resend the verification email:
                        </p>
                        <input
                            type="email"
                            className="email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button className="resend-button" onClick={handleResendVerification}>
                            Resend Verification Email
                        </button>
                    </div>
                ) : (
                    <h2 className="verification-status">Verifying your email...</h2>
                )}
            </div>
        </div>
    );
};

export default Verify;
