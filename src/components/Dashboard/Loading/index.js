import React, { Component } from "react";

import "./style.css";

class Loading extends Component {
  render() {
    return (
      <div className="Loader">
        <div className="Loader-center">
          <div className="Loader-spinner" />
        </div>
      </div>
    );
  }
}

export default Loading;
