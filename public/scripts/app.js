/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const calculateDays = function(date) {
    let currentDate = new Date();
    let daysAgo = Math.round((currentDate - date) / (24 * 60 * 60 * 1000));
    return daysAgo;
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
    $footer.append(`${escape(daysAgo)} days ago`);

    return $article;
  };

  const renderTweets = function(tweets) {
    tweets.forEach((tweet) => {
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    });
  };

  $('.submit-tweet').submit(function(event) {
    event.preventDefault();
    // $('.submit-error').remove();
    let formData = $(this).serialize();

    let $textVal = $(this).find('#new-tweet-input').val();

    if($textVal.length > 140 || $textVal.length == 0) {
      let errorMessage = $textVal.length > 140 ? 'Too many characters' : 'Please add characters to submit a tweet';
      $('.submit-tweet').append(`<p class='submit-error'>${errorMessage}</p>`);
    } else {
      $('.submit-tweet').trigger('reset');
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: formData,
      }).then( function() {
        loadTweets();
      });
    }
  });

  const loadTweets = function() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      dataType: 'JSON'
    }).then( function(data) {
      $('#tweets-container').empty();
      renderTweets(data);
    });
  };
  loadTweets();
});

