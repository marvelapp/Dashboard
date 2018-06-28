import React, { Component } from "react";

import DashboardOnAScreenImage from "./img/dashboard-on-a-screen.png";
import DashboardOnAScreenImage2x from "./img/dashboard-on-a-screen@2x.png";

import ChromecastDongleImage from "./img/chromecast-dongle.png";
import ChromecastDongleImage2x from "./img/chromecast-dongle@2x.png";

import "./style.css";

class Devices extends Component {
  render() {
    return (
      <div className="Home-devices">
        <div className="Home-devices-left-column">
          <h2>
            Works on every device with a web browser, including Chromecast
          </h2>
          <p>
            Dashboard displays the latest designs uploaded to Marvel by members
            of your team.
          </p>
        </div>
        <div className="Home-devices-right-column">
          <img
            className="Home-devices-dashboard-image"
            src={DashboardOnAScreenImage}
            alt="Dashboard on a display"
            srcSet={` ${DashboardOnAScreenImage2x} 2x`}
          />
          <img
            className="Home-devices-chromecast-dongle"
            src={ChromecastDongleImage}
            alt="Example of chromecast behind a tv"
            srcSet={` ${ChromecastDongleImage2x} 2x`}
          />
        </div>
      </div>
    );
  }
}

export default Devices;
