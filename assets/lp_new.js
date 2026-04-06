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
  document.querySelector('.landing_page_product').scrollIntoView({
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

