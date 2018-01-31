
$(function() {

// Constants

const marvelUrl = "https://marvelapp.com/"
const clientId = "PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF"

// Calls

function authorizeUrl(scope){

  // Generate a random state
  const state = Math.random().toString(36).substr(2, 16)

  // Store the state, as we will need this later to check it matches when returning...
  localStorage['state'] = state

  var params = jQuery.param({
    state: state,
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

  if (dictionary["state"] != localStorage['state']){
    console.log("State is not the same, therefore we can't authenticate...")
    return
  }

  const accessToken = dictionary["access_token"];

  // Store token in session for later use...
  localStorage['accessToken'] = accessToken

  // Redirect to logged in page...
  document.location.href = "logged-in.html";

}

// Helpers

function getParams(url, k){
 var p={};
 url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
 return k?p[k]:p;
}

// Start

checkForTokenInUrl()

$('#connectMarvelButton').attr("href", authorizeUrl("user:read"))

});
