/*
 *  Event handlers for registering, loggin in, and logging out
 */

$(document).ready( () => {

  const getUserHandle = function() {
    let handle = "";
    return $.ajax({
        url: '/users',
        method: 'GET',
        dataType: 'JSON'
      }).then( (data) => {
        if(data.handle) {
          handle = data.handle;
        }
        return handle;
      });
  };

  const checkForUser = function() {
    getUserHandle().then((handle) => {
      if(handle) {
        $('.login-handle').text(handle);
        $('.logout, .compose-button').toggle();
      } else {
        $('.nav-login, .nav-register').toggle();
      }
    });
  };
  checkForUser();

  $('.nav-login, .nav-register').click( function(event) {
    let $targetForm, $otherForm;
    if($(this).text() === 'Login') {
      $targetForm = $('.login');
      $otherForm = $('.register');
    } else {
      $targetForm = $('.register');
      $otherForm = $('.login');
    }
    if($otherForm.css('display') !== "none") {
      $otherForm.toggle();
    }
    $targetForm.toggle();
  });

});