import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';
import PowertrainOverview from './PowertrainOverview';
import ChartView from './ChartView';

const Modal = ({ device, closeModal }) => {
    
    const [deviceData, setDeviceData] = useState([]);
    const [activePage, setActivePage] = useState("overview");

    // Fetch messages from the backend
    const fetchMessages = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_API_ALL_MESSAGES_URL + device.device_id);
            const data = await res.json();
            setDeviceData(data);
            console.log('Fetched all messages: ', data);
        } catch (err) {
            console.error('Failed to fetch messages: ', err);
        }
    };

    useEffect(() => {
        // Fetch messages every 5 seconds
        const intervalId = setInterval(fetchMessages, 1000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs only once (on mount)

    const renderContent = () => {
        switch (activePage) {
            case "overview":
                // console.log("Powertrain overview: ", deviceData[0]);
                return <PowertrainOverview deviceData={deviceData[0]?.payload} />
            case "charts":
                return <ChartView deviceData={deviceData} />
            case "raw":
                return <div style={{ height: '70vh', overflowY: 'scroll' }}>
                    <h3>Raw data content</h3>
                    <ol>
                        {deviceData.map((item, index) => (
                            <li key={index}>
                                <p>{item?.received_dt || 'N/A'} - {JSON.stringify(item?.payload || 'N/A', null, 2)}</p>
                            </li>
                        ))}
                    </ol>
                </div>;
            default:
                return null;
        }
    }

    
    return (
        <div className="Modal">
            <div className="ModalHeader" >
                {/* <img src= alt="Logo" /> */}
                {/* <h2>{device?.device_id}</h2> */}
                <h2>Device</h2>
                <button onClick={closeModal}>Close</button>
            </div>
            <div className="ModalTabs">
                <button
                    className={`${activePage === "overview" ? "active" : ""}`}
                    onClick={() => setActivePage("overview")}
                >
                    Overview
                </button>
                <button
                    className={`${activePage === "charts" ? "active" : ""}`}
                    onClick={() => setActivePage("charts")}
                >
                    Charts
                </button>
                <button
                    className={`${activePage === "raw" ? "active" : ""}`}
                    onClick={() => setActivePage("raw")}
                >
                    Raw
                </button>
            </div>
            <div className="ModalContent">
                {renderContent()}
                {/* <ul>
                    {deviceData.map((item, index) => (
                        <li key={index}>
                            <p>{item?.payload?.dt || 'N/A'} - {JSON.stringify(item?.payload || 'N/A', null, 2)}</p>
                        </li>
                    ))}
                </ul> */}
            </div>
        </div>
    );
};

export default Modal;