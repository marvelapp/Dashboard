
$( document ).ready(function() {

// Constants
// ------------------------------------------------------------

const marvelUrl = "https://marvelapp.com/"
const clientId = "PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF"

// Possible values: user:read, projects:read, projects:write, projects:delete
// Comma seperated
const scopes = "projects:read user:read"

// Timer
// ------------------------------------------------------------
// Used for updating the projects every 60 seoncds

var timer;

// Auth
// ------------------------------------------------------------
// Create your application on marvelapp.com/oauth/applications/
// This example uses:
// Client Type: confidential
// Authorization Grant Type: authorization-code

function state(){

  if (localStorage['state'] === undefined){
    localStorage['state'] = Math.random().toString(36).substr(2, 16)
  }

  return localStorage['state']

}

function authorizeUrl(scope){

  var params = jQuery.param({
    state: state(),
    client_id: clientId,
    response_type: "token",
    scope: scope
  });

  var url = marvelUrl + "oauth/authorize/?" + params
  return url

}

function checkForTokenInUrl(){

  // No Hash in the url
  // eg: http://helloworld?hello

  if (window.location.hash == null){
    return
  }

  // Hash in the url
  // eg: http://helloworld#access_token=1234

  var hashData = window.location.hash;
  var parameters = hashData.substr(1, window.location.hash.length)
  var parametersSplit = parameters.split('&')
  var dictionary = parametersSplit.reduce(function(accumulator, currentValue) {
      var bits = currentValue.split('=');
      accumulator[bits[0]] = bits[1];
      return accumulator
    }, {}
  )

  const accessToken = dictionary["access_token"];

  // No token in url
  if (accessToken == null){
    return
  }

  // Check if the state is the same
  if (dictionary["state"] != state()){
    console.log("State is not the same, therefore we can't authenticate...")
    return
  }

  // Store token in session for later use...
  localStorage['accessToken'] = accessToken

  // Remove hash from the url, we don't want to keep that in there...
  history.pushState("", document.title, window.location.href.replace(/\#(.+)/, '').replace(/http(s?)\:\/\/([^\/]+)/, '') )

  showLoggedIn()

}

// GraphQL
// ------------------------------------------------------------
// Test your query here: https://marvelapp.com/graphql

function graphQL(query){

  return $.ajax({
      method: "POST",
      url: marvelUrl + "graphql/",
      data: JSON.stringify({ "query": query}),
      headers: {
          'Authorization':'Bearer ' + localStorage['accessToken'],
      },
      contentType: "application/json",
      crossDomain:true
  });

}

function projects(){

  const query = `
      query {
        user {
          projects(first: 3) {
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

  return graphQL(query);

}

function project(pk){

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

  return graphQL(query);

}

// Find the last updated images
// ------------------------------------------------------------

function findLastUpdateImages(){

  last3UpdatedProjectsPKs(function(PKs) {

    findImagesForProjectsWithPk(PKs, function(images) {

      // Sort by date
      var imagesSorted = images.sort(function(a, b) {
          var dateA = Date.parse(a["modifiedAt"])
          var dateB = Date.parse(b["modifiedAt"])
          return dateB.compareTo(dateA)
      });

      // Remove the ones without content
      var newArray = imagesSorted.filter(function (image) {
          if (image["content"]["url"]){
            return true
          }
          return false
      });

      showLastUpdatedImages(images)

    });

  });

}

function last3UpdatedProjectsPKs(callback){

  $.when(
    projects()
  ).then(function(projectJson) {

    // All images found throughout projects
    var projectPKs = []

    // Marvel sorts projects already by last updated...
    var projects = projectJson["data"]["user"]["projects"]["edges"]

    // Only first 3 projects
    projects = projects.slice(0, 3)

    $.each(projects, function(i, project) {

      var pk = project["node"]["pk"]

      if (pk){
        projectPKs.push(pk);
      }

    });

    callback(projectPKs)

  });

}

function findImagesForProjectsWithPk(PKs, callback){

    // All images found throughout projects
    var images = []

    // All calls
    var deferreds = [];

    $.each(PKs, function(i, pk) {

        deferreds.push(

          project(pk).then(function(result) {

            var projectName = result["data"]["project"]["name"]
            var nodes = result["data"]["project"]["screens"]["edges"]

            $.each(nodes, function(i, node) {

              var dictionary = node["node"];
              dictionary["projectName"] = projectName
              images.push(dictionary)

            });

          })

        );

    })

    $.when.apply($, deferreds).then(function() {
      callback(images)
    });

}

function showLastUpdatedImages(images){

  // Empty
  $('#lastUpdated').html("");

  const first3Images = images.slice(0, 3);

  $.each(first3Images, function(i, image) {

      const img = `
        <div class='flexItem'>
          <div class='centerBox'>
            <div class='image'>
              <img src='${image["content"]["url"]}'>
            </div>
            <div class='footer'>${image["projectName"]}</div>
          </div>
        </div>
      `
      $('#lastUpdated').append(img)

  });

}

// Helpers
// ------------------------------------------------------------

function logout(){
  localStorage.removeItem("accessToken")
  showLoggedOut()
}

function getParams(url, k){
 var p={};
 url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
 return k?p[k]:p;
}

function showLoggedIn(){
  $('#loggedIn').show();
  $('#loggedOut').hide();

  // Update projects every 60 seconds
  clearInterval(timer);
  timer = setInterval(findLastUpdateImages, 60000);
  findLastUpdateImages()

}

function showLoggedOut(){
  $('#loggedOut').show();
  $('#loggedIn').hide();
  clearInterval(timer);
}

// Design
// ------------------------------------------------------------

$('#connectMarvelButton').attr("href", authorizeUrl(scopes))

// Actions
// ------------------------------------------------------------

$('a[href="#logout"]').click(function(event){
  logout()
  event.stopPropagation();
});

// Start
// ------------------------------------------------------------

checkForTokenInUrl()

if (localStorage['accessToken'] === undefined){
  showLoggedOut()
} else {
  showLoggedIn()
}

});
