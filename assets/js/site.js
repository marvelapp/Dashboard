
// Marvel GraphQL
// ------------------------------------------------------------
// This is the class which handles all the requests...
// If you're new to Marvel's API this is likely the place where
// you want to start.

var marvelGraphQL = new MarvelGraphQL("PWszPnfm3aqASM3edc5kWf8fZAoY1jAwJIM3qXWF", "projects:read user:read company.projects:read company:read")

// Timer
// ------------------------------------------------------------
// Used for updating the projects every 60 seconds

var timer;

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
		    marvelGraphQL.companyProjects()
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

		          marvelGraphQL.project(pk).then(function(result) {

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
