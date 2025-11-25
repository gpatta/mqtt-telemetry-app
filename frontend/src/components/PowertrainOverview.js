import React from 'react';
import '../styles/PowertrainOverview.css';

const PowertrainOverview = ({ deviceData }) => {
    return (
        <div className="PowertrainOverview">

            <p>Powertrain Overview</p>

            <div className="BatteryBox">
                <p>Battery</p>
                <div className="BatteryData">
                    <p>Voltage: {deviceData?.bt?.v} V</p>
                    <p>Current: {deviceData?.bt?.c} A</p>
                    <p>Temperature: {deviceData?.bt?.t} °C</p>
                    <p>SOC: {deviceData?.bt?.s} %</p>
                    <p>Anomaly: {deviceData?.bt?.a}</p>
                </div>
            </div>

            <div className="MCBoxes">
                <div className="MCBox"></div>
                <div className="MCBox"></div>
            </div>

            <div className="MotorBoxes">
                <div className="MotorBox"></div>
                <div className="MotorBox"></div>
            </div>

        </div>
    );
};

export default PowertrainOverview;
