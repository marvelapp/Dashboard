import React, { Component } from "react";
import PropTypes from "prop-types";

import LeftAlignedIcon from "./LeftAlignedIcon";
import RightAlignedIcon from "./RightAlignedIcon";

import "./style.css";

class ArrowButton extends Component {
  render() {
    const { isRight, onClick } = this.props;
    return (
      <div onClick={onClick}>
        <div className="ArrowButton">
          <div className="ArrowButton-icon">
            {isRight ? RightAlignedIcon : LeftAlignedIcon}
          </div>
        </div>
      </div>
    );
  }
}

ArrowButton.defaultProps = {
  isRight: false,
  onClick: undefined
};

ArrowButton.propTypes = {
  isRight: PropTypes.bool,
  onClick: PropTypes.func
};

export default ArrowButton;
