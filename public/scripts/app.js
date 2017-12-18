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
      { conv: 1, type: 'millisecond'},
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

    if(unitConversion === 'millisecond') {          // If time elapsed is less than 1 second then say this instead
      numberOfTimeUnits = '';
      unitConversion = 'a moment';
    }

    if(numberOfTimeUnits > 1) {
      unitConversion = unitConversion + "s";        // Make the units plural if necessary
    }


    return { number: numberOfTimeUnits, units: unitConversion };
  };

  const createTweetElement = function(data) {
    let daysAgo = formateElapsedTime(data.interval);

    if(!data.likes) {                                // Handle tweets that don't have the likes property yet
      data.likes = 0;
    }

    let $article =                                  // Create the new tweet element with template literal
    $(`<article class="tweet">
        <header class="tweet-header">
          <img class="user-avatar" src=${escape(data.user.avatars.small)}>
          <p class="user-full-name">${escape(data.user.name)}</p>
          <span class="username">${escape(data.user.handle)}</span>
        </header>
        <section class="tweet-text">${escape(data.content.text)}</section>
        <footer class="tweet-footer">
          <div data-tweet-id="${data['_id']}" class="hover-icons">
            ${escape(daysAgo.number)} ${escape(daysAgo.units)} ago
            <span class="fas fa-flag"></span>
            <span class="fas fa-retweet"></span>
            <span class="fas fa-heart"></span>
            <span class="likes">${data.likes}</span>
          </div>
        </footer>
      </article>`);

    if (parseInt(data.likes) > 0) {
      let icons = $article.find('[data-tweet-id]');
      icons.addClass('liked');
    }

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

      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formData,
      }).then( () => {
        loadTweets();           // Load the tweets again to display the new tweet
      });
    }
  });

  const handleTweetLike = function(event) {

    let heartButton = $(this).find('.fa-heart').first().children()[0];
    let displayedLikes = parseInt($(this).find('.likes').text());
    let likeData = {
      id: $(this).data('tweet-id'),
      likes: displayedLikes
    };

    if(event.target === heartButton) {
      if($(this).hasClass('liked')) {
        $(this).removeClass('liked');
        likeData.likes -= 1;
      } else {
        $(this).addClass('liked');
        likeData.likes += 1;
      }
      $('.likes', $(this)).text(likeData.likes);

      $.ajax({
        url: `/tweets/${$(this).data('tweet-id')}`,
        method: 'POST',
        data: $.param(likeData)
      });
    }

  };

  // Requests tweets from server and then calls the renderTweets function to display them
  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'JSON'
    }).then( (tweets) => {
      $('#tweets-container').empty();   // Remove all existing tweet elements before appending those
      renderTweets(tweets);             // retrieved from the database.
      $('.hover-icons').click(handleTweetLike);
    });

  };

  // Load tweets on initial visit to page
  loadTweets();
});

