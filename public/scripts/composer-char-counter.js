/*
 *  Event handler for updating the character counter
 */

$(function() {
  $('#new-tweet-input').on('input', function(){
    let textLength = 140 - $(this).val().length;
    let counterElm = $(this).parent().find('.counter');
    counterElm.text(textLength);

    if(textLength < 0) {
      counterElm.addClass('negative-counter');
    } else {
      counterElm.removeClass('negative-counter');
    }
  });
});