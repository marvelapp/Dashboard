import React, { Component } from "react";

import "./style.css";

class Error extends Component {
  render() {
    return (
      <div className="Error">
        <div className="Error-center">
          <p>{this.props.children}</p>
        </div>
      </div>
    );
  }
}

export default Error;
