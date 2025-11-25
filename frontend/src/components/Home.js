import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/variables.css';
import '../styles/Home.css';
import Footer from './Footer';

const Home = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className="Home">
            <div className="HomeContainer">
                <h1>MQTT Telemetry App</h1>
                <p>Welcome to the MQTT Telemetry Dashboard</p>
                <button className="LoginButton" onClick={handleClick}>Login</button>
            </div>
            <Footer />
        </div>
    );
};

export default Home;