import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Home from './components/Home';

import Login from './components/Login';
import Verify from './components/Verify';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
