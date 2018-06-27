import gql from "graphql-tag";
import { graphql } from "react-apollo";

import LastDesignsWrapper from "./wrapper";

const ProjectQuery = gql`
  fragment image on ImageScreen {
    url
    filename
  }

  query {
    user {
      company {
        projects(first: 20) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              pk
              name
              modifiedAt
              screens(first: 5) {
                edges {
                  node {
                    modifiedAt
                    content {
                      __typename
                      ...image
                    }
                  }
                }
              }
            }
          }
        }
      }
      projects(first: 20) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            pk
            name
            modifiedAt
            screens(first: 5) {
              edges {
                node {
                  modifiedAt
                  content {
                    __typename
                    ...image
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const SlideLastDesigns = graphql(ProjectQuery)(LastDesignsWrapper);

export default SlideLastDesigns;
