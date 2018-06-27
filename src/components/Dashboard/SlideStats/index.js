import gql from "graphql-tag";
import { graphql } from "react-apollo";
import StatsWrapper from "./wrapper";

const StatsQuery = gql`
  query {
    user {
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
          }
        }
      }
      company {
        pk
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
            }
          }
        }
        members(first: 500) {
          edges {
            node {
              pk
            }
          }
        }
      }
    }
  }
`;

const SlideStats = graphql(StatsQuery)(StatsWrapper);

export default SlideStats;
