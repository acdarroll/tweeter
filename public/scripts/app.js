/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

let tweetData = {
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
};

const createTweetElement = function(data) {
  let $article = $('<article>').addClass('tweet');
  $article.append('<header class="tweet-header"></header>')
          .append('<section class="tweet-text"></section>')
          .append('<footer class="tweet-footer"></footer>');

  let $header = $('.tweet-header', $article);
  $header.append(`<img class="user-avatar" src=${tweetData.user.avatars.small}>`)
         .append(`<h2 class="user-full-name">${tweetData.user.name}</h2>`)
         .append(`<span class="username">${tweetData.user.handle}</span>`);

  let $section = $('.tweet-text', $article).text(tweetData.content.text);

  let $footer = $('.tweet-footer', $article);
  $footer.attr('date-created',tweetData[created_at]).append('<div class="hover-icons"></div>');
  $('.hover-icons', $footer).append('<span class="fas fa-flag"></span>')
                            .append('<span class="fas fa-retweet></span>"')
                            .append('<span class="fas fa-heart></span>"');

  return $article;
}

$tweet = createTweetElement(tweetData);

console.log($tweet);

