// Assets
import TemperatureSvg from '../assets/svg/temperature.svg';
import PhSvg from '../assets/svg/ph.svg';
import DOSvg from '../assets/svg/do.svg';
import AmmoniaSvg from '../assets/svg/ammonia.svg';

import { useState, useEffect } from 'react';
import { getRecentData } from '../api/data';

const RecentData = () => {
  const [recentData, setRecentData] = useState({
    temp: { value: null, created_at: '' },
    do: { value: null, created_at: '' },
    ph: { value: null, created_at: '' },
    ammonia: { value: null, created_at: '' },
  });
  
  const fetchRecentData = async () => {
    const result = await getRecentData();
    if (result.status === 'success') {
      setRecentData(result.data); 
    } else {
      console.error(result.message); 
    }
  };

  useEffect(() => {
    fetchRecentData();
    const intervalId = setInterval(fetchRecentData, 900000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="recent-data">
      <div className="item">
        <div className="flex-data">
          <div>Temperature</div>
          <img src={TemperatureSvg} alt="Temperature" />
        </div>
        <div className="range">
          <div className="range-value">{recentData.temp?.value ?? 'Loading...'}</div>
          <div className="span">°C</div>
        </div>
        <div className="optimal">Optimal range: 22 - 28 °C</div>
      </div>

      <div className="item">
        <div className="flex-data">
          <div>pH</div>
          <img src={PhSvg} alt="pH" />
        </div>
        <div className="range">
          <div className="range-value">{recentData.ph?.value ?? 'Loading...'}</div>
          <div className="span"></div>
        </div>
        <div className="optimal">Optimal range: 6.5 - 8.5</div>
      </div>

      <div className="item">
        <div className="flex-data">
          <div>Dissolved Oxygen</div>
          <img src={DOSvg} alt="Dissolved Oxygen" />
        </div>
        <div className="range">
          <div className="range-value">{recentData.do?.value ?? 'Loading...'}</div>
          <div className="span">mg/L</div>
        </div>
        <div className="optimal">Optimal range: 6 - 9 mg/L</div>
      </div>

      <div className="item">
        <div className="flex-data">
          <div>Ammonia</div>
          <img src={AmmoniaSvg} alt="Ammonia" />
        </div>
        <div className="range">
          <div className="range-value">{recentData.ammonia?.value ?? 'Loading...'}</div>
          <div className="span">ppm</div>
        </div>
        <div className="optimal">Optimal range: 0.00 - 0.08 ppm</div>
      </div>
    </div>
  );
};

export default RecentData;
