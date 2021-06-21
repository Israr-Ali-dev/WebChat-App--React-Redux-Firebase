// Dropzone.autoDiscover = false;
$(document).ready(function () {
  // resposive message chat-box
  $('#autoHeight').on('input', function (elem) {
    $(this).height('1px');
    var iScrollHeight = $(this).prop('scrollHeight');
    $(this).height(iScrollHeight + 'px');

    if ($('#autoHeight').val() === '') {
      $(this).height('18px');
    }
  });

  // Bottom to chatbox
  $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));

  // $('#send-txt').click(function () {
  //   //getting new time for sent msgs
  //   var d = new Date();
  //   var h = d.getHours();
  //   var t = d.getMinutes();
  //   //appending 0 if minutes are in single digit
  //   10 > h ? (h = '0' + h) : (h = h);
  //   10 > t ? (t = '0' + t) : (t = t);
  //   12 > h ? (time = h + ':' + t + ' am') : (time = h - 12 + ':' + t + ' pm');

  //   //triming user input
  //   var msg = $('#autoHeight').val();

  //   //creating user msgs
  //   var para = $(
  //     " <li class='chat-right'>" +
  //       "<div class='chat-text' style='white-space: pre-wrap;'>" +
  //       msg +
  //       "</div> <div class='chat-avatar'>" +
  //       "<img src='assets/img/icons/Ellipse 02.png'" +
  //       "alt='Retail Admin'>" +
  //       "<div class='chat-name'>" +
  //       time +
  //       '</div></div></li>'
  //   );

  //   msg == '' ? $('#autoHeight').focus() : $('.chat-box').append(para);
  //   $('#autoHeight').val('').height('18px');

  //   //autoscroll with every new msg
  //   var scroll = $('.chat-box').scrollTop($('.chat-box').prop('scrollHeight'));
  // });

  // Mobile chat-box hide/show
  $('#customer-list--show').click(function () {
    $('.usersbox-container').toggleClass('show-list');
  });

  $('.users-close').click(function () {
    $('.m-user-section').css('display', 'none');
    $('#users-list').addClass('users-container');
    $('#users-list').removeClass('users-container-show');
  });

  // Product detail hide/show
  $('#detail-list--show').click(function () {
    $('.detailbox-container').toggleClass('show-list');
  });

  $('.detail-close').click(function () {
    $('.m-detail-section').css('display', 'none');
    $('#detail-list').addClass('users-container');
    $('#detail-list').removeClass('users-container-show');
  });

  // // Dropzone hide/show
  // $('#attach-file').click(function () {
  //   $('#dropzone').toggle();
  //   $('#uploadFile').toggle();
  // });

  // $('.drop-zone--close').click(function () {
  //   $('#dropzone').toggle();
  //   $('#uploadFile').toggle();
  // });

  // Dropzone
  // var zdrop = new Dropzone('#dropzone', {
  //   url: 'https://httpbin.org/post',
  //   autoProcessQueue: false,
  //   maxFiles: 5,
  //   maxFilesize: 30,
  //   acceptedFiles: '.jpeg,.jpg,.png,.gif',
  //   addRemoveLinks: true,
  //   success: function (file, response) {
  //     alert('Image Uploaded Successfuly');
  //   },
  //   removeFilePromise: function () {
  //     return new Promise((resolve, reject) => {
  //       let rand = Math.floor(Math.random() * 3);
  //       console.log(rand);
  //       if (rand == 0) reject("Didn't remove properly");
  //       if (rand > 0) resolve();
  //     });
  //   },
  // });
});

function test() {
  alert('heloo');
}
