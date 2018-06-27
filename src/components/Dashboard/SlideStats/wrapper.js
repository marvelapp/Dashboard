import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import Loading from "../Loading";
import Error from "../Error";
import Footer from "../Footer";

import Particles from "../../Particles";

import "./style.css";

class LastDesignsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.refetch = this.refetch.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.refetch, 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  refetch() {
    this.props.data.refetch();
  }

  removeDuplicateProjects(projects) {
    var newProjects = [];
    projects.forEach(function(project) {
      if (newProjects.some(e => e.node.pk === project.node.pk) === false) {
        newProjects.push(project);
      }
    });
    return newProjects;
  }

  projectsThisMonth(projects) {
    const projectsPast30Days = projects.filter(function(project) {
      const modifiedDate = moment(project.node.modifiedAt);
      const monthAgo = moment().subtract(30, "days");
      return modifiedDate > monthAgo;
    });

    return projectsPast30Days;
  }

  render() {
    const { user, error, loading } = this.props.data;

    if (error) {
      return <Error>Something went wrong retieving your stats...</Error>;
    }

    if (loading) {
      return <Loading />;
    }

    var projects = user.projects.edges;
    var peopleCount = 1;

    if (user.company && user.company.edges !== null) {
      const companyProjects = user.company.projects.edges;
      projects = [...projects, ...companyProjects];
    }

    if (user.company && user.company.members.edges !== null) {
      peopleCount = user.company.members.edges.length;
    }

    const projectsWithoutDuplicates = this.removeDuplicateProjects(projects);
    const projectThisMonth = this.projectsThisMonth(projectsWithoutDuplicates)
      .length;

    return (
      <div className="SlideStats">
        <div className="SlideStats-content">
          <Particles />
          <Footer isLight />
          <div className="SlideStats-stats">
            <div>
              <div className="SlideStats-count">{peopleCount}</div>
              <div className="SlideStats-count-description">Total people</div>
            </div>
            <div>
              <div className="SlideStats-count">{projectThisMonth}</div>
              <div className="SlideStats-count-description">
                Active projects
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LastDesignsWrapper.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    user: PropTypes.object
  }).isRequired
};

export default LastDesignsWrapper;
