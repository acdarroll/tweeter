/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  let data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];

  const escape = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function(data) {
    let $article = $('<article>').addClass('tweet');
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
    $footer.append(escape(data['created_at']));

    return $article;
  };

  const renderTweets = function(tweets) {
    tweets.forEach((tweet) => {
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    });
  };
  renderTweets(data);
});

