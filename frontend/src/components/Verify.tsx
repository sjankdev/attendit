import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Verify: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        const verifyEmail = async () => {
            try {
                await axios.get(`http://localhost:5000/api/auth/verify?token=${token}`);
                alert('Email verified successfully! You can now log in.');
                navigate('/login');
            } catch (error) {
                alert('Email verification failed. Please try again.');
                console.error(error);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            navigate('/');
        }
    }, [navigate]);

    return <div>Verifying your email...</div>;
};

export default Verify;
