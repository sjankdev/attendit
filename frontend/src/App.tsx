import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Home from './components/Home'; 

import Login from './components/Login';  

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <h1>Welcome to AttendIt</h1>
                <Routes>
                    <Route path="/" element={<Registration />} />
                    <Route path="/login" element={<Login />} />  
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
