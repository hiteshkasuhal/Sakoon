$(document).on("click", ".question_product,.custom_icons_faq_main .icons_with_text_item_title", function (e) {
  if (jQuery(this).hasClass("active")) {
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  } else {
    jQuery('.question_product,.custom_icons_faq_main .icons_with_text_item_title').removeClass('active');
    jQuery('.question_product,.custom_icons_faq_main .icons_with_text_item_title').next().slideUp();
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  }
});
$(document).on("click", ".PDP_faq_2 .answer_product strong", function (e) {
  if (jQuery(this).hasClass("active")) {
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  } else {
    jQuery('.PDP_faq_2 .answer_product strong').removeClass('active');
    jQuery('.PDP_faq_2 .answer_product strong').next().slideUp();
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  }
});

$(document).on("click", ".faq_question", function () {
  var $current = $(this);
  var $answer = $current.next();

  if ($current.hasClass("active")) {
    $current.removeClass("active");
    $answer.stop(true, true).slideUp(300);
    return;
  }

  // Close all others
  $(".faq_question.active")
    .removeClass("active")
    .next()
    .stop(true, true)
    .slideUp(300);

  // Open current
  $current.addClass("active");
  $answer.stop(true, true).slideDown(300);
});
$(document).on("click", ".faq_question_new_main", function (e) {
  if (jQuery(this).hasClass("active")) {
    jQuery(this).find('.faq_question_text').toggleClass('active');
    jQuery(this).toggleClass('active');
    jQuery(this).next().slideToggle();
  } else {
    jQuery('.faq_question_new_main').removeClass('active');
    jQuery('.faq_question_text').removeClass('active');
    jQuery('.faq_question_new_main').next().slideUp();
    jQuery(this).toggleClass('active');
    jQuery(this).find('.faq_question_text').toggleClass('active');
    jQuery(this).next().slideToggle();
  }
});




 $(document).on("click", ".custom_button", function (e) {
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

$(document).on("click", 'a[href="#ingredients"]', function (e) {
 e.preventDefault(); 
  document.querySelector('#ingredients').scrollIntoView({
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

function isAtViewportMidline(el) {
  if (!el || !el.getBoundingClientRect) return false;
  if (!$(el).is(':visible')) return false;

  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth || document.documentElement.clientWidth;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const midY = vh / 2;

  // horizontally on-screen AND the element spans the middle line
  return rect.left < vw && rect.right > 0 && rect.top < midY && rect.bottom > midY;
}

function runCounters($block) {
  $block.addClass('start_count');
  $block.find('.count_js').each(function () {
    const $c = $(this);
    const target = +($c.data('value') || 0);
    $c.prop('Counter', 0).stop(true).animate(
      { Counter: target },
      {
        duration: 2000,
        easing: 'swing',
        step: function (now) { $c.text(Math.ceil(now)); }
      }
    );
  });
}

function checkCountersInView() {
  $('.custom_counter .icons_with_text_flex').each(function () {
    const $block = $(this);
    if ($block.hasClass('start_count')) return;          // only once
    if (isAtViewportMidline(this)) runCounters($block); // trigger when truly visible
  });
}

$(window).on('scroll load', checkCountersInView);




$(document).on("click", ".tab_item_pdp", function (e) {
var data_tab = $(this).attr('data_tab');
$('.tab_item_pdp').removeClass('active');
$(this).addClass('active');
$('.tab_content_pdp').hide();
$('.tab_content_pdp[data_tab="'+data_tab+'"]').show();
});


$(document).on("click", '.product_slider_custom_slider_button a.custom_hk_button, .ajax_add_cart ', function(e) {
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
    $.get(window.location.pathname, function (res) {
      var $new = $(res).find('#cart_drawer_content');
      $('#cart_drawer_content').replaceWith($new);
         // Update cart count
      const $newCartCount = $(res).find('.cart_count_js');
      const cartCount = parseInt($newCartCount.text().trim(), 10);
      
      if (cartCount > 0) {
        $('.cart_count_js').text(cartCount).show();
      } else {
        $('.cart_count_js').text('').hide();
      }
      $('#cart-drawer').removeClass('is_empty').addClass('open');
      $('.custom_overlay2').addClass('active');
      this_element.removeClass('loading_hk');
    });
 } 
 });
  });



   $(window).scroll(function(){
      if ($(this).scrollTop() > 30) {
         $('body').addClass('remove_transparent');
      } else {
         $('body').removeClass('remove_transparent');
      }
  });


  function isScrolledIntoView2(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
docViewBottom = docViewBottom-($(window).height()/2)+($(elem).height())+100;
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom));
}

$(window).scroll(function () {
    $('.pdp_steps_list1 .icons_with_text_item').each(function () {
        if (isScrolledIntoView2(this) === true) {
            $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
    });
});





$(document).on("click", '.popup_close,.popup_bg', function (e) {
 e.preventDefault(); 
$('.popup_main').hide().removeClass('active');
});




$(document).on("click", ".trigger_reviews_js_show", function (e) {
$('.review_with_text_landing_page_item.active').last().next().show();
$('.review_with_text_landing_page_item.active').last().next().next().show();
$('.review_with_text_landing_page_item.active').last().next().next().next().show();
$('.review_with_text_landing_page_item.active').last().next().addClass('active');
$('.review_with_text_landing_page_item.active').last().next().addClass('active');
$('.review_with_text_landing_page_item.active').last().next().addClass('active');
});


$(document).on("click", ".trigger_reviews_js_hide", function (e) {
$('.review_with_text_landing_page_item:nth-child(6)~.review_with_text_landing_page_item').hide().removeClass('active');
});




$(document).on("click", 'a[href="#show"]', function (e) {
 e.preventDefault(); 
$('.PDP_review_list1+.PDP_review_list1').css({display: 'flex',overflow: 'hidden'}).hide().slideDown().addClass('active');
$('.trigger_more').hide();
$('.trigger_less').show();
});

$(document).on("click", 'a[href="#hide"]', function (e) {
 e.preventDefault(); 
$('.PDP_review_list1+.PDP_review_list1').slideUp().removeClass('active');
$('.trigger_less').hide();
$('.trigger_more').show();
});

$(document).on("click", '.PDP_reset_list1 .icons_with_text_flex .icons_with_text_item:nth-child(1)', function (e) {
e.preventDefault(); 
$('.PDP_reset_list1 .icons_with_text_flex .icons_with_text_item').removeClass('active');
$(this).addClass('active');
$('.PDP_reset_list2 .icons_with_text_flex .icons_with_text_item').eq(2).hide();
$('.PDP_reset_list2 .icons_with_text_flex .icons_with_text_item:not(:last-child)').css('display','flex');
});

$(document).on("click", '.PDP_reset_list1 .icons_with_text_flex .icons_with_text_item:nth-child(2)', function (e) {
e.preventDefault(); 
$('.PDP_reset_list1 .icons_with_text_flex .icons_with_text_item').removeClass('active');
$(this).addClass('active');
$('.PDP_reset_list2 .icons_with_text_flex .icons_with_text_item:not(:last-child)').hide();
$('.PDP_reset_list2 .icons_with_text_flex .icons_with_text_item:last-child').css('display','flex');
});



$(document).ready(function(){
$('.PDP_reset_list1 .icons_with_text_flex .icons_with_text_item').eq(0).addClass('active');
$('.PDP_reset_list2 .icons_with_text_flex .icons_with_text_item').eq(2).hide();
});

