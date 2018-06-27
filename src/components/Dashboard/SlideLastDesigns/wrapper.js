import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import Loading from "../Loading";
import Error from "../Error";
import Footer from "../Footer";
import Image from "./image";
import Particles from "../../Particles";

import "./style.css";

class LastDesignsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.images = [];
    this.state = {
      index: 0
    };
  }

  componentDidMount() {
    this.timer = setInterval(this.refetch, 30 * 1000);
    this.animateTimer = setInterval(this.nextImage, 5 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.animateTimer);
  }

  refetch = () => {
    this.props.data.refetch();
  };

  nextImage = () => {
    var nextSlide = this.state.index + 1;
    var totalSlides = this.images.length;

    if (nextSlide > totalSlides - 1) {
      this.setState({ index: 0 });
    } else {
      this.setState({ index: nextSlide });
    }
  };

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

  userToImages(user) {
    if (user.projects === undefined) {
      return [];
    }

    var projects = user.projects.edges;

    if (user.company) {
      const companyProjects = user.company.projects.edges;
      projects = [...projects, ...companyProjects];
    }

    const projectsWithoutDuplicates = this.removeDuplicateProjects(projects);
    const projectsOrdered = this.orderByLastModified(projectsWithoutDuplicates);

    // Digest Images
    const images = this.imagesInProjects(projectsOrdered);
    const imagesOrdered = this.orderImagesByModified(images);

    return imagesOrdered.slice(0, 3);
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

    this.images = this.userToImages(user);

    if (this.images.length === 0) {
      return <Error>Your account has currently no images.</Error>;
    }

    const image = this.images[this.state.index];

    return (
      <div className="LastDesigns">
        <Image
          imageUrl={image.node.content.url}
          fileName={image.node.content.filename}
        />
        <Footer />
        <Particles />
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
