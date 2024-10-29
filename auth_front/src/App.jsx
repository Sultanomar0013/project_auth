import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LogIn from './pages/LogIn';
import Home from './pages/home';

function App() {
    return (
        <Router>


                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/messages" element={<Home />} />
                </Routes>

        </Router>
    );
}

export default App;