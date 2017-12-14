/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  // Used to escape input from the user to avoid XSS attacks
  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const calculateDays = function(date) {
    let currentDate = new Date();
    let timePassed = Math.round((currentDate - date) / 1000);

    let units = [
      { conv: 1, type: 'second'},
      { conv: 60, type: 'minute'},
      { conv: 60 * 60, type: 'hour'},
      { conv: 60 * 60 * 24, type: 'day'},
      { conv: 60 * 60 * 24 * 7, type: 'week'},
      { conv: 60 * 60 * 24 * 7 * 4, type: 'month'},
      { conv: 60 * 60 * 24 * 7 * 4 * 12, type: 'year'},
      { conv: 60 * 60 * 24 * 7 * 4 * 12 * 10, type: 'decade'},
    ];

    let conversion = units.find( (timeUnit, i) => {
      return timePassed > timeUnit.conv && timePassed < units[i + 1].conv;
    });

    let numberOfTimeUnits = Math.floor(timePassed / conversion.conv);
    let unitConversion = conversion.type;

    if(numberOfTimeUnits > 1) {
      unitConversion = unitConversion + "s";
    }

    return { number: numberOfTimeUnits, units: unitConversion };
  }

  const inputErrorsPresent = function(inputText) {
    if(inputText.length > 140) {
      return true;
    } else if(inputText.length == 0) {
      let errorMessage = 'Please add characters to submit a tweet';
      $('.submit-error').text(errorMessage);
      return true;
    } else {
      return false;
    }
  }

  const createTweetElement = function(data) {
    let daysAgo = calculateDays(data['created_at']);
    let $article = $('<article>').addClass('tweet');

    // // DAVE
    // let $header = $('<header>').addClass('tweet-header')
    // let $

    // $header.append([$headerImage, $headerTitle, $headerUsername]);
    // // END DAVE

    $article.append('<header class="tweet-header"></header>')
            .append('<section class="tweet-text"></section>')
            .append('<footer class="tweet-footer"></footer>');

    let $header = $('.tweet-header', $article);
    $header.append(`<img class="user-avatar" src=${escape(data.user.avatars.small)}>`)
           .append(`<h2 class="user-full-name">${escape(data.user.name)}</h2>`)
           .append(`<span class="username">${escape(data.user.handle)}</span>`);

    let $section = $('.tweet-text', $article).text(data.content.text);

    let $footer = $('.tweet-footer', $article);

    $footer.attr('date-created', data['created_at']);
    $footer.append('<div class="hover-icons"></div>');
    $('.hover-icons', $footer).append('<span class="fas fa-flag"></span>')
                              .append('<span class="fas fa-retweet"></span>')
                              .append('<span class="fas fa-heart"></span>');
    $footer.append(`${escape(daysAgo.number)} ${escape(daysAgo.units)} ago`);

    return $article;
  };

  // Appends all the tweets in an array to the DOM
  const renderTweets = function(tweets) {
    tweets.forEach((tweet) => {
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    });
  };

  // Event handler for submitting a new tweet
  $('.submit-tweet').submit(function(event) {
    event.preventDefault();                                 // Prevent the default POST method to /tweets
    let formData = $(this).serialize();
    let $textVal = $(this).find('#new-tweet-input').val();  // Get the textarea value to validate the input

    if(!inputErrorsPresent($textVal)) {                     // Validate the input and display appropriate messages
      $('.submit-tweet').trigger('reset');
      $('#new-tweet-input').trigger('input');

      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formData,
      }).then( function() {
        loadTweets();           // Load the tweets again to display the new tweet
      });
    }
  });

  // Requests tweets from server and then calls the renderTweets function to display them
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'JSON'
    }).then( function(data) {
      $('#tweets-container').empty();   // Remove all existing tweet elements before appending those
                                        // retrieved from the database.
      renderTweets(data);               // Append the retrieved tweets to the DOM.
    });
  };

  // Load tweets on initial visit to page
  loadTweets();
});

