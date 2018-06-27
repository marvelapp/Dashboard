import React, { Component } from "react";
import "./style.css";

class Button extends Component {
  render() {
    return (
      <div onClick={this.props.onClick} className="Button">
        {this.props.children}
      </div>
    );
  }
}

export default Button;
