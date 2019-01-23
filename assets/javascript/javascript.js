const apiKey = "1xht4VzBq7DvizWDRKAF0VJdhyxIe8cX";

var topicArray = [
  "cats",
  "dogs",
  "hello",
  "goodbye",
  "mario",
  "luigi",
  "explosions"
];

$(function() {
  console.log("hello world");

  // create buttons for each item in the initial topic Array
  topicArray.forEach(createTopicButton);

  $("#add-button").click(addTopicButton);
});

let addTopicButton = function() {
  if( $("#input-add").val().length > 0 ) {
    createTopicButton($("#input-add").val());
  }
  $("#input-add").val("");
}

let processApiData = function(data) {
  // data.data contains an array of Gif objects
  // data.meta
  // meta:
  //    msg: "OK"
  //    response_id: "5c44f8e5464e617677d26940"
  //    status: 200
  // data.pagination
  // pagination:
  //    count: 25
  //    offset: 0
  //    total_count: 84913

  for(let i=0; i<data.data.length; i++) {
    // i need to grab a still image for the initial display
    let newDiv = $("<div>");
    let newGif = $("<img>");
    let newRating = $("<div>");

    // create a data-state, data-still, data-animate
    // data-state starts as 'still'
    $(newGif).attr("data-state", "still");
    $(newGif).attr("src", data.data[i].images.fixed_height_still.url);
    // data-still is the url of the still image
    $(newGif).attr("data-still", data.data[i].images.fixed_height_still.url);

    // data-animate is the url of the .gif
    $(newGif).attr("data-animate", data.data[i].images.fixed_height.url);

    // add a class .gif that will be used for the event listener
    $(newGif.addClass("gif"));

    // add the rating to display below the image
    $(newRating).text(`Rating: ${data.data[i].rating}`);

    $(newDiv).append(newGif);
    $(newDiv).append(newRating);
    $("#gif-div").append(newDiv);
  }

  // after all the images have been created, add a click listener for each gif
  $(".gif").click(toggleGifState);
};

let toggleGifState = function() {
  // 'this' is the gif to toggle
  if($(this).attr("data-state") === "still") {
    // swap the src to the data-animate
    $(this).attr("src", $(this).attr("data-animate"));
    // swap data-state to "animate"
    $(this).attr("data-state", "animate");
  } else {
    //swap the src to the data-still
    $(this).attr("src", $(this).attr("data-still"));
    // swap data-state to "still"
    $(this).attr("data-state", "still");
  }

}

let createTopicButton = function(topic) {
  // create a button
  let myButton = $("<button>");
  $(myButton).text(topic);
  $(myButton).click(topicClicked);
  $("#button-div").append(myButton);
};

let topicClicked = function(event) {
  // empty the current gifs from the div
  $("#gif-div").empty();
  // query the giphy api with the text from the topic button
  giphyApiCall($(this).text());
};

let giphyApiCall = function(search) {
  if (search !== "undefined") {
    // search is a valid term, do an api call

    //==============================================================
    // Create the giphy api url
    //==============================================================
    // http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=YOUR_API_KEY

    // Giphy search endpoint fields:
    let queryUrl = `https://api.giphy.com/v1/gifs/search?q=${search.replace(
      /\s/g,
      "+"
    )}`;
    //console.log(queryUrl);
    // q: string (required)
    // search query term or phrase

    // limit: integer
    // max records to return. default: "25"
    // TODO implement an input for the user to select how many gifs to return each search
    queryUrl += `&limit=10`;

    // offset: integer
    // optional results offset. default: "0"


    // rating: string
    // filter results by specific rating

    // lang: string
    // used to indicate expected response format

    // api_key: string (required)
    // YOUR_API_KEY
    queryUrl += `&api_key=${apiKey}`;

    $.ajax({
      url: queryUrl,

      success: function(data, status, xhr) {
        // handle the response
        processApiData(data);
      },
      error: function(xhr, status, error) {
        // handle errors
        // TODO tell the user something went wrong and try again

        console.log(xhr);
        console.log(status);
        console.log(error);
      }
    });
  }
};
