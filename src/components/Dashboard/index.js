import React, { Component } from "react";
import { Transition, Spring, animated } from "react-spring";
import { Link } from "react-router-dom";
import IdleTimer from "react-idle-timer";

import SlideLastDesigns from "./SlideLastDesigns";
import SlideStats from "./SlideStats";
import SlideLastDesignsMansory from "./SlideLastDesignsMansory";
import ArrowButton from "./ArrowButton";

import "./style.css";

const pages = [
  style => (
    <animated.div style={{ ...style, height: "100vh", width: "100%" }}>
      <SlideStats />
    </animated.div>
  ),
  style => (
    <animated.div style={{ ...style, height: "100vh", width: "100%" }}>
      <SlideLastDesigns />
    </animated.div>
  ),
  style => (
    <animated.div style={{ ...style, height: "100vh", width: "100%" }}>
      <SlideLastDesignsMansory />
    </animated.div>
  )
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isIdle: false
    };
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => {
    clearInterval(this.timer);
  };

  setTimer = () => {
    this.timer = setInterval(this.nextSlide, 12 * 1000);
  };

  nextSlide = () => {
    var nextSlide = this.state.index + 1;
    var totalSlides = pages.length;

    if (nextSlide > totalSlides - 1) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: nextSlide });
    }
  };

  previousSlide = () => {
    var previousSlide = this.state.index - 1;
    var totalSlides = pages.length;

    if (previousSlide < 0) {
      this.setState({ index: totalSlides - 1 });
    } else {
      this.setState({ index: previousSlide });
    }
  };

  onActive = () => {
    this.setState({ isIdle: false });
    this.clearTimer();
  };

  onIdle = () => {
    this.setState({ isIdle: true });
    this.setTimer();
  };

  render() {
    return (
      <div className="Dashboard">
        <IdleTimer
          ref="idleTimer"
          activeAction={this.onActive}
          idleAction={this.onIdle}
          timeout={1000}
        />

        <Transition
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {pages[this.state.index]}
        </Transition>

        <Spring
          from={{ opacity: this.state.isIdle ? 1 : 0 }}
          to={{ opacity: this.state.isIdle ? 0 : 1 }}
        >
          {styles => (
            <div style={styles} className="Dashboard-hover-content">
              <div className="Dashboard-left-button">
                <ArrowButton onClick={this.previousSlide} />
              </div>
              <div className="Dashboard-right-button">
                <ArrowButton onClick={this.nextSlide} isRight />
              </div>
              <Link to="/signout">
                <div className="Dashboard-logout-link ">Logout</div>
              </Link>

              <div className="Dashboard-instructions">
                The dasboard auto starts when your mouse is inactive.
              </div>
            </div>
          )}
        </Spring>
      </div>
    );
  }
}

export default Dashboard;
