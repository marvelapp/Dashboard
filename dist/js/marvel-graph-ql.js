class MarvelGraphQL {
  constructor(clientId, scopes) {
    this.marvelUrl = "https://marvelapp.com/";
    this.clientId = clientId;
    this.state = this.state.bind(this);
    this.scopes = scopes;
    this.request = this.request.bind(this);

    this.localStorageAccessTokenKey = "marvel.accessToken";
  }

  // Auth
  // ------------------------------------------------------------
  // Create your application on marvelapp.com/oauth/applications/
  // This example uses:
  // Client Type: public
  // Authorization Grant Type: implicit

  authorizeUrl(callback) {
    const params = jQuery.param({
      state: this.state,
      client_id: this.clientId,
      response_type: "token",
      scope: this.scopes
    });

    return this.marvelUrl + "oauth/authorize/?" + params;
  }

  removeToken() {
    localStorage.removeItem(this.localStorageAccessTokenKey);
  }

  token() {
    return localStorage[this.localStorageAccessTokenKey];
  }

  tokenCheckValid(callback) {}

  saveToken(token) {
    localStorage[this.localStorageAccessTokenKey] = token;
  }

  // State
  // ------------------------------------------------------------
  // This is used to check if the request matches the original
  // request.

  state() {
    if (localStorage["state"] === undefined) {
      localStorage["state"] = Math.random()
        .toString(36)
        .substr(2, 16);
    }

    return localStorage["state"];
  }

  // GraphQL
  // ------------------------------------------------------------
  // Test your query here: https://marvelapp.com/graphql

  request(query) {
    return $.ajax({
      method: "POST",
      url: this.marvelUrl + "graphql/",
      data: JSON.stringify({ query: query }),
      headers: {
        Authorization: "Bearer " + localStorage[this.localStorageAccessTokenKey]
      },
      contentType: "application/json",
      crossDomain: true
    });
  }

  projects() {
    var query = `
        query {
          user {
            email
            username
            company {
              projects(first: 5) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    pk
                    lastModified
                    name
                  }
                }
              }
            }
            projects(first: 5) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  pk
                  lastModified
                  name
                }
              }
            }
          }
        }
  	`;
    return this.request(query);
  }

  project(pk) {
    var query = `
  		      fragment image on ImageScreen {
  		        filename
  		        url
  		        height
  		        width
  		      }

  		      query {
  		        project(pk: ${pk}) {
  		          name
  		          screens(first: 100) {
  		            edges {
  		              node {
  		                name
  		                modifiedAt
  		                content {
  		                  __typename
  		                  ... image
  		                }
  		              }
  		            }
  		          }
  		        }
  		      }
  		  `;

    return this.request(query);
  }
}
