import React, { Component } from "react";
import CircleBlue from "./particle-circle-blue.svg";
import SquareBlue from "./particle-square-blue.svg";
import SquareRed from "./particle-square-red.svg";
import TriangleGreen from "./particle-triangle-green.svg";
import TriangleYellow from "./particle-triangle-yellow.svg";

import "./style.css";

class Particles extends Component {
  render() {
    return (
      <div className="Particles">
        <img
          className="Particles-circle-blue Particles-floating"
          src={CircleBlue}
          alt="Blue Circle"
        />
        <img
          className="Particles-square-blue Particles-floating"
          src={SquareBlue}
          alt="Blue Square"
        />
        <img
          className="Particles-square-red Particles-floating"
          src={SquareRed}
          alt="Red Square"
        />
        <img
          className="Particles-triangle-green Particles-floating"
          src={TriangleGreen}
          alt="Green Triangle"
        />
        <img
          className="Particles-triangle-yellow Particles-floating"
          src={TriangleYellow}
          alt="Yellow Triangle"
        />
      </div>
    );
  }
}

export default Particles;
