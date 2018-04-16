// Marvel GraphQL
// ------------------------------------------------------------
// This is the class which handles all the requests...
// If you're new to Marvel's API this is likely the place where
// you want to start.

var marvelGraphQL = new MarvelGraphQL(
  process.env.MARVEL_CLIENT_ID,
  "projects:read user:read company.projects:read company:read company.projects:read"
);

// Timer
// ------------------------------------------------------------
// Used for updating the projects every 60 seconds

var timer;

// Start (jQuery)
// ------------------------------------------------------------
// To keep it super easy we use jQuery for this little app...

$(document).ready(function() {
  function checkForTokenInUrlAndSaveToken() {
    let accessToken = getParameterByName("access_token");
    let state = getParameterByName("state");

    if (accessToken == null || state == null) {
      return;
    }

    // Check if the state is the same
    if (state != marvelGraphQL.state()) {
      showError("Your sessions expired. Please try again...");
      return;
    }

    // Store token in session for later use...
    marvelGraphQL.saveToken(accessToken);

    // Remove all returned information from hash
    removeHash();
  }

  function updateData() {
    marvelGraphQL.tokenCheckValid(function(isValid) {
      if (isValid) {
        findLastUpdateImages();
      } else {
        logout();
      }
    });
  }

  // Find the last updated images
  // ------------------------------------------------------------

  function findLastUpdateImages() {
    lastProjectsPKs(function(PKs, error) {
      // Check for errors
      if (error == Error.NO_PROJECTS) {
        showError("No projects found in your Marvel account...");
        return;
      } else if (error == Error.NO_COMPANY) {
        showError("You have to be on a company plan to use this...");
        return;
      }

      findImagesForProjectsWithPk(PKs, function(images) {
        // Sort by date
        var imagesSorted = images.sort(function(a, b) {
          var dateA = Date.parse(a["modifiedAt"]);
          var dateB = Date.parse(b["modifiedAt"]);
          return dateB.compareTo(dateA);
        });

        // Remove the ones without content and example images
        var newArray = imagesSorted.filter(function(image) {
          if (image["content"] == null) {
            return false;
          }

          if (image["content"]["url"] == null) {
            return false;
          }

          if (
            image["content"]["url"].indexOf(
              "marvelapp.com/static/assets/images/onboarding"
            ) != -1
          ) {
            return false;
          }

          return true;
        });

        if (newArray.length == 0) {
          showError("There are no images inside your projects.");
          return;
        }

        showImages(newArray);
        showLoggedIn();
      });
    });
  }

  function lastProjectsPKs(callback, error) {
    $.when(marvelGraphQL.projects()).then(function(projectJson) {
      var projectPKs = [];

      var projects = projectJson["data"]["user"]["projects"]["edges"];
      var company = projectJson["data"]["user"]["company"];

      if (company) {
        var companyProjects = company["projects"]["edges"];
        projects.concat(companyProjects);
      }

      // Check if there are projects
      if (projects.length == 0) {
        callback(null, Error.NO_PROJECTS);
      }

      $.each(projects, function(i, project) {
        var pk = project["node"]["pk"];

        if (pk) {
          projectPKs.push(pk);
        }
      });

      const removedDuplicatedProjectPKs = removeDuplicateValues(projectPKs);

      callback(removedDuplicatedProjectPKs, null);
    });
  }

  function findImagesForProjectsWithPk(PKs, callback) {
    // All images found throughout projects
    var images = [];

    // All calls
    var deferreds = [];

    $.each(PKs, function(i, pk) {
      deferreds.push(
        marvelGraphQL.project(pk).then(function(result) {
          var projectName = result["data"]["project"]["name"];
          var nodes = result["data"]["project"]["screens"]["edges"];

          $.each(nodes, function(i, node) {
            var dictionary = node["node"];
            dictionary["projectName"] = projectName;
            images.push(dictionary);
          });
        })
      );
    });

    $.when.apply($, deferreds).then(function() {
      callback(images);
    });
  }

  function showImages(images) {
    // Empty
    $("#lastUpdated").html("");

    var first3Images = images.slice(0, 3);

    $.each(first3Images, function(i, image) {
      var img = `
          <div class='flexItem'>
              <img src='${image["content"]["url"]}'>
              <div class='footer'>
                ${image["projectName"]}
              </div>
          </div>
          `;
      $("#lastUpdated").append(img);
    });

    $("#lastUpdated")
      .waitForImages()
      .done(function() {
        positionLabels();
      });
  }

  function positionLabels() {
    $(".flexItem").each(function(index) {
      var img = $(this).find("img");
      var top =
        parseFloat(img.css("height")) + parseFloat(img.css("margin-top"));
      var width = img.css("width");
      var left = img.css("margin-left");
      $(this)
        .find(".footer")
        .css({ top: top, left: left, width: width });
    });
  }

  // Helpers
  // ------------------------------------------------------------

  function getParameterByName(name) {
    var match = RegExp("[#&]" + name + "=([^&]*)").exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
  }

  function removeHash() {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }

  function logout() {
    marvelGraphQL.removeToken();
    showLoggedOut();
  }

  function setupTimer() {
    // Update projects every 60 seconds
    clearInterval(timer);
    timer = setInterval(updateData, 60000);
  }

  function removeDuplicateValues(array) {
    var uniqueArray = [];
    $.each(array, function(i, el) {
      if ($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
    });

    return uniqueArray;
  }

  // States
  // ------------------------------------------------------------

  function showLoggedIn() {
    $("#loggedIn").removeClass("hidden");
    $("#loggedOut").addClass("hidden");
    $("#loader").addClass("hidden");
    $("#error").addClass("hidden");
  }

  function showLoader() {
    $("#loggedIn").addClass("hidden");
    $("#loggedOut").addClass("hidden");
    $("#loader").removeClass("hidden");
    $("#error").addClass("hidden");
  }

  function showError(message) {
    $("#error").removeClass("hidden");
    $("#error p").html(message);
  }

  function showLoggedOut() {
    $("#loggedIn").addClass("hidden");
    $("#loggedOut").removeClass("hidden");
    $("#loader").addClass("hidden");
    $("#error").addClass("hidden");
    clearInterval(timer);
  }

  // Design
  // ------------------------------------------------------------

  $("#connectMarvelButton").attr("href", marvelGraphQL.authorizeUrl());

  // Actions
  // ------------------------------------------------------------

  $('a[href="#logout"]').click(function(event) {
    event.stopPropagation();
    logout();
  });

  $(".marvel-integration-badge").click(function(event) {
    window.open("https://marvelapp.com/developers");
  });

  function listenForWindowResize() {
    $(window).resize(function() {
      positionLabels();
    });
  }

  // Start
  // ------------------------------------------------------------

  checkForTokenInUrlAndSaveToken();
  listenForWindowResize();
  showLoader();

  if (marvelGraphQL.token() === undefined) {
    showLoggedOut();
  } else {
    marvelGraphQL.tokenCheckValid(function(isValid) {
      if (isValid) {
        setupTimer();
        findLastUpdateImages();
      } else {
        showLoggedOut();
      }
    });
  }
});
