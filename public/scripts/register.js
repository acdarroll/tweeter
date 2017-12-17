/*
 *  Event handlers for registering, loggin in, and logging out
 */

$(document).ready( () => {

  $('.register').submit( function(event) {
    event.preventDefault();
    let formData = $(this).serialize();
    console.log(formData);

    $.ajax({
      url: '/users/register',
      method: 'POST',
      data: formData,
    }).then( () => {
      // What to do with return
    });
  });

  $('.login').submit( function(event) {
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
        $(this).toggle();
        $('.nav-login, .nav-register, .logout').toggle();
      }
    });
  });

  $('.logout').submit( function(event) {
    event.preventDefault();

    $.ajax({
      url: '/users/logout',
      method: 'POST',
    }).then( () => {
      $(this).toggle();
      $('.nav-login, .nav-register').toggle();
    });
  });
});