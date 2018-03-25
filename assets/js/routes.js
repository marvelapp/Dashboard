(function($) {
	$(document).ready(function(){

		// varants
		// ------------------------------------------------------------

		var marvelUrl = "https://marvelapp.com/";
		var clientId = "PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF";

		// Possible values: user:read, projects:read, projects:write, projects:delete
		// Comma seperated
		var scopes = "projects:read user:read company.projects:read company:read";

		// Errors
		var Error = {
		    NO_COMPANY : 1,
		    NO_PROJECTS : 2,
		    NO_IMAGES : 3,
		};

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

		  var accessToken = dictionary["access_token"];

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

		  showLoader()
		  setupTimer()
		  findLastUpdateImages()

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

		function companyProjects(){

		  var query = " \
		      query { \
		          user { \
		            email \
		            username \
		            company{ \
		              projects(first: 20) { \
		              pageInfo { \
		                hasNextPage \
		                endCursor \
		              } \
		              edges { \
		                node { \
		                  pk \
		                  lastModified \
		                  name \
		                } \
		              } \
		            } \
		          } \
		        } \
		      } \
		  ";

		  return graphQL(query);

		}

		function personalProjects(){

		  var query = " \
		      query { \
		          user { \
		            email \
		            username \
		            projects(first: 20) { \
		              pageInfo { \
		                hasNextPage \
		                endCursor \
		              } \
		              edges { \
		                node { \
		                  pk \
		                  lastModified \
		                  name \
		                } \
		              } \
		            } \
		        } \
		    } \
		  ";

		  return graphQL(query);

		}

		
		function project(pk){

		  var query = " \
		      fragment image on ImageScreen { \
		        filename \
		        url \
		        height \
		        width \
		      } \
					\
		      query { \
		        project(pk: ${pk}) { \
		          name \
		          screens(first: 100) { \
		            edges { \
		              node { \
		                name \
		                modifiedAt \
		                content { \
		                  __typename \
		                  ... image \
		                } \
		              } \
		            } \
		          } \
		        } \
		      } \
		  ";

		  return graphQL(query);

		}

		// Find the last updated images
		// ------------------------------------------------------------

		function findLastUpdateImages(){

		  lastCompanyProjectsPKs(function(PKs, error) {

		    // Check for errors
		    if (error == Error.NO_PROJECTS){
		      showError("No projects found in your Marvel account...");
		      return
		    } else if (error == Error.NO_COMPANY) {
		      showError("You have to be on a company plan to use this...");
		      return
		    }

		    findImagesForProjectsWithPk(PKs, function(images) {

		      // Sort by date
		      var imagesSorted = images.sort(function(a, b) {
		          var dateA = Date.parse(a["modifiedAt"])
		          var dateB = Date.parse(b["modifiedAt"])
		          return dateB.compareTo(dateA)
		      });

		      // Remove the ones without content and example images
		      var newArray = imagesSorted.filter(function (image) {

		          if (image["content"] == null){
		            return false
		          }

		          if (image["content"]["url"] == null){
		            return false
		          }

		          if(image["content"]["url"].indexOf("marvelapp.com/static/assets/images/onboarding") != -1){
		             return false
		          }

		          return true
		      });

		      if (newArray.length == 0){
		        showError("There are no images inside your projects.");
		        return
		      }

		      showImages(newArray)
		      showLoggedIn()

		    });

		  });

		}

		function lastCompanyProjectsPKs(callback, error){

		  $.when(
		    companyProjects()
		  ).then(function(projectJson) {

		    // All images found throughout projects
		    var projectPKs = []

		    // Marvel sorts projects already by last updated...
		    var company = projectJson["data"]["user"]["company"]

		    // Check if company exists
		    if (company == null){
		      callback(null, Error.NO_COMPANY)
		    }

		    var projects = company["projects"]["edges"]

		    // Check if there are projects
		    if (projects.length == 0){
		      callback(null, Error.NO_PROJECTS)
		    }

		    $.each(projects, function(i, project) {

		      var pk = project["node"]["pk"]

		      if (pk){
		        projectPKs.push(pk);
		      }

		    });

		    callback(projectPKs, null)

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

		function showImages(images){

		  // Empty
		  $('#lastUpdated').html("");

		  var first3Images = images.slice(0, 3);

		  $.each(first3Images, function(i, image) {

		      var img = ""
					img += "<div class='flexItem'>";
					img += "<div class='centerBox'>";
					img += "<div class='image'>";
					img += "<img src='" + image["content"]['url'] + "'>";
					img += "</div>";
					img += "<div class='footer'>" + image['projectName'] + "</div>";
					img += "</div>"
					img += "</div>"

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

		function setupTimer(){
		  // Update projects every 60 seconds
		  clearInterval(timer);
		  timer = setInterval(findLastUpdateImages, 60000);
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

		$('#connectMarvelButton').attr("href", authorizeUrl(scopes))

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
		} else {
		  showLoader()
		  setupTimer()
		  findLastUpdateImages()
		}

		checkForTokenInUrl()



		/*
		FastClick.attach(document.body);
		var rellax = new Rellax('.js-parallax');

		$(window).scroll(function(){
			var scrollTop = $(window).scrollTop();
			console.log('1 - (scroll/10)', 1 - (scrollTop/500));
			var opacity = (1 - (scrollTop/500) > 0) ? 1 - (scrollTop/500) : 0;
			// $('.js-heading').css({
			// 	'opacity': opacity,
			// });
		});
		*/
	});
})(jQuery);
