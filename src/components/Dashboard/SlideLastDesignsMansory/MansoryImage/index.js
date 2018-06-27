import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";

import "./style.css";

class MansoryImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  close = () => {
    this.setState({
      modalOpen: false
    });
  };

  onClick = () => {
    this.setState({
      modalOpen: true
    });
  };

  render() {
    return (
      <div>
        <img
          className="MansoryImage"
          onClick={this.onClick}
          alt="prototype preview"
          src={this.props.imageUrl}
        />
        {this.state.modalOpen ? (
          <Modal
            imageUrl={this.props.imageUrl}
            fileName={this.props.fileName}
            onClick={this.close}
          />
        ) : null}
      </div>
    );
  }
}

MansoryImage.propTypes = {
  imageUrl: PropTypes.string,
  fileName: PropTypes.string
};

export default MansoryImage;
