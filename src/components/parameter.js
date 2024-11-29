import React, { useState, useEffect } from 'react';

// Components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NotifSvg from '../assets/svg/notif.svg';
import History from './history';

// API
import { getData } from '../api/data';

const ParameterTrends = () => {
  const [parameter, setParameter] = useState('temp');
  const [range, setRange] = useState('daily');
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHistory, setIsHistory] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(parameter, range, startDate, endDate);
      if (response.status === 'success') {
        const formattedData = response.data.map(item => ({
          name: new Date(item.created_at).toLocaleString('en-US', {
            month: 'long', // Full month name (e.g., "November")
            day: 'numeric', // Day of the month (e.g., 15)
            year: 'numeric', // Full year (e.g., 2024)
            hour: 'numeric', // Hour (e.g., 1)
            minute: 'numeric', // Minutes (e.g., 43)
            hour12: true, // Use 12-hour clock format
          }),
          value: item[parameter]
        }));
        setChartData(formattedData);
      } else {
        console.error(response.message);
      }
    };

    fetchData();
  }, [parameter, range, startDate, endDate]);

  const handleParameterChange = (e) => {
    setParameter(e.target.value);
    setStartDate('');  
    setEndDate('');    
  };

  const handleRangeChange = (e) => {
    setRange(e.target.value);
    setStartDate(''); 
    setEndDate('');   
  };

  const handleHistory = () => {
    setIsHistory(true);
  }

  const closeHistory = () => {
    setIsHistory(false);
  }

  return (
    <div className="trends">
      <div className="trends-header">
        <h3>Parameter Trends</h3>
        <div className="filters">
          <select value={parameter} onChange={handleParameterChange}>
            <option value="temp">Temperature</option>
            <option value="ph">pH</option>
            <option value="do">Dissolved Oxygen</option>
            <option value="ammonia">Ammonia</option>
          </select>
          <select value={range} onChange={handleRangeChange}>
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input 
            type="date" 
            id="start_date" 
            name="start_date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          <input 
            type="date" 
            id="end_date" 
            name="end_date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
          <button
            onClick={handleHistory}
          >
            <img src={NotifSvg}/>
          </button>
        </div>
      </div>

      <div className="chart">
        <ResponsiveContainer className='canvas'>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#1f2d3c" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isHistory && 
        <History
          close={closeHistory}
        />
      }
    </div>
  );
};

export default ParameterTrends;
