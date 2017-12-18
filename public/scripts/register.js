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

  const formReset = function() {
    $(this).trigger('reset');
    $(this).toggle();
    $('.nav-login, .nav-register, .logout').toggle();
  };

  const registerUser = function(event) {
    event.preventDefault();
    let formData = $(this).serialize();

    $.ajax({
      url: '/users/register',
      method: 'POST',
      data: formData,
    }).then( (user) => {
      $('.login-handle').text(user.handle);
      formReset.call($(this));
    });
  };

  const loginUser = function(event) {
    event.preventDefault();
    let formData = $(this).serialize();

    $.ajax({
      url: '/users/login',
      method: 'POST',
      data: formData,
    }).then( (data, status) => {
      if(status === 'success') {
        formReset.call($(this));
        $('.compose-button').toggle();
        $('.login-handle').text(data.handle);
      }
    });
  };

  const logoutUser = function(event) {
    event.preventDefault();

    $.ajax({
      url: '/users/logout',
      method: 'POST',
    }).then( () => {
      $(this).toggle();
      $('.nav-login, .nav-register, .compose-button').toggle();
      $('.login-handle').empty();
    });
  };

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

  $('.register').submit(registerUser);

  $('.login').submit(loginUser);

  $('.logout').submit(logoutUser);

});