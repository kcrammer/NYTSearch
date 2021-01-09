/**
 * pulls information from the form and build the query URL
 * @returns {string} URL for NYT API based on form inputs
 */
function buildQueryURL(search, startYear, endYear) {

  // Returns different urls depending on if the user has chosen a start/end year or not
  if (search === "") {
    alert("Error, please enter a search term");
    return;
  }

  if (startYear === "" && endYear === "") {
    return "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&api-key=FgSVon8lvXnMduXtJmYgutxSAGeC4G5a";
  }

  if (startYear !== "" && endYear === "") {
    return "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&facet_fields=source&facet=true&begin_date=" + startYear + "0101&api-key=FgSVon8lvXnMduXtJmYgutxSAGeC4G5a";
  }

  if (startYear === "" && endYear !== "") {
    return "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&facet_fields=source&facet=true&end_date=" + endYear + "1231&api-key=FgSVon8lvXnMduXtJmYgutxSAGeC4G5a";
  }

  if (startYear !== "" && endYear !== "") {
    return "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&facet_fields=source&facet=true&begin_date=" + startYear + "0101&end_date=" + endYear + "1231&api-key=FgSVon8lvXnMduXtJmYgutxSAGeC4G5a";
  }
}

/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} NYTData - object containing NYT API data
 */
function updatePage(NYTData) {
  var number = $("#number-records").val();

  for (var i = 0; i < number; i++) {
    var headline = NYTData.response.docs[i].headline.main;
    var url = NYTData.response.docs[i].web_url;

    // Leaves author section blank if there is none
    if (NYTData.response.docs[i].byline.original === null) {
      var author = "";
    } else {
      var author = NYTData.response.docs[i].byline.original;
    }

    var newDiv = $("<div>");    // Section for each article
    var a = $("<a>");           // Article headline and link
    var p = $("<p>");           // Author name
    var span = $("<span>");     // Numbered article

    newDiv.attr("class", "article");
    p.attr("class", "author");
    span.attr("class", "article-number");
    a.attr("href", url);

    // Adds article number next to headline
    span.text(i + 1);
    a.text(" " + headline);    
    a.prepend(span);

    p.text(author);

    newDiv.append(a);
    newDiv.append(p);
    $("#articles-here").append(newDiv);
  }

}

// Function to empty out the articles
function clear() {
  $("#articles-here").empty();
}

$("#search-button").on("click", function(event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks). Prevents the page from reloading on form submit.
  event.preventDefault();

  // Empty the region associated with the articles
  clear();

  // Build the query URL for the ajax request to the NYT API
  var queryURL = buildQueryURL($("#search-term").val(), $("#start-year").val(), $("#end-year").val());

  // Make the AJAX request to the API - GETs the JSON data at the queryURL.
  // The data then gets passed as an argument to the updatePage function
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});

// .on("click") function associated with the clear button
$("#clear-all").on("click", clear);
