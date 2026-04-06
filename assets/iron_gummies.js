$(document).on("click", ".question_product,.faq_question", function (e) {
  if (jQuery(this).hasClass("active")) {
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  } else {
    jQuery('.question_product,.faq_question').removeClass('active');
    jQuery('.question_product,.faq_question').next().slideUp();
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  }
});


$(document).on("click", ".iron_ing_section .review_user_flex", function (e) {
  if (jQuery(this).hasClass("active")) {
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  } else {
    jQuery('.iron_ing_section .review_user_flex').removeClass('active');
    jQuery('.iron_ing_section .review_user_flex').next().slideUp();
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  }
});




 $(document).on("click", ".custom_buttonj", function (e) {
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







$(document).on("click", "a[href='#compare']", function (e) {
  e.preventDefault();
  document.querySelector('#compare').scrollIntoView({
    behavior: 'smooth'
  })
});

$(document).on("click", "a[href='#reviews']", function (e) {
  e.preventDefault();
  document.querySelector('#reviews').scrollIntoView({
    behavior: 'smooth'
  })
});

$(document).on("click", "a[href='#faq']", function (e) {
  e.preventDefault();
  document.querySelector('#faq').scrollIntoView({
    behavior: 'smooth'
  })
});

$(document).on("click", "a[href='#']", function (e) {
  e.preventDefault();
  document.querySelector('.custom_price_landing_page').scrollIntoView({
    behavior: 'smooth'
  })
});



jQuery(document).ready(function(){
if(navigator.userAgent.indexOf('Mac') > 0) {
jQuery('body').addClass('mac-os');
} else {
jQuery('body').addClass('window-os');
}
});

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(window).scroll(function () {
    $('.custom_counter .icons_with_text_flex').each(function () {
      var this_element =  $(this);
      if (this_element.hasClass("start_count")) {
} else {
        if (isScrolledIntoView(this) === true) {
            this_element.addClass('start_count');
$('.count_js').each(function () {
    $(this).prop('Counter', 0).animate({
            Counter: $(this).data('value')
        }, {
        duration: 1000,
        easing: 'swing',
        step: function (now) {                      
            $(this).text(Math.ceil(now));
        }
    });
});
        }
      }
    });

});



$(document).on("click", ".tab_item_pdp", function (e) {
var data_tab = $(this).attr('data_tab');
$('.tab_item_pdp').removeClass('active');
$(this).addClass('active');
$('.tab_content_pdp').hide();
$('.tab_content_pdp[data_tab="'+data_tab+'"]').show();
});


$(document).on("click", '.product_slider_custom_slider_button a.custom_hk_button', function(e) {
 e.preventDefault(); 
var this_element =  jQuery(this);
this_element.addClass('loading_hk');
var id = jQuery(this).attr('variant_id');
jQuery.ajax({
type: 'POST',
url: '/cart/add.js',
data: {
  quantity: 1,
  id: id
},
  dataType: 'json', 
 success: function (data) { 
location.href="/checkout";
 } 
 });
  });



  $(document).on("click", '.custom_ajax_atc', function(e) {
  e.preventDefault();
  // ✅ Backup original open function
  var originalOpen = window.upcartOpenCart;

  // ✅ Temporarily disable drawer open
  window.upcartOpenCart = function() { return false; };
  var $btn = $(this).addClass('loading_hk'),
      id = $btn.attr('variant_id'),
      quantity = $btn.attr('quantity'),
      selling_plan = $btn.attr('selling_plan'),
      data = { id: id, quantity: quantity };
  if (selling_plan) data.selling_plan = selling_plan;

  $.post('/cart/add.js', data, function () { 
    $btn.removeClass("loading_hk");
   //location.href = '/checkout';
  }, 'json');
});



$(document).on("click", '.popup_close,.popup_bg', function (e) {
 e.preventDefault(); 
$('.popup_main').hide().removeClass('active');
});


$(document).on("click", "a[href='#ingredients']", function (e) {
  e.preventDefault();
$('.popup_main').show().addClass('active');
});


/*

$(document).on('click', '.product_image_wrapper img', function () {

  var imgSrc = $(this).attr('src');
  var imgAlt = $(this).attr('alt');

  $('.image_zoom_target')
    .attr('src', imgSrc)
    .attr('alt', imgAlt)
    .css({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });

  $('.image_zoom_modal').addClass('active');
});


// Click to zoom inside popup
$(document).on('click', '.image_zoom_target', function (e) {

  var rect = this.getBoundingClientRect();

  if (!$(this).hasClass('zoomed')) {

    var offsetX = e.clientX - rect.left;
    var offsetY = e.clientY - rect.top;

    var percentX = (offsetX / rect.width) * 100;
    var percentY = (offsetY / rect.height) * 100;

    $(this).css({
      transformOrigin: percentX + '% ' + percentY + '%',
      transform: 'scale(3)'
    }).addClass('zoomed');

  } else {

    $(this).css({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    }).removeClass('zoomed');
  }
});


// Close on overlay click
$(document).on('click', '.image_zoom_overlay', function () {
  closeZoomModal();
});
// Close on overlay click
$(document).on('click', '.popup_close_zoom', function () {
  closeZoomModal();
});


// Close on ESC
$(document).on('keyup', function (e) {
  if (e.key === "Escape") {
    closeZoomModal();
  }
});

function closeZoomModal() {
  $('.image_zoom_target')
    .css({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    })
    .removeClass('zoomed');

  $('.image_zoom_modal').removeClass('active');
}*/