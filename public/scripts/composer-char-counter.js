/*
 *  Event handler for updating the character counter
 */

$(document).ready( () => {

  // Event listener for the form textarea
  $('#new-tweet-input').on('input', function(){           // Use an input event
    let charRemaining = 140 - $(this).val().length;
    let counterElm = $(this).parent().find('.counter');
    counterElm.text(charRemaining);

    if(charRemaining < 0) {
      counterElm.addClass('negative-counter');            // Add a class to the counter for styling
      $('.submit-error').text('Too many characters.');    // Show a message if they have gone over the limit
    } else {
      $('.submit-error').empty();                         // Remove the error message and class when in safe range
      counterElm.removeClass('negative-counter');
    }
  });
});