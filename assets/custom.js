$(document).ready(function () {

  
  var sub_select_val = $(".product-subscription .prive_type_box input.prive_input_radio:checked").val();
  console.log(sub_select_val);
  if(sub_select_val == 'one') {
      console.log("yes oness");
      var first_select_price = $(".product-subscription .product_pakage.selected").find(".original-price").attr("data-price");
      $(".product-subscription .product_price .price").text(first_select_price);
      $(".product-subscription span.original-price--js.one_time").show();
      $(".product-subscription span.original-price--js.sub_time").hide();
  } else {
      console.log("yes subssss");
      $(".product-subscription span.original-price--js.one_time").hide();
      $(".product-subscription span.original-price--js.sub_time").show();
  }



 $(".product-subscription .prive_delivery_every_box select").change(function(){
   console.log("aaaaaaaa"); 
   var vals = $(this).find("option:selected").text();
   console.log(vals);
   if(vals != "") {
     console.log("correct");
     var sub_selected = $(".prive_input_radio:checked").val();  
     var sub_price = parseFloat($("span.original-price--js.sub_time").find(".ogr-cprice").text().replace("$", ""));
     console.log(sub_price);
     var new_price = sub_price * 0.85;
     console.log("New price:", new_price.toFixed(2));
     var data = sub_price - new_price;
     console.log(data); 
     var sum = sub_price + data;
     console.log(sum);  
   } else {
     console.log("incorrect");  
   }
});
  
  
    subscriptionPrice();
    setTimeout(function(){
    subscriptionPrice();
      
      var sub_select_val = $(".product-subscription .prive_type_box input.prive_input_radio:checked").val();
      console.log(sub_select_val);
      if(sub_select_val == 'one') {
          console.log("yes one");
          $(".product-subscription span.original-price--js.one_time").show();
          $(".product-subscription span.original-price--js.sub_time").hide();
      } else {
          console.log("yes sub");    
          $(".product-subscription span.original-price--js.one_time").hide();
          $(".product-subscription span.original-price--js.sub_time").show();
      }
      
    },2500);
  $(document).on("click", ".cb-value", function () {
    var $el = $(this),
      $wrap = $el.closest(".toggle-btn"),
      $sub_radio = $('.prive_input_radio[value="sub"]'),
      $one_radio = $('.prive_input_radio[value="one"]');
    if ($el.prop("checked")) {
      $wrap.addClass("active");
      $sub_radio.click();
      $('.recharge_option').show();
      $('.crw--main').addClass('active');
      $('#sub').find('.prive_label_title').next().addClass('sub_price');
      var sub_price = $('.sub_price').text();
      $(".dy_price").html(sub_price);
      $('.crw--icon_on').show();
      $('.crw--icon_off').hide();
      $('.one_time').hide();
      $('.sub_time').show();  
      subscriptionPrice();
    } else {
      $wrap.removeClass("active");
      $one_radio.click();
      $('.recharge_option').hide();
      $('.crw--main').removeClass('active');
      $('#one').find('.prive_label_title').next().addClass('one_price');
      var one_price =$('.one_price').text();
      $('.dy_price').html(one_price);
      $('.crw--icon_on').hide();
      $('.crw--icon_off').show();
      $('.one_time').show();
      $('.sub_time').hide();   
      subscriptionPrice();
    }
  });


  
$(document).on("change", ".prive_select", function (e) { 
  e.preventDefault();
  console.log("asdasd");
   alert("asdasd");
});

  $(document).on("change", ".recharge_option", function () {
    console.log("aaa");
    var $el = $(this),
      val = $el.val();
    $(".add_to_cart_container .prive_select").val(val).change();
    var sub_price = $('.sub_price').text();
    $('.dy_price').html(sub_price);
      console.log(sub_price);
    $('.product_pakage.selected').find('.ogr-cprice').html(sub_price);
     subscriptionPrice();
  });

  var interval = setInterval(function () {
    $('#sub').find('.prive_label_title').next().addClass('sub_price');
    if ($(".prive_select").length) {
      var prd_dy_price = $(".sub_price").text();
      $(".dy_price").html(prd_dy_price);
      clearInterval(interval);
    }
  }, 1000);
  setTimeout(function() {
    $('.custom-recharge_wrapper').show();
  },1000);
  
  $(document).on('click','.product_pakage',function(e){
    e.preventDefault();
    setTimeout(function () {
      if($('.toggle-btn').hasClass('active')){
        $('#sub').find('.prive_label_title').next().addClass('sub_price');
        var sub_price = $('.sub_price').text();
        $(".dy_price").html(sub_price);
        $('.recharge_option').val( $('.recharge_option option:first').val() );
        $('.product_pakage.selected').find('.ogr-cprice').html(sub_price);
      }else{
         $('#one').find('.prive_label_title').next().addClass('one_price');
        var one_price = $('.one_price').text();
        $(".dy_price").html(one_price);
         $('.product_pakage.selected').find('.ogr-cprice').html(one_price);
      }

    },1000)
     var price_c = $(this).find(".ogr-cprice").text();
    price_c = price_c.replace("Rs. ", "");

  console.log('price_c ',price_c);
    subscriptionPrice(price_c);
    
  });


  $(document).on('click','.product-subscription .product_pakage',function(e){
    e.preventDefault();
    console.log("aaaaaa");
     setTimeout(function(){ 
        var select_vals = $(".prive_input_radio:checked").val();
        console.log(select_vals);
       $(".product-subscription .product-form__submit .prices").text("ADD TO CART");
       // $(".product-form__submit .addto").text("ADD TO CART");
     if(select_vals == "one") {
           //console.log("yesssss");
           var comp_price = $(".product_pakage.selected span.original-price--js.one_time").find(".old-price").text();
           //console.log(comp_price);
           $(".product_price .compare_price").text(comp_price);
           var main_price = $(".product_pakage.selected span.original-price--js.one_time").find(".original-price").text();
           $(".product_price .price").text(main_price);
    
           var save_price = $(".product_pakage.selected span.original-price--js.one_time").find(".price-difference").text();
           //console.log(save_price);
           $(".product_price .save_price").text(save_price);
        } else {
           //console.log("nooooooo");
           var comp_price = $(".product_pakage.selected span.original-price--js.sub_time").find(".original-price").attr("data-price");
           //console.log('asdasd' + comp_price);
           $(".product_price .compare_price").text(comp_price);
           var main_price = $(".product_pakage.selected span.original-price--js.sub_time").find(".ogr-cprice").text();
           $(".product_price .price").text(main_price);
    
           var save_price = $(".product_pakage.selected span.original-price--js.sub_time").find(".price-difference").text();
           //console.log(save_price);
           $(".product_price .save_price").text(save_price);
          
        }	
     }, 1000); 
  });

     $(".prive_delivery_every_box select").change(function(e){
       e.preventDefault();       
       setTimeout(function(){ 
             console.log('aaaaaaa');
             var vals = $(this).find("option:selected").text();
             console.log(vals);
   if(vals != "") {
               console.log("correct");
               var sub_selected = $(".prive_input_radio:checked").val();  
               var sub_price = parseFloat($("span.original-price--js.sub_time").find(".ogr-cprice").text().replace("$", ""));
               console.log(sub_price);
               var new_price = sub_price * 0.85;
               console.log("New price:", new_price.toFixed(2));
               var data = sub_price - new_price;
               console.log(data); 
               var sum = sub_price + data;
               console.log(sum);  
             } else {
               console.log("incorrect");  
             }
          }, 3000);
 });
   
function subscriptionPrice(){
  console.log('working...');
  const subType = $('.prive_label input:checked').val();
   //const ccprice = $(`#${subType} label.prive_label span`).eq(2).text();ole.log('subType ',subType);
     // $('.product-form__buttons span.addto').text('Add to cart - '+ccprice);
  setTimeout(function(){
    const ccprice = $(`#${subType} label.prive_label span`).eq(2).text();
    $('.product-form__buttons span.addto').text('Add to cart - '+ccprice);
     // $('.product-form__buttons span.addto').html('Add to cart<span class="price">' + - ccprice + '</span>');
     // $('.product-form__buttons span.addto').html('Add to cart');
    console.log('ccprice ',ccprice);
  }, 500);
  
  
  setTimeout(function(){
    $('.sub_time .original-price').each(function(){
      const cPrice = $(this).data('price');
      $(this).text(cPrice);
    });
    $('.one_time .original-price').each(function(){
      const cPrice = $(this).data('price');
      $(this).text(cPrice);
    });
    
    
    document.querySelectorAll('.add_to_cart_container .prive_flex_start .prive_input_radio').forEach(item => {
     item.addEventListener('change', function(){
         console.log('sdsds ',this.value);
         if(this.value == 'sub'){
           $('.one_time').hide();
           $('.sub_time').show();  
            $('.crw--footer').removeClass('hide-icon');
           const cprice = $('#sub label.prive_label span').eq(2).text();
           console.log('cprice ',cprice);
           $('.product-form__buttons span.addto').text('Add to cart - '+cprice);
            // $('.product-form__buttons span.addto').html('Add to cart<span class="price">' + - ccprice + '</span>');
         }else{
            $('.sub_time').hide();  
            $('.one_time').show();
            $('.crw--footer').addClass('hide-icon');
            const cprice = $('#one label.prive_label span').eq(2).text();
            $('.product-form__buttons span.addto').text('Add to cart - '+cprice);
            // $('.product-form__buttons span.addto').html('Add to cart<span class="price">' + - ccprice + '</span>');
           // $('.product-form__buttons span.addto').html('Add to cart');
            console.log('cprice ',cprice);
         }
     }) 
  });

     //    document.querySelectorAll('.product-subscription .add_to_cart_container .prive_flex_start .prive_input_radio').forEach(item => {
     //     item.addEventListener('change', function(e){
     //       e.preventDefault();
     //      if(this.value == 'sub'){
     //       $('.one_time').hide();
     //       $('.sub_time').show();  
     //        $('.crw--footer').removeClass('hide-icon');
     //       const cprice = $('#sub label.prive_label span').eq(2).text();
     //       console.log('cprice ',cprice);
     //       $('.product-form__buttons span.addto').text('Add to cart - '+cprice);
     //     }else{
     //        $('.sub_time').hide();  
     //        $('.one_time').show();
     //        $('.crw--footer').addClass('hide-icon');
     //        const cprice = $('#one label.prive_label span').eq(2).text();
     //        $('.product-form__buttons span.addto').text('Add to cart - '+cprice);
     //        console.log('cprice ',cprice);
     //     }
     //    }); 
     // });
       
    document.querySelectorAll('.product-subscription .add_to_cart_container .prive_flex_start .prive_input_radio').forEach(item => {
     item.addEventListener('change', function(e){
         e.preventDefault();
         console.log('ssssss ',this.value);
              $(".product-subscription .product-form__submit .prices").text("ADD TO CART");
         if(this.value == 'one'){
           $(".span.original-price--js.one_time").addClass("active");
           $(".span.original-price--js.sub_time").removeClass("active");
          setTimeout(function(){
             console.log("aa");
              $(".product-subscription .product-form__submit .prices").text("ADD TO CART");
          }, 500);
           // $('.one_time').hide();
           // $('.sub_time').show();  
           //  $('.crw--footer').removeClass('hide-icon');
           // const cprice = $('#sub label.prive_label span').eq(2).text();
           // console.log('cprice ',cprice);
           // $('.product-form__buttons span.addto').text('Add to cart - '+cprice);

            $(".product-subscription .bubscriptionbenfits").hide();
           
            var tabindex = $(".product_pakage.selected").attr("tabindex");
          console.log(tabindex);
          if(tabindex == "1") {
              $(".product_main_price").addClass("hidden");
              console.log("curr");
            } else {
               $(".product_main_price").removeClass("hidden");
              console.log("not curr");
            }
           
           $(this).parents(".product-info").removeClass("subscription");
           // $(".product_main_price").addClass("hidden");
           $(".prive_type_box").removeClass("prive_type_box_active");
           $(this).parents(".prive_type_box").addClass("prive_type_box_active");
        
          // var selected_price = $(".product_pakage.selected .one_time .ogr-price.original-price").text();
           var selected_price = $(".product_pakage.selected .one_time .original-price").text();
           console.log(selected_price);
           // $(".product-form .product-form__buttons span").text("Add to cart - " + selected_price);
           
             $("span.original-price--js.one_time").show();
            $("span.original-price--js.sub_time").hide();
             $('input[name="selling_plan"]').remove();
             $('input[name="section-id"]').before('<input type="hidden" name="selling_plan" value="">');

            var main_com = $(".product_pakage.selected").find(".one_time .old-price").text();
           $(".product_price .compare_price").text(main_com);
           var main_price = $(".product_pakage.selected").find(".one_time .original-price").text();
          $(".product_price .price").text(main_price);
           var main_save = $(".product_pakage.selected").find(".one_time .price-difference").text();
          $(".product_price .save_price").text(main_save);
           
         }else{
           setTimeout(function(){
             console.log("sss");
              $(".product-subscription .product-form__submit .prices").text("ADD TO CART");
          }, 500);
           
           $(".product-subscription .bubscriptionbenfits").show();
            // $('.sub_time').hide();  
            // $('.one_time').show();
            // $('.crw--footer').addClass('hide-icon');
            // const cprice = $('#one label.prive_label span').eq(2).text();
            // $('.product-form__buttons span.addto').text('Add to cart - '+cprice);
            // console.log('cprice ',cprice);

             $(this).parents(".product-info").addClass("subscription");
            $(".product_main_price").removeClass("hidden");
            $(".prive_type_box").removeClass("prive_type_box_active");
            $(this).parents(".prive_type_box").addClass("prive_type_box_active");
           
            var selected_price = $(".product_pakage.selected .sub_time .ogr-cprice").text();
            console.log(selected_price);
           
            // $(".product-form .product-form__buttons span").text("Add to cart - " + selected_price);
           
            $("span.original-price--js.one_time").hide();
            $("span.original-price--js.sub_time").show();
             $('input[name="selling_plan"]').remove();
             $('input[name="section-id"]').before('<input type="hidden" name="selling_plan" value="690300092700">'); 


             var main_com = $(".product_pakage.selected").find(".sub_time .original-price").attr('data-price');
             console.log("main" + main_com);
             $(".product_price .compare_price").text(main_com);
             $("span.original-price--js.sub_time").find(".original-price").text(main_com);
             var main_price = $(".product_pakage.selected").find(".sub_time .ogr-cprice").text();
             console.log("price" + main_price);  
            $(".product_price .price").text(main_price);
             var main_save = $(".product_pakage.selected").find(".sub_time .price-difference").text();
             console.log("price save" + main_price);
            $(".product_price .save_price").text(main_save);
         }
     }) 
  });



      $(document).on("click", ".product-subscription .cb-value", function (e) {
        e.preventDefault();
        console.log("yess");
    var $el = $(this),
      $wrap = $el.closest(".toggle-btn"),
      $sub_radio = $('.prive_input_radio[value="sub"]'),
      $one_radio = $('.prive_input_radio[value="one"]');
    if ($el.prop("checked")) {
      $wrap.addClass("active");
      $sub_radio.click();
      $('.recharge_option').show();
      $('.crw--main').addClass('active');
      $('#sub').find('.prive_label_title').next().addClass('sub_price');
      var sub_price = $('.sub_price').text();
      $(".dy_price").html(sub_price);
      $('.crw--icon_on').show();
      $('.crw--icon_off').hide();
      $('.one_time').hide();
      $('.sub_time').show();  
      // subscriptionPrice();
    } else {
      $wrap.removeClass("active");
      $one_radio.click();
      $('.recharge_option').hide();
      $('.crw--main').removeClass('active');
      $('#one').find('.prive_label_title').next().addClass('one_price');
      var one_price =$('.one_price').text();
      $('.dy_price').html(one_price);
      $('.crw--icon_on').hide();
      $('.crw--icon_off').show();
      $('.one_time').show();
      $('.sub_time').hide();   
      // subscriptionPrice();
    }
  });

  },1000);
}

  $('.product-subscription .product_pakage[tabindex="1"]').find("h5").append("<span>30 Day Supply</span>");
  $('.product-subscription .product_pakage[tabindex="2"]').find("h5").append("<span>60 Days Supply</span>");
  $('.product-subscription .product_pakage[tabindex="3"]').find("h5").append("<span>90 Days Supply</span>");
  $('.product-subscription .product_pakage[tabindex="4"]').find("h5").append("<span>1-Year Supply</span>");
  setTimeout(function(){
    $('.product-subscription .product-form__buttons span.addto.price').text('Add to cart');
  }, 1000);
}); //ready


