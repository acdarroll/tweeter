/*
 *  Event handler for toggling the compose button
 */

$(function() {
  $('.compose-button').click(function(event) {
    let $composeBox = $('.new-tweet');
    $composeBox.slideToggle('slow');
    $composeBox.find('#new-tweet-input').focus();
  });
});