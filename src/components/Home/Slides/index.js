import React, { Component } from "react";
import { Transition, animated } from "react-spring";

import WindowOptions from "./img/options.svg";
import ContentsImage from "./img/contents.png";
import ContentsImageRetina from "./img/contents@2x.png";
import ContentsImageStats from "./img/contents-stats.png";
import ContentsImageStatsRetina from "./img/contents-stats@2x.png";

import "./style.css";

const slides = [
  style => (
    <animated.div style={style}>
      <img
        alt="Dashboard latest design screen"
        src={ContentsImage}
        srcset={`${ContentsImageRetina} 2x`}
      />
    </animated.div>
  ),
  style => (
    <animated.div style={style}>
      <img
        alt="Dashboard stats screen"
        src={ContentsImageStats}
        srcset={`${ContentsImageStatsRetina} 2x`}
      />
    </animated.div>
  )
];

class Slides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  componentWillMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => {
    clearInterval(this.timer);
  };

  setTimer = () => {
    this.timer = setInterval(this.nextSlide, 6 * 1000);
  };

  nextSlide = () => {
    var nextSlide = this.state.index + 1;
    var totalSlides = slides.length;

    if (nextSlide > totalSlides - 1) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: nextSlide });
    }
  };

  render() {
    return (
      <div className="Home-preview ">
        <div className="Home-preview-navbar">
          <img src={WindowOptions} alt="Mac Options Items" />
        </div>
        <div className="Home-preview-screen">
          <div className="Home-preview-image-container">
            <Transition
              native
              from={{ opacity: 0, transform: "translate3d(100%,0,0)" }}
              enter={{ opacity: 1, transform: "translate3d(0%,0,0)" }}
              leave={{ opacity: 0, transform: "translate3d(-50%,0,0)" }}
            >
              {slides[this.state.index]}
            </Transition>
          </div>
        </div>
      </div>
    );
  }
}

export default Slides;
