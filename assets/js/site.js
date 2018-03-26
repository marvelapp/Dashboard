
// Marvel GraphQL
// ------------------------------------------------------------
// This is the class which handles all the requests...
// If you're new to Marvel's API this is likely the place where
// you want to start.

var marvelGraphQL = new MarvelGraphQL("PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF", "projects:read user:read company.projects:read company:read")

// Start (jQuery)
// ------------------------------------------------------------
// To keep it super easy we use jQuery for this little app...

$(document).ready(function(){

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

		  var accessToken = dictionary["access_token"];

		  // No token in url
		  if (accessToken == null){
		    return
		  }

		  // Check if the state is the same
		  if (dictionary["state"] != marvelGraphQL.state()){
		    console.log("State is not the same, therefore we can't authenticate...")
		    return
		  }

		  // Store token in session for later use...
		  localStorage['accessToken'] = accessToken

		  // Remove hash from the url, we don't want to keep that in there...
		  history.pushState("", document.title, window.location.href.replace(/\#(.+)/, '').replace(/http(s?)\:\/\/([^\/]+)/, '') )

		  showLoader()
		  setupTimer()
		  findLastUpdateImages()

		}

		function getParams(url, k){
		 var p={};
		 url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
		 return k?p[k]:p;
		}

		// States
		// ------------------------------------------------------------

		function showLoggedIn(){
		  $('#loggedIn').removeClass("hidden");
		  $('#loggedOut').addClass("hidden");
		  $('#loader').addClass("hidden");
		  $('#error').addClass("hidden");
		}

		function showLoader(){
		  $('#loggedIn').addClass("hidden");
		  $('#loggedOut').addClass("hidden");
		  $('#loader').removeClass("hidden");
		  $('#error').removeClass("hidden");
		}

		function showError(message){
		  $('#error').removeClass("hidden");
		  $('#error p').html(message);
		}

		function showLoggedOut(){
		  $('#loggedIn').addClass("hidden");
		  $('#loggedOut').removeClass("hidden");
		  $('#loader').addClass("hidden");
		  $('#error').addClass("hidden");
		  clearInterval(timer);
		}

		// Design
		// ------------------------------------------------------------

		$('#connectMarvelButton').attr("href", marvelGraphQL.authorizeUrl())

		// Actions
		// ------------------------------------------------------------

		$('a[href="#logout"]').click(function(event){
		  logout()
		  event.stopPropagation();
		});

		// Start
		// ------------------------------------------------------------

		if (localStorage['accessToken'] === undefined){
		  showLoggedOut()
			console.log("logged out")
		} else {
		  showLoader()
		  setupTimer()
		  findLastUpdateImages()
		}

		checkForTokenInUrl()

	});
