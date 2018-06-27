import React, { Component } from "react";
import PropTypes from "prop-types";

import "./style.css";

class Modal extends Component {
  render() {
    return (
      <div className="Modal" onClick={this.props.onClick}>
        <div className="Modal-container">
          <div className="Modal-image-container">
            <img
              className="Modal-image"
              alt="prototype preview"
              src={this.props.imageUrl}
            />
          </div>
          <div className="Modal-footer">{this.props.fileName}</div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  imageUrl: PropTypes.string,
  fileName: PropTypes.string,
  onClick: PropTypes.func
};

export default Modal;
