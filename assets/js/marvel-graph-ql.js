class MarvelGraphQL {

      constructor(clientId, scopes, state) {
        this.marvelUrl = 'https://marvelapp.com/';
        this.clientId = clientId;
        this.state = state;
        this.request = this.request.bind(this)
      }

      // Auth
  		// ------------------------------------------------------------
  		// Create your application on marvelapp.com/oauth/applications/
  		// This example uses:
  		// Client Type: confidential
  		// Authorization Grant Type: authorization-code


  		authorizeUrl(){

  		  var params = jQuery.param({
  		    state: this.state,
  		    client_id: this.clientId,
  		    response_type: "token",
  		    scope: this.scopes
  		  });

  		  var url = this.marvelUrl + "oauth/authorize/?" + params
  		  return url

  		}

  		// GraphQL
  		// ------------------------------------------------------------
  		// Test your query here: https://marvelapp.com/graphql

  		request(query){

  		  return $.ajax({
  		      method: "POST",
  		      url: this.marvelUrl + "graphql/",
  		      data: JSON.stringify({ "query": query}),
  		      headers: {
  		          'Authorization':'Bearer ' + localStorage['accessToken'],
  		      },
  		      contentType: "application/json",
  		      crossDomain:true
  		  });

  		}

  		companyProjects(){

  		  var query = `
  		      query {
  		          user {
  		            email
  		            username
  		            company{
  		              projects(first: 20) {
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
  		      }
  		  `;

  		  return this.request(query);

  		}

  		personalProjects(){

  		  var query = `
  		      query {
  		          user {
  		            email
  		            username
  		            projects(first: 20) {
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


  		project(pk){

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
