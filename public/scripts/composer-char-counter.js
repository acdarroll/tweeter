$(function() {
  // console.log('composer works');
  // $('#new-tweet-input').keyup(function(){
  //   console.log('keyup');
  //   console.log($(this).val());

  // });
  $('#new-tweet-input').keyup(function(){
s
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