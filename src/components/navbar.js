import React, { useEffect, useState } from "react";

// Assets
import Logo from '../assets/img/favicon.png';

function Navbar() {
  const [dateTime, setDateTime] = useState({
    time: "",
    date: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: true });
      const date = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setDateTime({ time, date });
    };

    // Update date and time immediately, then every second
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav>
        <div className="nav container">
          <div className="left">
            <img src={Logo} alt="Logo" />
            <div className="system-info">
              <div className="title">RAS FreshMonitor</div>
              <div className="span">Recirculating Aquaculture System</div>
            </div>
          </div>
          <div className="right">
            <div className="left-weather">
              <div className="date">{`${dateTime.time} ${dateTime.date}`}</div>
              <div className="place">Laguna, Philippines</div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
