import React, { Component } from "react";
import PropTypes from "prop-types";

import MarvelLogo from "../MarvelLogo";

import "./style.css";

class Footer extends Component {
  render() {
    return (
      <div className="Header-header">
        <MarvelLogo {...this.props} />
      </div>
    );
  }
}

Footer.defaultProps = {
  isLight: false
};

Footer.propTypes = {
  isLight: PropTypes.bool
};

export default Footer;
