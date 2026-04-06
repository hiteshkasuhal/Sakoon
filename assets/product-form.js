if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('[type="submit"]');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
      if ($(window).width() < 767){
       console.log("hhhhh");
        this.form.addEventListener('touchstart', this.onSubmitHandler.bind(this));
      }
    }
  
    onSubmitHandler(evt) {
      console.log('clicked');
      console.log
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          if (!this.error) publish(PUB_SUB_EVENTS.cartUpdate, {source: 'product-form'});
          this.error = false;
          const quickAddModal = this.closest('quick-add-modal');
          if (quickAddModal) {
            document.body.addEventListener('modalClosed', () => {
              setTimeout(() => { this.cart.renderContents(response) });
            }, { once: true });
            quickAddModal.hide(true);
          } else {
            this.cart.renderContents(response);
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          $('.product-form__buttons').addClass('hide-first-btn');
          if ($('#hasShipping').prop('checked')) {
            let freeShip=parseFloat($('#hasShipping').val());
            let totalPrice=parseFloat($('.totals__subtotal-value').data('price'))+freeShip;
            $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
          }else{
            let totalPrice=parseFloat($('.totals__subtotal-value').data('price'));
            $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
          }
          if ($('#hasFreeOn150').is(':checked') && $('#hasFreeOn100').is(':checked')) {
          
            let product100=parseInt($('#freeOn100').val());
            let threshold100=parseInt($('#threshold100').val());
            let product150=parseInt($('#freeOn150').val());
            let threshold150=parseInt($('#threshold150').val());
            $.getJSON('/cart',function(responce){
              console.log(threshold100);
              let items=responce.items;
              let has150=false;
              let has100=false;
              items.forEach(function(item) {
                if (Object.values(item).indexOf(product150) > -1 ) {
                  has150=true;
                }
                if (Object.values(item).indexOf(product100) > -1 ) {
                  has100=true;
                }
              });
              if((responce.total_price >= threshold100) && (responce.total_price < threshold150)  && (!has100)){
                $.ajax({
                  type: 'POST',
                  url: '/cart/add.js',
                  data: {
                    cache:false,
                    async:false,
                    quantity: 1,
                    id: product100
                  },
                  dataType: 'json', 
                  success: function (data) {
                    const cartItems2 = document.querySelector("cart-drawer-items");
                    cartItems2.onCartUpdate();
                  } 
                });
              }
              if((responce.total_price >= threshold150) && (!has150)){
                $.ajax({
                  type: 'POST',
                  url: '/cart/add.js',
                  data: {
                    cache:false,
                    async:false,
                    quantity: 1,
                    id: product150
                  },
                  dataType: 'json', 
                  success: function (data) {
                    if((!has100)){
                      $.ajax({
                        type: 'POST',
                        url: '/cart/add.js',
                        data: {
                          cache:false,
                          async:false,
                          quantity: 1,
                          id: product100
                        },
                        dataType: 'json', 
                        success: function (data) {
                          const cartItems2 = document.querySelector("cart-drawer-items");
                          cartItems2.onCartUpdate();
                        } 
                      });
                    }else{
                      const cartItems2 = document.querySelector("cart-drawer-items");
                      cartItems2.onCartUpdate();
                    }
                  } 
                });
              }
            });
        }else{
          if ($('#hasFreeOn100').is(':checked')) {
            let product100=parseInt($('#freeOn100').val());
            let threshold100=parseInt($('#threshold100').val());
            $.getJSON('/cart',function(responce){
              console.log(threshold100);
              let items=responce.items;
              let has100=false;
              items.forEach(function(item) {
                if (Object.values(item).indexOf(product100) > -1 ) {
                  has100=true;
                }
              });
              if((responce.total_price >= threshold100) && (!has100)){
                $.ajax({
                  type: 'POST',
                  url: '/cart/add.js',
                  data: {
                    cache:false,
                    async:false,
                    quantity: 1,
                    id: product100
                  },
                  dataType: 'json', 
                  success: function (data) {
                    const cartItems2 = document.querySelector("cart-drawer-items");
                    cartItems2.onCartUpdate();
                  } 
                });
              }
              if((responce.total_price < threshold100) && (has100)){
                $.ajax({
                  type: 'POST',
                  url: '/cart/change.js',
                  data: {
                    cache:false,
                    async:false,
                    quantity: 0,
                    id: product100
                  },
                  dataType: 'json', 
                  success: function (data) {
                    const cartItems2 = document.querySelector("cart-drawer-items");
                    cartItems2.onCartUpdate();
                  } 
                });
              }
            });
          }
        }
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });

}

$(document).on('click','.addtocart', function(){
   console.log('btn click'); 
   const formData = $(this).parents('form').serialize();
   console.log('formData ',formData);
     jQuery.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: formData,
        dataType: 'json',
        success: function() { 
          console.log('dsdsdsd');
          const cartItems2 = document.querySelector("cart-drawer-items");
          cartItems2.onCartUpdate();
         $('cart-drawer.drawer').addClass('active');
    },
    error: function (error) {      
      alert(error.responseJSON['description']);
    }
  });
});

setTimeout(function(){
  const firstAtcText = $('button.firstaddtocart  span.addto').text();
  $('button.addtocart .addto').text(firstAtcText);
},4000);

