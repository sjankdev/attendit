import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';

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

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST', 
                credentials: 'include',
            });
    
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken'); 
            console.log('User logged out, tokens removed from localStorage.');
    
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    if (!isTokenChecked) {
        return <div className="loading">Loading...</div>; 
    }

    return (
        <div>
            <div className="logout-wrapper">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <div className="home-container">
                <h1>Welcome Home</h1>
                <p>Explore our event management tools to streamline your planning process.</p>
            </div>
        </div>
    );
};

export default Home;
