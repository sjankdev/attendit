import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registration from './components/Registration';
import Home from './components/Home';
import Login from './components/Login';
import Verify from './components/Verify';
import RoleSelection from './components/RoleSelection';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/register" element={<Registration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/select-role" element={<RoleSelection />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
