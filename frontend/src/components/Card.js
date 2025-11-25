import React from 'react';
import '../styles/Card.css';

const Card = ({ logo, device, onClick, style }) => {

    let dateStr;

    try {
        const date = new Date(device?.payload?.dt);
        dateStr = date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        dateStr = 'Date N/A';
    }

    return (
        <div className={`Card ${style}`} onClick={onClick}>
            <div className="CardHeader">
                {/* <img src= /> */}
                <img src={logo} />
                <h2>{device?.owner || 'owner N/A'}</h2>
            </div>
            <h3>{device?.device_id || 'device N/A'}</h3>
            <p>{dateStr} - {device?.payload?.bt?.v || 'N/A'}</p>
        </div>
    );
};

export default Card;