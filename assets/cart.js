class CartAddSub extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      var delay=500;
      $('.subscriptions').each(function(index){
        delay=delay+500;
        var sub =$(this);
        setTimeout( function(){
        let plan=sub.val();
        let id=sub.data('id');
        let line=sub.data('index');
        let qty=sub.data('qty');
        const cartItems = document.querySelector('cart-drawer-items');
        cartItems.enableLoading(line);
        $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: {
            cache:false,
            async:true,
            line:line,
            quantity: qty,
            selling_plan: plan
          },
          dataType: 'json',
          success: function (data) {
            return true;
          }
        });
      },delay);
      });
      setTimeout(function(){
        const cartItems2 = document.querySelector("cart-drawer-items");
        cartItems2.freeItemAdd();
        cartItems2.onCartUpdate();
        $('cart-remove-sub').show();
        $('.subscription-header').addClass('active');
        $('cart-add-sub').hide();
      },delay+500)
    });
  }
}
customElements.define('cart-add-sub', CartAddSub);
class CartRemoveSub extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      var delay=500;
      $('.subscriptions').each(function(index){
        var sub =$(this);
        delay=delay+500;
        setTimeout( function(){
          let plan=sub.val();
          let line=sub.data('index');
          let id=sub.data('id');
          let qty=sub.data('qty');
          console.log(id);
          const cartItems = document.querySelector('cart-drawer-items');
          cartItems.removePlan(line,qty,id);
        },delay);  
      });
      setTimeout(function(){
        const cartItems2 = document.querySelector("cart-drawer-items");
        cartItems2.freeItemAdd();
        cartItems2.onCartUpdate();
        $('cart-remove-sub').hide();
        $('cart-add-sub').show();
        $('.subscription-header').removeClass('active');
      },delay+500)
    });
  }
}
customElements.define('cart-remove-sub', CartRemoveSub);
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
    });
  }
}

customElements.define('cart-remove-button', CartRemoveButton);



class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById('CartDrawer-LineItemStatus');

    const debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, ON_CHANGE_DEBOUNCE_TIMER);

    this.addEventListener('change', debouncedOnChange.bind(this));
  }

  cartUpdateUnsubscriber = undefined;

  connectedCallback() {
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (event.source === 'cart-items') {
        return;
      }
      this.onCartUpdate();
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  
  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  onCartUpdate() {
    fetch('/cart?section_id=cart-drawer')
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const sourceQty = html.querySelector('cart-drawer');
        $("cart-drawer").html(sourceQty.innerHTML);
      })
      .catch(e => {
        console.error(e);
      });
      
    setTimeout(function () {
      if($(".upsell_slider").length > 0){
        $(".upsell_slider").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          fade: true,
          prevArrow:'<i class="far fa-chevron-left "></i>',
          nextArrow:'<i class="far fa-chevron-right nextone"></i>',
          adaptiveHeight: true
        });
      }
      if ($('#hasShipping').prop('checked')) {
        let freeShip=parseFloat($('#hasShipping').val());
        let totalPrice=parseFloat($('.totals__subtotal-value').data('price'))+freeShip;
        $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
      }else{
        let totalPrice=parseFloat($('.totals__subtotal-value').data('price'));
        $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
      }
      },1500);
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      {
        id: 'main-cart-footer',
        section: document.getElementById('main-cart-footer').dataset.id,
        selector: '.js-contents'
      }
    ];
  }
  
  addPlan(line, quantity, plan, id) {
    // alert(line);
    this.enableLoading(line);
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: {
        cache:false,
        async:false,
        line:line,
        quantity: quantity,
        selling_plan: plan
      },
      dataType: 'json',
      success: function (data) {
        return true;
      }
    });
  }
  removePlan(line, quantity, id) {
    // alert(line);
    this.enableLoading(line);
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: {
        cache:false,
        async:false,
        line:line,
        quantity: quantity,
        selling_plan: null
      },
      dataType: 'json',
      success: function (data) {
        console.log(data);
      }
    });
  }
  updateQuantity(line, quantity, name) {
    this.enableLoading(line);

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    fetch(`${routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then((state) => {
        const parsedState = JSON.parse(state);
        const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
        const items = document.querySelectorAll('.cart-item');

        if (parsedState.errors) {
          quantityElement.value = quantityElement.getAttribute('value');
          this.updateLiveRegions(line, parsedState.errors);
          return;
        }

        this.classList.toggle('is-empty', parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector('cart-drawer');
        const cartFooter = document.getElementById('main-cart-footer');

        if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);
        if (cartDrawerWrapper) cartDrawerWrapper.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section => {
          const elementToReplace = 
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          elementToReplace.innerHTML = 
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        }));
        const updatedValue = parsedState.items[line - 1] ? parsedState.items[line - 1].quantity : undefined;
        let message = '';
        if (items.length === parsedState.items.length && updatedValue !== parseInt(quantityElement.value)) {
          if (typeof updatedValue === 'undefined') {
            message = window.cartStrings.error;
          } else {
            message = window.cartStrings.quantityError.replace('[quantity]', updatedValue);
          }
        }
        this.updateLiveRegions(line, message);

        const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper ? trapFocus(cartDrawerWrapper, lineItem.querySelector(`[name="${name}"]`)) : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper.querySelector('.drawer__inner-empty'), cartDrawerWrapper.querySelector('a'))
        } else if (document.querySelector('.cart-item') && cartDrawerWrapper) {
          trapFocus(cartDrawerWrapper, document.querySelector('.cart-item__name'))
        }
        publish(PUB_SUB_EVENTS.cartUpdate, {source: 'cart-items'});
      }).catch(() => {
        this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.cartStrings.error;
      })
      .finally(() => {
        this.disableLoading(line);
        const cartDrawerItems = document.querySelector("cart-drawer-items");
        if ($('#hasShipping').prop('checked')) {
          let freeShip=parseFloat($('#hasShipping').val());
          let totalPrice=parseFloat($('.totals__subtotal-value').data('price'))+freeShip;
          $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
        }else{
          let totalPrice=parseFloat($('.totals__subtotal-value').data('price'));
          $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
        }
        cartDrawerItems.freeItemAdd();
        
      });
    setTimeout(function () {
      if($(".upsell_slider").length > 0){
        $(".upsell_slider").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          fade: true,
          prevArrow:'<i class="far fa-chevron-left "></i>',
          nextArrow:'<i class="far fa-chevron-right nextone"></i>',
          adaptiveHeight: true
        });
      }
    },1500);
  }
  freeItemAdd(){
    if ($('#hasFreeOn150').is(':checked') && $('#hasFreeOn100').is(':checked')) {
      if ($('#hasFreeOn150').is(':checked')) {
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
          if((responce.total_price >= threshold100) && (responce.total_price < threshold150)  && (has150)){
            $.ajax({
              type: 'POST',
              url: '/cart/change.js',
              data: {
                cache:false,
                async:false,
                quantity: 0,
                id: product150
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
                if((has150)){
                  $.ajax({
                    type: 'POST',
                    url: '/cart/change.js',
                    data: {
                      cache:false,
                      async:false,
                      quantity: 0,
                      id: product150
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
      }
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
  }
  updateLiveRegions(line, message) {
    const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) lineItemError.querySelector('.cart-item__error-text').innerHTML = message;

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.add('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) => overlay.classList.remove('hidden'));

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute('aria-hidden', false);
  }

  disableLoading(line) {
    const mainCartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
    mainCartItems.classList.remove('cart__items--disabled');

    const cartItemElements = this.querySelectorAll(`#CartItem-${line} .loading-overlay`);
    const cartDrawerItemElements = this.querySelectorAll(`#CartDrawer-Item-${line} .loading-overlay`);

    cartItemElements.forEach((overlay) => overlay.classList.add('hidden'));
    cartDrawerItemElements.forEach((overlay) => overlay.classList.add('hidden'));
  }
}

customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define('cart-note', class CartNote extends HTMLElement {
      constructor() {
        super();

      this.addEventListener('change', debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
      }, ON_CHANGE_DEBOUNCE_TIMER))
      }
  });
};
$(document).ready(function (params) {
  var id=$('#shippingProduct').val();
  $.ajax({
    type: 'POST',
    url: '/cart/change.js',
    data: {
      id:id,
      quantity: 0
    },
    dataType: 'json',
    success: function (data) {
      const cartItems2 = document.querySelector("cart-drawer-items");
      cartItems2.onCartUpdate();
    }
  });
  
})
$(document).on('click','#CartDrawer-Checkout',function (e) {
  e.preventDefault();
  if($('#hasSP').val() == "hasSP"){
    if ($('#hasShipping').prop('checked')) {
      var id=$('#shippingProduct').val();
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          quantity: 1,
          id: id
        },
        dataType: 'json', 
        success: function (data) {
          window.location.href = "/checkout";
        } 
      });
    }else{
      window.location.href = "/checkout";
    }
  }
});

$(document).on('click','button.button.upsell-btn',function (e) {
  e.preventDefault();
  var id=$(this).parents('.product-card-form').find('.upsell-variant').val();
  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: {
      quantity: 1,
      id: id
    },
    dataType: 'json', 
    success: function (data) {
      const cartItems2 = document.querySelector("cart-drawer-items");
      cartItems2.freeItemAdd();
      cartItems2.onCartUpdate();
    } 
  });
});
$(document).on('change','#hasShipping',function (e) {
  if ($('#hasShipping').prop('checked')) {
    let freeShip=parseFloat($(this).val());
    let totalPrice=parseFloat($('.totals__subtotal-value').data('price'))+freeShip;
    $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
  }else{
    let totalPrice=parseFloat($('.totals__subtotal-value').data('price'));
    $('.totals__subtotal-value').text($('#cartSymbol').val()+totalPrice.toFixed(2)+' '+$('#cartCurrency').val());
  }
})
$(document).on('click','#cart-icon-bubble',function (e) {
  if($(".upsell_slider").length > 0){
  $(".upsell_slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    prevArrow:'<i class="far fa-chevron-left "></i>',
    nextArrow:'<i class="far fa-chevron-right nextone"></i>',
    adaptiveHeight: true
  });
  }
});