import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Masonry from "react-responsive-masonry";
import { animateScroll as scroll } from "react-scroll";

import Loading from "../Loading";
import MansoryImage from "./MansoryImage";
import Error from "../Error";

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

  scrollToBottom() {
    const options = {
      duration: 25000,
      smooth: true,
      containerId: "scroll-container"
    };
    scroll.scrollToBottom(options);
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

  orderByLastModified(projects) {
    var projectsSorted = projects.sort(function(project1, project2) {
      var dateA = moment(project1.node.modifiedAt);
      var dateB = moment(project2.node.modifiedAt);
      return dateA < dateB;
    });

    return projectsSorted;
  }

  imagesInProjects(projects) {
    var images = [];
    projects.forEach(function(project) {
      project.node.screens.edges.forEach(function(image) {
        if (image.node.content == null) {
          return;
        }

        if (image.node.content.url == null) {
          return;
        }

        if (
          image.node.content.url.indexOf(
            "marvelapp.com/static/assets/images/onboarding"
          ) !== -1
        ) {
          return;
        }

        images.push(image);
      });
    });

    return images;
  }

  orderImagesByModified(images) {
    var imagesSorted = images.sort(function(image1, image2) {
      var dateA = moment(image1.node.modifiedAt);
      var dateB = moment(image2.node.modifiedAt);
      return dateA < dateB;
    });

    return imagesSorted;
  }

  render() {
    const { user, error, loading } = this.props.data;

    if (error) {
      return (
        <Error>Something went wrong retrieving your latest images...</Error>
      );
    }

    if (loading) {
      return <Loading />;
    }

    if (user.projects === null) {
      return <Error>Your account has currently no projects.</Error>;
    }

    var projects = user.projects.edges;

    if (user.company && user.company.edges !== null) {
      const companyProjects = user.company.projects.edges;
      projects = [...projects, ...companyProjects];
    }

    const projectsWithoutDuplicates = this.removeDuplicateProjects(projects);
    const projectsOrdered = this.orderByLastModified(projectsWithoutDuplicates);

    // Digest Images
    const images = this.imagesInProjects(projectsOrdered);
    const imagesOrdered = this.orderImagesByModified(images);

    if (imagesOrdered.length === 0) {
      return <Error>None of your projects has any images.</Error>;
    }

    return (
      <div className="LastDesignsMansory" id="scroll-container">
        <div className="LastDesignsMansory-title">Latest screens</div>
        <Masonry columnsCount={4} gutter="20px">
          {imagesOrdered
            .slice(0, 20)
            .map((image, i) => (
              <MansoryImage
                key={i}
                imageUrl={image.node.content.url}
                fileName={image.node.content.filename}
              />
            ))}
        </Masonry>
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
