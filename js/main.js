
$(function() {

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

  // Check if the state is the same

  if (dictionary["state"] != state()){
    console.log("State is not the same, therefore we can't authenticate...")
    return
  }

  const accessToken = dictionary["access_token"];

  // Store token in session for later use...
  localStorage['accessToken'] = accessToken

  // Remove hash from the url, we don't want to keep that in there...
  history.pushState("", document.title, window.location.href.replace(/\#(.+)/, '').replace(/http(s?)\:\/\/([^\/]+)/, '') )

  showLoggedIn()

}

// GraphQL
// ------------------------------------------------------------
// Test your query here: https://marvelapp.com/graphql

function projects(){

  // To keep it clean we stored the graphql query in a different file
  jQuery.get('graphql/projects.txt', function(data) {

    // Query JSON
    $.ajax({
         method: "POST",
              url: marvelUrl + "graphql/",
              data: JSON.stringify({ "query": data}),
              headers: {
                  'Authorization':'Bearer ' + localStorage['accessToken'],
              },
              contentType: "application/json",
              crossDomain:true,
              success: function(data) {
                   showLastUpdatedProjects(data)
              },
              error: function(err) {
                   logout()
              }
    });

  });

}

function showLastUpdatedProjects(projectJson){

  // Marvel sorts projects already by last updated...
  var projects = projectJson["data"]["user"]["projects"]["edges"]

  // Only first 3 projects
  projects = projects.slice(0, 3)

  // Empty
  $('#lastUpdated').html("");

  $.each(projects, function(i, project) {

    var image = project["node"]["images"]["edges"][0]

    // Not all projects have images
    if (image){

      const width = image["node"]["width"]
      const height = image["node"]["height"]

      const img = "<div class='flexItem'><img class='imageSlide' src='" + image["node"]["url"] + "'></div>"

      $('#lastUpdated').append(img)

    }

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
  timer = setInterval(projects, 60000);
  projects();

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
