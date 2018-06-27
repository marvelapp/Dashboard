import React, { Component } from "react";
import PropTypes from "prop-types";

import "./style.css";

class Image extends Component {
  render() {
    return (
      <div className="LastDesigns-container">
        <div className="LastDesigns-image-container">
          <img
            className="LastDesigns-image"
            alt="prototype preview"
            src={this.props.imageUrl}
          />
        </div>
        <div className="LastDesigns-footer">{this.props.fileName}</div>
      </div>
    );
  }
}

Image.propTypes = {
  imageUrl: PropTypes.string,
  fileName: PropTypes.string
};

export default Image;
