/*
 *  Event handlers for registering, loggin in, and logging out
 */

$(document).ready( () => {

  const formReset = function() {
    $(this).trigger('reset');
    $(this).toggle();
    $('.nav-login, .nav-register, .logout').toggle();
  };

  const registerUser = function(event) {
    event.preventDefault();
    let formData = $(this).serialize();
    console.log(formData);

    $.ajax({
      url: '/users/register',
      method: 'POST',
      data: formData,
    }).then(formReset.call($(this)));
  };

  const loginUser = function(event) {
    event.preventDefault();
    let formData = $(this).serialize();
    console.log($(this));
    console.log("Form data:", formData);

    $.ajax({
      url: '/users/login',
      method: 'POST',
      data: formData,
    }).then( (data, status) => {
      if(status === 'success') {
        console.log("Success");
        formReset.call($(this));
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
      $('.nav-login, .nav-register').toggle();
    });
  };

  $('.nav-login, .nav-register').click( function(event) {
    console.log("Target:", event);
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