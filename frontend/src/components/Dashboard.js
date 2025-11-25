import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import Header from "./Header";
import CardContainer from "./CardContainer";
import Modal from "./Modal";
import Footer from "./Footer";
import '../styles/variables.css';
import '../styles/Dashboard.css';


const Dashboard = () => {

  const [data, setData] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch messages from the backend
  const fetchMessages = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_NEW_MESSAGES_URL);
      const data = await res.json();
      setData(data);
      console.log('Fetched messages: ', data);
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

  const auth = useAuth();

  const openModal = (device) => {
    console.log('Opening modal for device: ', device);
    setSelectedCard(device);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  return (
    <div className="Dashboard">
      <div className="DashboardContainer">
        <header className="DashboardHeader">
          <h1 className="DashboardTitle">MQTT Telemetry - {auth.user?.username} dashboard</h1>
          <button className="LogoutButton" onClick={auth.logout}>Logout</button>
        </header>

        {/* <div className="DashboardContent">
          <p>MQTT messages:</p>
          {data.map((item, index) => (
            <div className="MessageDiv" key={index}>
              <p>{item?.payload?.datetime || 'N/A'} - {JSON.stringify(item?.payload?.battery, null, 2) || 'N/A'}</p>
            </div>
          ))}
        </div> */}

        <CardContainer devices={data} openModal={openModal} />

        {isModalOpen && <Modal device={selectedCard} closeModal={closeModal} />}

      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
