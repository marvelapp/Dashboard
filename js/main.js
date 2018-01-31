
$(function() {

// Constants

const marvelUrl = "https://marvelapp.com/"
const clientId = "PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF"

// Auth

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

function parseAuthCode(url, state){

 if (state == getParams(url,"state")){
   console.log("Your state isn't identical")
   return nil
 }

 return getSearchParams(url, "code")

}

function checkForTokenInUrl(){

  // No Hash in the url
  // eg: http://helloworld?hello

  if (window.location.hash == null){
    return
  }

  // No Hash in the url
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
// Test your query at: https://marvelapp.com/graphql

function projects(){

  // To keep it clean we stored the graphql query in a different file
  jQuery.get('graphql/projects.txt', function(data) {

    // Query JSON
    $.ajax({
         method: "POST",
              url: 'https://joe_marvelapp_pie.ngrok.io/',
              data: JSON.stringify({ "query": data}),
              headers: {
                  'Authorization':'Bearer ' + localStorage['accessToken'],
              },
              contentType: "application/json",
              crossDomain:true,
              success: function(data) {
                   console.log('data',data);
              },
              error: function(err) {
                   console.log(err);
              }
    });

  });

}

// Helpers

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
  projects();
}

function showLoggedOut(){
  $('#loggedOut').show();
  $('#loggedIn').hide();
}

// Design

$('#connectMarvelButton').attr("href", authorizeUrl("projects:read"))

// Actions

$('a[href="#logout"]').click(function(event){
  logout()
  event.stopPropagation();
});

// Start

checkForTokenInUrl()

if (localStorage['accessToken'] === undefined){
  showLoggedOut()
} else {
  showLoggedIn()
}

});
