/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready( () => {

  // Event handler for the compose tweet button
  $('.compose-button').click(function(event) {
    let $form = $('.new-tweet');
    let $textarea = $form.find('#new-tweet-input');

    $form.slideToggle('slow');                // Toggle the animation to show/hide the form
    $textarea.focus();

  });

  // Used to escape input from the user to avoid XSS attacks
  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Calculate the appropriate time and units to display in the tweet footer
  const formateElapsedTime = function(timePassed) {
    let units = [                         // An array of all conversions
      { conv: 1, type: 'milliseconds'},
      { conv: 1000, type: 'second'},
      { conv: 60000, type: 'minute'},
      { conv: 3600000, type: 'hour'},
      { conv: 86400000, type: 'day'},
      { conv: 604800000, type: 'week'},
      { conv: 2419200000, type: 'month'},
      { conv: 29030400000, type: 'year'},
      { conv: 290304000000, type: 'decade'},
    ];

    let conversion = units.find( (timeUnit, i) => {
      return timePassed > timeUnit.conv && timePassed < units[i + 1].conv;  // Return the entry before the one that
    });                                                                     // results in a number less than 1

    let numberOfTimeUnits = Math.floor(timePassed / conversion.conv);
    let unitConversion = conversion.type;

    if(numberOfTimeUnits > 1) {
      unitConversion = unitConversion + "s";        // Make the units plural if necessary
    }

    return { number: numberOfTimeUnits, units: unitConversion };
  };

  const createTweetElement = function(data) {
    let daysAgo = formateElapsedTime(data.interval);

    let $article =                                  // Create the new tweet element with template literal
    $(`<article class="tweet">
        <header class="tweet-header">
          <img class="user-avatar" src=${escape(data.user.avatars.small)}>
          <h2 class="user-full-name">${escape(data.user.name)}</h2>
          <span class="username">${escape(data.user.handle)}</span>
        </header>
        <section class="tweet-text">${escape(data.content.text)}</section>
        <footer class="tweet-footer">
          <div class="hover-icons">${escape(daysAgo.number)} ${escape(daysAgo.units)} ago
            <span class="fas fa-flag"></span>
            <span class="fas fa-retweet"></span>
            <span class="fas fa-heart"></span>
          </div>
        </footer>
      </article>`);

    return $article;
  };

  // Appends all the tweets in an array to the DOM
  const renderTweets = function(tweets) {
    tweets.forEach( (tweet) => {
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    });
  };

  const inputErrorsPresent = function(inputText) {  // Check the input string for length
    if(inputText.length > 140) {
      return true;
    } else if(inputText.length == 0) {
      let errorMessage = 'Please add characters to submit a tweet';
      $('.submit-error').text(errorMessage);
      return true;                                  // If string lnegth is 0 or > 140 then return true
    } else {
      return false;                                 // Otherise return false
    }
  };

  // Event handler for submitting a new tweet
  $('.submit-tweet').submit(function(event) {
    event.preventDefault();                                 // Prevent the default POST method to /tweets
    let formData = $(this).serialize();
    let textVal = $(this).find('#new-tweet-input').val();  // Get the textarea value to validate the input

    if(!inputErrorsPresent(textVal)) {                     // Validate the input and display appropriate messages
      $('.submit-tweet').trigger('reset');                  // Reset the value of the textarea
      $('#new-tweet-input').trigger('input');               // Trigger a textarea input to update the counter

      console.log("Ajax post:", Date.now());
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formData,
      }).then( () => {
        loadTweets();           // Load the tweets again to display the new tweet
      });
    }
  });

  // Requests tweets from server and then calls the renderTweets function to display them
  const loadTweets = function() {
    console.log("Ajax get:", Date.now());
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'JSON'
    }).then( function(data) {
      $('#tweets-container').empty();   // Remove all existing tweet elements before appending those
      renderTweets(data);               // retrieved from the database.
    });                                 // Append the retrieved tweets to the DOM.
  };

  // Load tweets on initial visit to page
  loadTweets();
});

