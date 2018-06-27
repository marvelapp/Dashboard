import React, { Component } from "react";
import MarvelLogo from "./marvel-logo.svg";
import "./style.css";

class IntegrationBadge extends Component {
  constructor(props) {
    super(props);
    this.openDevelopers = this.openDevelopers.bind(this);
  }

  openDevelopers() {
    window.open("https://marvelapp.com/developers");
  }

  render() {
    return (
      <div onClick={this.openDevelopers} className="IntegrationBadge">
        <div>a</div>
        <div>
          <img
            alt="Marvel Logo"
            className="IntegrationBadge-marvel-logo"
            src={MarvelLogo}
          />
        </div>
        <div>integration</div>
      </div>
    );
  }
}

export default IntegrationBadge;
