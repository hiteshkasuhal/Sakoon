
$("a[href='#reviews']").click(function(e) {
     e.preventDefault();
   document.querySelector('#reviews').scrollIntoView({ 
  behavior: 'smooth' 
})
});
jQuery('.custom_button').click(function(){
    var video = jQuery(this).parents('.video_wrapper_custom').find('video');
if (jQuery(this).hasClass("active")) {
   jQuery(this).parents('.video_wrapper_custom').removeClass('video-active');
    jQuery(this).removeClass('active');
video.trigger('pause');
} else {
video.trigger('play');
  jQuery(this).parents('.video_wrapper_custom').addClass('video-active');
    jQuery(this).addClass('active');
}
});


jQuery('.video_wrapper_custom.video-active').click(function(){
    var video = jQuery(this).find('video');
var videoElement = video.get(0);
if (videoElement.paused) {
   jQuery(this).removeClass('video-active');
    jQuery(this).find('.custom_button').removeClass('active');
video.trigger('pause');
}  else {
}

});



function hkCartUpdated() {

  $.getJSON('/cart.js', function(cart) {
    $('a#cart-icon-bubble_desk, a#cart-icon-bubble-mob')
      .find('.cart-count, .count, span')
      .text(cart.item_count);
  });
}

/* Detect jQuery AJAX */
$(document).ajaxComplete(function (event, xhr, settings) {
  if (/\/cart\/(add|update|change)/.test(settings.url)) {
    hkCartUpdated();
  }
});

/* Detect fetch() requests */
(function () {
  const originalFetch = window.fetch;

  window.fetch = function () {
    return originalFetch.apply(this, arguments).then(function (response) {

      if (response.url.match(/\/cart\/(add|update|change)/)) {
        hkCartUpdated();
      }

      return response;
    });
  };
})();