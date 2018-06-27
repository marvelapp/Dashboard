import React, { Component } from "react";
import IntegrationBadge from "../IntegrationBadge";
import Particles from "../Particles";
import Button from "../Button";
import Devices from "./Devices";
import GitHub from "./GitHub";
import Slides from "./Slides";
import { Link } from "react-router-dom";

import "./style.css";

class Home extends Component {
  render() {
    return (
      <div>
        <IntegrationBadge />

        <div className="Home-header">
          <div className="Home-logo" />
          <h1>Share what your design team is working on</h1>
          <p>
            Dashboard is a livestream of images uploaded to company projects in
            Marvel
          </p>
          <div className="Home-actions">
            <Link to="/oauth">
              <Button>Connect with Marvel</Button>
            </Link>
            <div className="Home-chrome-support">
              <div>Works great with:</div>
              <div className="Home-chrome-logo" />
            </div>
          </div>
        </div>
        <Particles />
        <Slides />
        <Devices />
        <GitHub />
      </div>
    );
  }
}

export default Home;
