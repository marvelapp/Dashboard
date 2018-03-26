class Dashboard {

    constructor() {
      this.timer = timer
      this.findLastUpdateImages = this.findLastUpdateImages.bind(this)
      this.lastCompanyProjectsPKs = this.lastCompanyProjectsPKs.bind(this)
      this.findImagesForProjectsWithPk = this.findImagesForProjectsWithPk.bind(this)
      this.showImages = this.showImages.bind(this)
      this.logout = this.logout.bind(this)
      this.setupTimer = this.setupTimer.bind(this)
    }

    // Find the last updated images
		// ------------------------------------------------------------

		findLastUpdateImages(){

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

		lastCompanyProjectsPKs(callback, error){

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

		findImagesForProjectsWithPk(PKs, callback){

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

		showImages(images){

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

		logout(){
		  localStorage.removeItem("accessToken")
		  showLoggedOut()
		}

		setupTimer(){
		  // Update projects every 60 seconds
		  clearInterval(timer);
		  timer = setInterval(findLastUpdateImages, 60000);
		}

}
