import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [isTokenChecked, setIsTokenChecked] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token') || localStorage.getItem('token');

        if (token) {
            console.log('Token from URL or localStorage:', token);

            if (urlParams.get('token')) {
                localStorage.setItem('token', token);
                console.log('Token stored in localStorage:', token);
            }
            
            if (urlParams.get('token')) {
                window.history.replaceState({}, document.title, '/home');
            }

            setIsTokenChecked(true); 
        } else {
            console.log('No token found, redirecting to login');
            navigate('/');
        }
    }, [navigate]);

    if (!isTokenChecked) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <h1>Welcome Home</h1>
        </div>
    );
};

export default Home;
