import React from 'react'
import Sidebar from '../components/Sidebar'
import FetchData from '../components/FetchData'


export default function Home() {

  return (
    <div>
      <div className="app">
        <div className="side-bar">
          <Sidebar />
        </div>
        <div className="content">
          <div className="search"></div>
          <div className="city">city</div>
          <div className="daily-forecast">daily</div>
          <div className="air-conditions">
            <FetchData />
          </div>
        </div>
        <div className="forecast">forecast</div>
      </div>
    </div>
  );
}
