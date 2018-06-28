import React, { Component } from "react";
import GitHubIcon from "./icon";

import "./style.css";

class GitHub extends Component {
  render() {
    return (
      <div className="GitHub">
        <div className="GitHub-content">
          <GitHubIcon />
          <h2 className="GitHub-title">
            Sharing is caring, Dashboard is Open Source
          </h2>
          <p>
            Go grab the code and learn how to use the Marvel API or add new
            features to it….
          </p>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=marvelapp&repo=Dashboard&type=star&size=large"
            title="GitHub Star Button"
            frameborder="0"
            scrolling="0"
            width="80px"
            height="30px"
          />
        </div>
      </div>
    );
  }
}

export default GitHub;
