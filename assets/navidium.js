
function useConsole(...rest) {
  // console.log('%c Navidium App:', 'color: #00a0e9; font-weight: bold;', ...rest);
}
(function injectCss() {
  const cssId = 'nvd-styles';
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://navidiumcheckout.com/cdn/nvd-styles-regular.css';
    link.media = 'all';
    head.appendChild(link);
  }
})();
(function storeCurrency() {
  const currency = Shopify.currency;
  useConsole('storing currency', currency);
  localStorage.setItem('nvdCurrency', JSON.stringify(currency));
})();
function findClosest(arr, target, adjustment = 'rounding_down') {
  if (!arr || !arr.length) return null;
  let toMatch = parseFloat(target);
  let finalOutput = 0.0;
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let current = arr[i];
    let next = arr[i + 1];
    if (toMatch >= current && toMatch <= next) {
      if (adjustment === 'rounding_down') finalOutput = current;
      if (adjustment === 'rounding_up') finalOutput = next;
      break;
    } else if (toMatch <= current) {
      finalOutput = current;
      break;
    }
  }
  return finalOutput;
}
async function removeNavidium() {
  fetch('/cart.js').then((res) => res.json()).then((cart) => {
    const { items } = cart;
    items.forEach(async (item) => {
      if (item.handle.includes('navidium')) {
        useConsole('removing navidium ---->>>');
        const request = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id: String(item.variant_id),
            quantity: 0,
          }),
        };
        fetch('/cart/change.js', request).then((res) => res.json()).then((dt) => location.reload());
      }
    });
  });
}
removeNavidium();
const shopCurrency = nvdShopCurrency;
function formatMoney(cents, format = shopCurrency) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt === 'undefined' ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100.0).toFixed(precision);
    const parts = number.split('.');
    const dollars = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`,
    );
    const cents = parts[1] ? decimal + parts[1] : '';

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
    default:
      value = formatWithDelimiters(cents, 2);
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

const prefetch = async (callback) => {
  // TODO: check nvd_config in localStorage
  let nvdConfig = localStorage.getItem('nvdconfig')
    ? JSON.parse(localStorage.getItem('nvdconfig'))
    : null;
  // verify with the shop name
  if (nvdConfig) {
    // check expiration
    const today = new Date();
    const expiration = new Date(nvdConfig.expiration);
    if (today > expiration) {
      // expired
      localStorage.removeItem('nvdconfig');
      nvdConfig = null;
      prefetch();
    }
    // var tomorrow = new Date();
    // tomorrow.setDate(today.getDate()+3);
    useConsole('Navidium config avaialable in storage');
  } else {
    useConsole('Navidium config not available in storage');
    await fetch(
      `https://app.navidiumapp.com/api/widget-v8.php?shop_url=${nvdShop}`,
    )
      .then((res) => res.json())
      .then((initialData) => {
        useConsole(initialData);
        const today = new Date();
        const shopConfig = {
            
          success: initialData.success,
          show_on_cart: initialData.nvd_show_cart,
          show_on_checkout: initialData.nvd_show_checkout,
          widget_location: initialData.widget_location,
          auto_insurance: initialData.nvd_auto_insurance,
          nvd_name: initialData.nvd_name,
          nvd_subtitle: initialData.nvd_subtitle,
          widget_icon: initialData.nvd_widget_icon,
          learnMore: initialData?.nvd_learn_more,
          nvd_description: initialData.nvd_description,
          nvd_message: initialData.nvd_message,
          protection_variants: initialData.nvd_variants,
          product_exclusion: initialData.product_exclusion.split(','),
          min_protection_price: initialData.min_protection_value,
          max_protection_price: initialData.max_protection_value,
          protection_type: initialData.nvd_protection_type,
          protection_percentage: initialData.nvd_protection_type_value,
          min_protection_variant: initialData.min_variant_id,
          max_protection_variant: initialData.max_variant_id,
          expiration: today.setDate(today.getDate() + 3),            
            
            previewMode: initialData.nvd_preview_mode,
            rounding_value: initialData.rounding_value,
            maxThreshold: initialData.threshold_value,
          
        };
        
        localStorage.setItem('nvdconfig', JSON.stringify(shopConfig));
        if (callback) return callback();
      })
      .catch((err) => {
        useConsole(
          '%c navidium error',
          'color: yellow; background-color: red; font-size: 12px',
          err,
        );
      });
  }
};



const calculateProtection = async (cartTotal, nvdConfig) => {
    let conversionRate = parseFloat(Shopify.currency.rate);
    let convertedTotal = cartTotal / conversionRate;
    let protection_type = nvdConfig.protection_type;
    let protection_percentage = nvdConfig.protection_percentage;
    let protectionId;
    let protectionPrice;
    let minPrice = Number(nvdConfig.min_protection_price);
    let maxPrice = Number(nvdConfig.max_protection_price);
    let minId = nvdConfig.min_protection_variant;
    let maxId = nvdConfig.max_protection_variant;
    let protectionVariants = nvdConfig.protection_variants;
    let PriceRounding = nvdConfig.rounding_value;
    
    protection_type = parseInt(protection_type);
    console.log('113 protection_type', protection_type)
    // TODO: check protection type
    if (protection_type == 1) {
      // protection is dynamic
      let ourProtectionPrice = (convertedTotal * protection_percentage) / 100;
      ourProtectionPrice = ourProtectionPrice.toFixed(2);

      // calculate the protection
      if (ourProtectionPrice < minPrice) {
        console.log('Our protection price is less than minimum');
        protectionPrice = minPrice;
        protectionId = minId;
        return {
          price: protectionPrice,
          variant_id: protectionId
        }
      } else if (ourProtectionPrice > maxPrice) {
        console.log('Our protection price is greater than maximum');
        protectionPrice = maxPrice;
        protectionId = maxId;
        return {
          price: protectionPrice,
          variant_id: protectionId
        }
      } else {
        console.log('calculating protection')
       
        const priceArray = Object.keys(protectionVariants);
          priceArray.sort((a, b) => a - b);
          protectionPrice = findClosest(priceArray, ourProtectionPrice, PriceRounding);
            if (protectionPrice == 0) {
              return {
                price: maxPrice,
                variant_id: maxId
              }
            }
          protectionId = protectionVariants[protectionPrice];
          console.log({
            price: protectionPrice,
            variant_id: protectionId,
          });
          return {
            price: protectionPrice,
            variant_id: protectionId,
          } 
      }
    }else {
      // protection is static.so hit the api
      console.log('protection is static');
      let apiURL = await fetch(`https://app.navidiumapp.com/api/variant-id-checker-api-march6.php?shop_url=${nvdShop}&price=` + cartTotal);
      let data = apiURL.json();
      return data;
    }
}

const nvd_init = async () => {
  console.time('nvd_init');
  localStorage.setItem('nvd_running', true);
  const shopConfig = localStorage.getItem('nvdconfig')
    ? JSON.parse(localStorage.getItem('nvdconfig'))
    : null;
  if (shopConfig) {
    useConsole('Navidium config avaialable in storage');
  } else {
    useConsole('Navidium config not avaialable in storage. Prefetching now');
    await prefetch(nvd_init);
    return;
  }
  const cartProtectionVariant = localStorage.getItem('cart_protection')
    ? localStorage.getItem('cart_protection')
    : null;

  const optedOut = JSON.parse(localStorage.getItem('nvd_opted_out'));
  let showWidget = true;
  
  if (shopConfig.show_on_cart === '0') showWidget = false;

  useConsole('showWidget', showWidget);

  const { success } = shopConfig;

  let checked;

  let nvdVariant;

  useConsole('in cart protection variant', cartProtectionVariant);
  // check if widget should be shown and limit did not exceeded
  if (showWidget && success) {
    const cart = await getCartCallback(checkCart);
    const cartTotal = (await cart.total) / 100;
    useConsole('after exclusion total price is', cartTotal);
    const getProtection = await calculateProtection(cartTotal, shopConfig);
    console.log({ getProtection });
    const variantFromApi = await getProtection.variant_id;
    const priceFromApi = await getProtection.price;
    const auto_insurance = shopConfig.auto_insurance;
// Max threshold
    let maxThresholdPrice = parseFloat(shopConfig.maxThreshold);
    maxThresholdPrice = (maxThresholdPrice * parseFloat(Shopify.currency.rate)).toFixed(2);
  //console.log('%cNVD Max threshold','background:red;color:#fff;padding:0 3px;',maxThresholdPrice);
// End of max threshold
    const cartEmpty = cartTotal === 0;
    const widgetPlaceHolders = document.querySelectorAll('.nvd-mini');
    const haveWidgetPlaceHolders = widgetPlaceHolders.length > 0;
    // now we get the cart total price and time to hit the second api
    localStorage.setItem('nvdProtectionPrice', priceFromApi);
    localStorage.setItem('nvdVariant', variantFromApi);
    if (cartEmpty || maxThresholdPrice <= cartTotal) {
      console.log('cart total is zero or max threshold true. No need to add protection');
      return;
    }
    //Do not touch this logic
    var auto_insurance_checker = parseInt(shopConfig.auto_insurance);
    if(auto_insurance_checker != 1){
        checked = false;
    }
    
    if(optedOut == true || optedOut == null){
        checked = false
    }else{
        checked = true;
    }

    if(auto_insurance_checker == 1 && optedOut == null){
        checked = true
    }
    
    if(auto_insurance_checker == 1 && optedOut == false){
        checked = true
    }
    //do not touch ends

    useConsole('widget check status: ', checked);
    // now check the variant in cart is equal to the variant in api return
    if (cartProtectionVariant) {
      if (cartProtectionVariant === variantFromApi) {
        useConsole(
          '1. cart variant is same as the api variant,stay idle and build widget',
          cartProtectionVariant,
          variantFromApi,
        );
        nvdVariant = cartProtectionVariant;
        if (document.querySelector('.nvd-mini')) {
          document.querySelectorAll('.nvd-mini').forEach((item) => {
            item.innerHTML = buildWidget(
              shopConfig,
              priceFromApi,
              nvdVariant,
              checked ? 'checked' : '',
            );
          });
        }
        checkWidgetView();
      } else {
        useConsole(
          'cart variant and api variant is not same.swapping them now',
        );
        nvdVariant = variantFromApi;
        // now remove the previous navidium variant from cart
        if (cartProtectionVariant) {
          // now add the new protection to the cart
          if (checked) useConsole('removing old and adding new protection');
        }

        // now append the snippet
        if (document.querySelector('.nvd-mini')) {
          document.querySelectorAll('.nvd-mini').forEach((item) => {
            item.innerHTML = buildWidget(
              shopConfig,
              priceFromApi,
              nvdVariant,
              checked ? 'checked' : '',
            );
          });
        }
        checkWidgetView();
      }
    } else if (checked) {
      useConsole(
        'Protection Not available. Adding now.',
        cartProtectionVariant,
        variantFromApi,
      );
      nvdVariant = variantFromApi;
      localStorage.setItem('nvd_opted_out', false);
      if (document.querySelector('.nvd-mini')) {
        document.querySelectorAll('.nvd-mini').forEach((item) => {
          item.innerHTML = buildWidget(
            shopConfig,
            priceFromApi,
            nvdVariant,
            checked ? 'checked' : '',
          );
        });
      }
      checkWidgetView();
    } else {
      nvdVariant = variantFromApi;
      useConsole('no protection available, just append snippet');
      if (document.querySelector('.nvd-mini')) {
        document.querySelectorAll('.nvd-mini').forEach((item) => {
          item.innerHTML = buildWidget(
            shopConfig,
            priceFromApi,
            nvdVariant,
            checked ? 'checked' : '',
          );
        });
      }
      checkWidgetView();
    }

    // now
  } else {
    // when navidium widget is shut off
    useConsole(
      '%c Navidium Message:widget is shut off or limit reached.Please turn on from your app settings or check you have not exceeded your limit',
      'color: yellow; background-color: blue; font-size: 12px',
    );
  }
  console.timeEnd('nvd_init');
  localStorage.setItem('nvd_running', false);
  updateLiveCart();
};

// function to get cart data and pass the data to another callback for processing.
const getCartCallback = async (callback) => {
  const cart = await fetch('/cart.js');
  const cartData = await cart.json();

  if (callback) return callback(cartData);

  return cartData;
};

// function to check cart items
const checkCart = async (cartData, callback = null) => {
  const currency = await cartData.currency;
  useConsole('cart in check cart', cartData);
  if (cartData.items.length != 0) {
    const { items } = cartData;
    let total = parseFloat(cartData.total_price);
    const nvdCounterArray = [];
    let recheck = false;
    let dupeVariant;
    const shopConfig = localStorage.getItem('nvdconfig')
      ? JSON.parse(localStorage.getItem('nvdconfig'))
      : null;

    const excludedSKUs = shopConfig.product_exclusion;
    
    // if no shop config is found wait and call prefetch
    if (!shopConfig) {
      await prefetch();
    }

    useConsole('product exclusion', excludedSKUs);
    const promises = await items.forEach((item) => {
      // check for duplicate navidium
      if (item.handle.includes('navidium-shipping-protection')) {
        nvdCounterArray.push(item.variant_id);

        useConsole('protection available in cart');

        localStorage.setItem('cart_protection', item.variant_id);

        total -= item.final_line_price;

        useConsole('nvd1', total);
        if (item.quantity > 1) {
          useConsole('Found duplicate protection in cart,decreasing now');

          // as cart total is update. we need to call the checkCart function recursively
          recheck = true;
          dupeVariant = item.variant_id;
        } else {
          useConsole('protection duplication test passed');
        }
      } else {
        excludedSKUs.forEach((sku) => {
          if (item.sku === sku) {
            useConsole(
              '%c Navidium Message:Product is excluded',
              'color: yellow; background-color: blue; font-size: 16px',
              item.sku,
              item.final_price,
            );
            // substract the item price from total
            total -= item.final_line_price;
            useConsole('ex1', total);
          }
        });
      }
    });
    if (recheck === true) {
      const mutateCart = adjustProtectionQuantity(dupeVariant, 0, false);
      useConsole('calling checkCart function recursively', mutateCart);
      getCartCallback(checkCart);
    }
    if (nvdCounterArray.length > 1) {
      useConsole(
        '%cfound more than one variant of navidium protection in cart,removing all now',
        'color:red',
      );
      nvdCounterArray.forEach((item) => {
        useConsole('removing variant', item);
        adjustProtectionQuantity(item, 0);
        localStorage.removeItem('cart_protection');
        recheck = false;
      });
    }
    if (nvdCounterArray.length == 0) {
      useConsole('No protection available in cart');
      localStorage.removeItem('cart_protection');
    }
    if (nvdCounterArray.length == items.length) {
      useConsole('no items in cart rather than protection');
      fetch('/cart/clear.js').then((res) => {
        useConsole('cart cleared');
        window.location.reload();
        localStorage.removeItem('cart_protection');
      });
    }
    return {
      total: parseFloat(total),
      currency,
    };
  }
  return {
    total: 0,
    currency,
  };
};

// function to add protection to cart
const addProtection = async (variantId, quantity = 1, reload = false) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: variantId,
      quantity,
    }),
  };

  const cartData = await fetch('/cart/add.js', request);
  const cartJson = await cartData.json();
  if (cartJson.id) {
    localStorage.setItem('nvd_opted_out', false);
    localStorage.setItem('cart_protection', variantId);
    useConsole(
      '%c Protection added successfully',
      'color: white; background-color: green',
    );
    localStorage.removeItem('nvdconfig');
    location.href = '/checkout';
  }
  
};

//   function to remove protection
const removeProtection = async (variantId, reload = false) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: String(variantId),
      quantity: 0,
    }),
  };

  const cartData = await fetch('/cart/change.js', request);
  const cartJson = await cartData.json();
  localStorage.setItem('nvd_opted_out', true);
  localStorage.removeItem('cart_protection');
  if (cartJson.token) {
    useConsole(
      '%c Protection removed successfully',
      'color: white; background-color: red',
    );
    updateLiveCart(cartJson);
  }

  checkWidgetView();
  if (reload) {
    location.reload();
  } else {
    return cartJson;
  }
};
  // function to update protection variant from cart
const adjustProtectionQuantity = async (
  variantId,
  quantity,
  reload = false,
) => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: String(variantId),
      quantity: String(quantity),
    }),
  };

  const cartData = await fetch('/cart/change.js', request);

  const cartJson = await cartData.json();

  useConsole(
    '%cnew cart instance after duplicate protection quantity decrease',
    'color:yellow',
    cartJson,
  );
  console.dir(cartJson);
  updateLiveCart(cartJson);
  if (reload) {
    location.reload();
  } else {
    return cartJson;
  }
};
const updateWidgetPrice = async () => {
  useConsole('updating widget price');
  const cartData = await fetch('/cart.js').then((res) => res.json());
  const widget = document.querySelector('#nvd-widget-cart');

  if (widget == null) return;

  const items = await cartData.items;
  items.forEach((item) => {
    useConsole(item);
    if (item.handle.includes('navidium-shipping-protection')) {
      useConsole(' updating navidium price');
      const price = formatMoney(item.price, shopCurrency);
      const priceElem = document.querySelector('.shipping-protection-price');
      if (priceElem) priceElem.innerHTML = price;
    }
  });
};
  // function remove and add protection to cart
const removeAndAddProtection = async (remove, add, reload = false) => {
  const removeRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: String(remove),
      quantity: 0,
    }),
  };

  const addRequest = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      id: String(add),
      quantity: 1,
    }),
  };

  await fetch('/cart/change.js', removeRequest)
    .then((res) => res.json())
    .then((data) => {
      useConsole('removed and now adding');

      fetch('/cart/add.js', addRequest)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            useConsole(
              '%c Protection swapped successfully',
              'color: white; background-color: green',
            );
            updateLiveCart(null);
          }

          localStorage.setItem('nvd_opted_out', false);
          localStorage.setItem('cart_protection', add);

          if (reload) {
            location.reload();
          }
        });
    });
};
  // widget switch on/off listener function
const getShippingProtection = async (variantId, price, e) => {
  const { checked } = e;

  if (!checked) {
    useConsole('unchecking and removing protection');
    localStorage.setItem('nvd_opted_out', true);
    nvd_init();
    updateLiveCart();
  } else {
    useConsole('checked and adding protection');
    localStorage.setItem('nvd_opted_out', false);
    nvd_init();
    updateLiveCart();
  }
};

// function to update subtotal and dom cart item's line id
const updateLiveCart = async (cartData = null) => {
  let cart = cartData;
  if (cart == null) cart = await getCartCallback();
  let curRate = Shopify.currency.rate

  let cartTotal = cart.total_price;
  const protectionPrice = Number(localStorage.getItem('nvdProtectionPrice'));
  useConsole('protection price-->>', protectionPrice);
  let totalPrice;
  const cartItems = cart.items;
  const totalCount = cart.item_count;
  const optedOut = localStorage.getItem('nvd_opted_out') ? Boolean(JSON.parse(localStorage.getItem('nvd_opted_out'))) : null;

  // change the cart item class name here.
  const lineAttribute = 'data-line';
  const quantityPlus = '[data-action="increase-quantity"]';
  const quantityMinus = '[data-action="decrease-quantity"]';
  const removeItem = '.line-item__quantity-remove';
  const totalElem = document.querySelectorAll(nvdControls.subtotal_item);
  const cartCountElem = document.querySelectorAll(nvdControls.cartCounter);
  const cartItemNodes = document.querySelectorAll('.item__cart');
  const cartItemsList = Array.from(cartItemNodes);
  let currentCount;
  let XtotalPrice;
  //  if not opted out show one less in count
  if (optedOut == false) {
    currentCount = totalCount;
    XtotalPrice = cartTotal + ((protectionPrice * parseFloat(curRate)) * 100);
    totalPrice = formatMoney(XtotalPrice, shopCurrency);
    useConsole('x total price', XtotalPrice);
  }
  if (optedOut == true || optedOut == null) {
    totalPrice = formatMoney(cart.total_price, shopCurrency);
    currentCount = totalCount;
    useConsole(' total price', totalPrice);
  }
  useConsole('updating subtotal', totalPrice);
  if (cart.item_count == 0) currentCount = 0;
  useConsole('current and cart count', currentCount, totalCount);
  if (totalElem) totalElem.forEach((elem) => (elem.innerHTML = totalPrice));
  if (cartCountElem) { cartCountElem.forEach((elem) => (elem.innerHTML = `(${currentCount} items)`)); }
  await updateCartLine(
    lineAttribute,
    cartItemsList,
    cartItems,
    quantityPlus,
    quantityMinus,
    removeItem,
  );
};

// function to update the line index in dom cart line items
let updateCartLine = async (
  lineAttribute,
  cartItemsList,
  cartItems,
  qtyPlus,
  qtyMinus,
  rmvItem,
) => {
  useConsole(cartItemsList, lineAttribute);
  // for every line item in cart dom check with the cart items.
  await cartItemsList.forEach((item) => {
    useConsole(item.innerHTML.toString().includes('/products/navidium-shipping-protection'));
    if (item.innerHTML.toString().includes('/products/navidium-shipping-protection') == true) {
      item.style.display = 'none !important';
      item.remove();
    }
    cartItems.forEach((cartItem, index) => {
      if (item.innerHTML.toString().includes(cartItem.url)) {
        useConsole(item.querySelector(`[${lineAttribute}]`));
        const lineItem = item.querySelectorAll(`[${lineAttribute}]`);
        const removeItem = item.querySelectorAll(rmvItem);
        const quantityPlus = item.querySelectorAll(qtyPlus);
        const quantityMinus = item.querySelectorAll(qtyMinus);
        if (lineItem) {
          lineItem.forEach((item) => item.setAttribute(lineAttribute, index + 1));
        }
        if (quantityPlus) {
          quantityPlus.forEach((item) => item.setAttribute(
            'data-href',
            `/cart/change?quantity=${cartItem.quantity + 1}&line=${index + 1
            }`,
          ));
        }
        if (quantityMinus) {
          quantityMinus.forEach((item) => item.setAttribute(
            'data-href',
            `/cart/change?quantity=${cartItem.quantity - 1}&line=${index + 1
            }`,
          ));
        }
        if (removeItem) {
          removeItem.forEach((item) => item.setAttribute(
            'href',
            `/cart/change?line=${index + 1}&quantity=0`,
          ));
        }
        useConsole('line id updated');
      }
    });
  });
};
  // opt in message toggle function
const checkWidgetView = () => {
  const optedOut = localStorage.getItem('nvd_opted_out');
  const selected = document.querySelector('.nvd-selected');
  const deselected = document.querySelector('.nvd-dis-selected');
  if (optedOut == 'true') {
    if (selected) selected.style.display = 'none';
    if (deselected) deselected.style.display = 'block';
  } else {
    if (selected) selected.style.display = 'block';
    if (deselected) deselected.style.display = 'none';
  }
};

// function that will track the widget real time

const trackWidget = () => {
  const nvd_running = localStorage.getItem('nvd_running');

  const startTracking = setInterval(() => {
    const nvdContainer = document.querySelector('.nvd-mini');
    let hasWidget;
    if (nvdContainer) hasWidget = nvdContainer.innerHTML.length;

    if (hasWidget < 1) {
      if (nvd_running == 'false') {
        useConsole('widget not available, initiating widget');
        setTimeout(nvd_init, 0);
      }
    }
  }, 1000);
};

// function to build the widget
let buildWidget = (shopConfig, priceFromApi, nvdVariant, checked) => {
  const {
    nvd_name,
    nvd_subtitle,
    nvd_description,
    widget_icon,
    nvd_message,
    learnMore,
  } = shopConfig;
  const protectionPrice = priceFromApi;
  const protectionVariant = nvdVariant;
  const protectionCheckbox = checked ? 'checked' : '';
  const selectedStyle = protectionCheckbox
    ? "'display: block'"
    : "'display: none'";
  const diselectedStyle = protectionCheckbox
    ? "'display: none'"
    : "'display: block'";

  let learnMoreMarkup = '';
  if (learnMore.length !== 0 && learnMore.includes('https://')) {
    learnMoreMarkup = `<button type="button" class="btnCstm tooltipCstm">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0C3.36433 0 0 3.36433 0 7.5C0 11.6357 3.36433 15 7.5 15C11.6357 15 15 11.6357 15 7.5C15 3.36433 11.6357 0 7.5 0ZM7.5 11.875C7.15496 11.875 6.87504 11.595 6.87504 11.25C6.87504 10.905 7.15496 10.625 7.5 10.625C7.84504 10.625 8.12496 10.905 8.12496 11.25C8.12496 11.595 7.84504 11.875 7.5 11.875ZM8.48934 7.90123C8.26813 8.00308 8.12496 8.22624 8.12496 8.46943V8.75004C8.12496 9.09496 7.84561 9.375 7.5 9.375C7.15439 9.375 6.87504 9.09496 6.87504 8.75004V8.46943C6.87504 7.73998 7.30373 7.0713 7.96566 6.76563C8.60252 6.47255 9.06246 5.69435 9.06246 5.31246C9.06246 4.45129 8.36185 3.75 7.5 3.75C6.63815 3.75 5.93754 4.45129 5.93754 5.31246C5.93754 5.6575 5.65807 5.93754 5.31246 5.93754C4.96685 5.93754 4.6875 5.6575 4.6875 5.31246C4.6875 3.7619 5.94933 2.49996 7.5 2.49996C9.05067 2.49996 10.3125 3.7619 10.3125 5.31246C10.3125 6.15692 9.57996 7.39815 8.48934 7.90123Z" fill="#212B36">
                    </path>
                </svg>
                <span class="toolltiptextCstm"><a style="color:#fff" href="${learnMore}" target="_blank">${learnMore}</a></span>
            </button>`;
  }
  else if(learnMore.length !== 0){
    learnMoreMarkup = `<button type="button" class="btnCstm tooltipCstm">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 0C3.36433 0 0 3.36433 0 7.5C0 11.6357 3.36433 15 7.5 15C11.6357 15 15 11.6357 15 7.5C15 3.36433 11.6357 0 7.5 0ZM7.5 11.875C7.15496 11.875 6.87504 11.595 6.87504 11.25C6.87504 10.905 7.15496 10.625 7.5 10.625C7.84504 10.625 8.12496 10.905 8.12496 11.25C8.12496 11.595 7.84504 11.875 7.5 11.875ZM8.48934 7.90123C8.26813 8.00308 8.12496 8.22624 8.12496 8.46943V8.75004C8.12496 9.09496 7.84561 9.375 7.5 9.375C7.15439 9.375 6.87504 9.09496 6.87504 8.75004V8.46943C6.87504 7.73998 7.30373 7.0713 7.96566 6.76563C8.60252 6.47255 9.06246 5.69435 9.06246 5.31246C9.06246 4.45129 8.36185 3.75 7.5 3.75C6.63815 3.75 5.93754 4.45129 5.93754 5.31246C5.93754 5.6575 5.65807 5.93754 5.31246 5.93754C4.96685 5.93754 4.6875 5.6575 4.6875 5.31246C4.6875 3.7619 5.94933 2.49996 7.5 2.49996C9.05067 2.49996 10.3125 3.7619 10.3125 5.31246C10.3125 6.15692 9.57996 7.39815 8.48934 7.90123Z" fill="#212B36">
                    </path>
                </svg>
                <span class="toolltiptextCstm">${learnMore}</span>
            </button>`;
  }
  const snippet = `<div class="appearance-right-previw" id="nvd-widget-cart">
         <div class="d-flexCstm">
           <div class="flex-shrink-0Cstm">
             <div class="form-checkCstm form-switchCstm">
               <input class="forms-check-inputCstm" type="checkbox" id="shippingProtectionCheckBox"
                 onclick="getShippingProtection('${protectionVariant}','${protectionPrice}', this)" ${protectionCheckbox} data-protected-variant="${protectionVariant}">
                 <div class="img">
                   <img class="navidium-shipping-icon" width="auto" height="auto" src="${widget_icon}" alt="Navidium icon">
                   <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path
                       d="M9.8056 0.867554L0.00976562 4.2023C0.218188 8.16232 -0.177814 14.415 0.635031 17.1245C1.32282 19.4171 7.16558 23.8634 9.8056 25.6698C11.9593 23.9329 17.3442 20.4317 18.3509 18.1666C20.0183 14.415 19.8793 8.09285 19.6014 4.2023L9.8056 0.867554Z"
                       fill="#6D7175"></path>
                     <path d="M5.01172 13.1644L7.92963 16.7076L14.3907 10.0381" stroke="white" stroke-width="1.66738"
                       stroke-linecap="round" stroke-linejoin="round"></path>
                   </svg>
                 </div>
             </div>
           </div>
           <div class="flex-grow-1Cstm ms-3Cstm">
              <h4>${nvd_name}
                ${learnMoreMarkup}
              </h4>
              <p>${nvd_subtitle}
                <strong class="shipping-protection-price">
                  ${formatMoney(
    protectionPrice * 100 * parseFloat(Shopify.currency.rate),
    shopCurrency,
  )}
                </strong>
              </p>
              <p class="nvd-selected" style=${selectedStyle}>${nvd_description}</p>
              <p class="nvd-dis-selected" style=${diselectedStyle}>${nvd_message}</p>
           </div>
         </div>
       </div>`;
  return snippet;
};
function listenNetWorkEvents() {
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.send = function (...args) {
    console.log('XHR send', args);
    return originalSend.apply(this, args);
  };

  XMLHttpRequest.prototype.open = function (...args) {
    const [method, url] = args;
    console.log('XHR captured', args);

    const isNvdEvent = url.includes('?nvdEvent=true');
    const isStoreCartRequest = url.includes('/cart/change') || url.includes('/cart/add') || url.includes('/cart/update');
    if (!isNvdEvent && isStoreCartRequest) setTimeout(nvd_init(), 1500);
    return originalOpen.apply(this, args);
  };
  const { fetch: originalFetch } = window;
  window.fetch = async (...args) => {
    const [resource, config] = args;
    console.log('FETCH captured', resource, args);
    const url = String(resource);
    const isNvdEvent = url.includes('?nvdEvent=true');
    const isStoreCartRequest = url.includes('/cart/change') || url.includes('/cart/add') || url.includes('/cart/update');
    const response = await originalFetch(resource, config);
    if (isStoreCartRequest && !isNvdEvent) setTimeout(nvd_init(), 1500);
    return response;
  };
}

  function debounce(func, wait=500, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };



let isDOMLoaded = false;
window.addEventListener('DOMContentLoaded', () => {
  isDOMLoaded = true;
  prefetch();
  new Promise(function(resolve, reject) {
        setTimeout(nvd_init, 0);
    }).then(function() {
        updateLiveCart(null);
        console.log("Wrapped setTimeout after 2000ms");
    })
  
  
});



  // Main trigger area
  
  // window.addEventListener(
  //   'click',
  //   (ev) => {
  //     const navidiumTriggers = Array.from(
  //       document.querySelectorAll('[name="add"], [name="add"] *, .quantity-selector button, .quantity-selector button *, .remove, .remove *, .quantity__button, .quantity__button *, #cart-icon-bubble, #cart-icon-bubble *')
  //     );
  //     const elm = ev.target;
  //     if (navidiumTriggers.includes(elm)) {
  //       let checkoutBtn = document.querySelectorAll('[name="checkout"]');
  //       if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = true)
  //       useConsole('navidium triggered slide cart');
  //       setTimeout(() => {
  //         nvd_init().then(() => {
  //           if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
  //           updateLiveCart()
  //         }).catch(err => {
  //           if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
  //         })
  //       }, 2000);
  //     }
  //   }, true
  // );

  $(document).on('click touchstart','[name="add"], .quantity-selector button, .remove, .quantity__button, #cart-icon-bubble', function(){
    let checkoutBtn = document.querySelectorAll('[name="checkout"]');
      if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = true)
      useConsole('navidium triggered slide cart');
      setTimeout(() => {
        nvd_init().then(() => {
          if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
          updateLiveCart()
        }).catch(err => {
          if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
        })
      }, 2000);
  })

//on select option change quantity
      window.addEventListener(
    'change',
    (ev) => {
      const navidiumTriggers = Array.from(
        document.querySelectorAll(nvdControls.changeTrigger)
      );
      const elm = ev.target;
      if (navidiumTriggers.includes(elm)) {
        let checkoutBtn = document.querySelectorAll('[name="checkout"]');
        if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = true)
        useConsole('navidium triggered slide cart');
        setTimeout(() => {
          nvd_init().then(() => {
            if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
            updateLiveCart()
          }).catch(err => {
            if (checkoutBtn) checkoutBtn.forEach(elem => elem.disabled = false)
          })
        }, 2000);
      }
    }, true
  );


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  // For mobile devices
     $(document).one("click touchstart", nvdControls.CheckoutBtns, function(e){
      console.log('clickingggggg')
      e.preventDefault();
      let checked = document.querySelector('#shippingProtectionCheckBox').checked;
        if(localStorage.getItem('nvdVariant') != null){
            let variantId = localStorage.getItem('nvdVariant');
            if (!checked) {
              return true;
            } else {
              addProtection(variantId).then((cart) => {
                return true;
              })
            }
        }else{
            return true;
        }
     })
} else {
    // Code for desktop devices
    window.addEventListener(
      'click',debounce((ev) => {
        console.log('click happened');
        const navidiumTriggers = Array.from(
         document.querySelectorAll(nvdControls.CheckoutBtns)
        );
        const elm = ev.target;
        if (navidiumTriggers.includes(elm)) {
          ev.preventDefault();
          console.log('checkout button clicked');
          let checked = document.querySelector('#shippingProtectionCheckBox').checked;
          if(localStorage.getItem('nvdVariant') != null){
              let variantId = localStorage.getItem('nvdVariant');
              if (!checked) {
                return true;
              } else {
                addProtection(variantId).then((cart) => {
                  return true;
                })
              }
          }else{
              return true;
          }
        }
      }), false
    );
}
  



