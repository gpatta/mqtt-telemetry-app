import React from 'react';
import Card from './Card';
import '../styles/CardContainer.css';

const CardContainer = ({ devices, openModal }) => {
    return (
        <div className="CardContainer">
            {devices.map((device, index) => (
                <Card 
                    key={index}
                    // logo={}
                    device={device}
                    onClick={() => openModal(device)}
                />
            ))}
        </div>
    );
};

export default CardContainer;