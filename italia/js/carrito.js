document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout-form");
  const addressFields = document.getElementById("address-fields");
  const pickupFields = document.getElementById("pickup-fields");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const cartSummary = document.getElementById("cart-summary");
  const deliveryTimeNotice = document.getElementById("delivery-time-notice");
  const deliveryOptionsContainer = document.querySelector(".delivery-options-container");
  const deliverySlider = document.querySelector(".delivery-slider");
  const deliveryButtons = document.querySelectorAll(".delivery-option-btn");

  function formatPrice(num) {
    if (num === null || num === undefined) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(num);
  }

  function getCart() {
    return JSON.parse(localStorage.getItem("italiaCafeCart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("italiaCafeCart", JSON.stringify(cart));
    renderCart();
    if (window.updateCartUI) {
      window.updateCartUI();
    }
  }

  function addItemToCart(product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
  }

  function removeOneItemFromCart(productName) {
    const cart = getCart();
    const indexToRemove = cart.findIndex(item => item.nombre === productName);
    if (indexToRemove > -1) {
      cart.splice(indexToRemove, 1);
      saveCart(cart);
    }
  }

  function removeAllItemsByName(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.nombre !== productName);
    saveCart(cart);
  }

  function checkDeliveryAvailability() {
    const deliveryOptionEl = document.querySelector('.delivery-option-btn[data-value="delivery"]');
    if (!deliveryOptionEl) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHour + currentMinutes / 60;

    const isDeliveryTime = currentTime >= 7.5 && currentTime < 9.5;

    if (isDeliveryTime) {
      deliveryOptionEl.disabled = false;
      deliveryTimeNotice.innerHTML = '<i class="fas fa-clock"></i> Envío gratis de 7:30 a 9:30 hs.';
    } else {
      deliveryOptionEl.disabled = true;
      deliveryOptionEl.textContent = "Envío (No disp.)";
      deliveryTimeNotice.innerHTML = '<i class="fas fa-clock"></i> Envío gratis de 7:30 a 9:30 hs. Fuera de ese horario se cobra envío.';
    }
  }

  function renderCart() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      cartSummary.classList.add("hidden");
      return;
    }

    emptyCartMessage.classList.add("hidden");
    cartSummary.classList.remove("hidden");

    const groupedCart = cart.reduce((acc, item) => {
      if (!acc[item.nombre]) {
        acc[item.nombre] = { ...item, quantity: 0 };
      }
      acc[item.nombre].quantity++;
      return acc;
    }, {});

    let total = 0;

    Object.values(groupedCart).forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
        <div class="cart-item-details">
          <div>
            <span class="item-name">${item.nombre}</span>
            ${item.descripcion ? `<p class="cart-item-desc">${item.descripcion}</p>` : ''}
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="item-quantity-controls">
            <button class="quantity-btn decrease-btn" data-name="${item.nombre}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="quantity-btn increase-btn" data-name="${item.nombre}">+</button>
          </div>
          <span class="item-price">${formatPrice(item.precio * item.quantity)}</span>
          <button class="remove-item-btn" data-name="${item.nombre}">&times;</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
      total += item.precio * item.quantity;
    });

    cartTotalElement.textContent = `Total: ${formatPrice(total)}`;

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const itemName = e.target.dataset.name;
        removeAllItemsByName(itemName);
      });
    });

    document.querySelectorAll(".increase-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const itemName = e.target.dataset.name;
        const cart = getCart();
        const itemToAdd = cart.find(p => p.nombre === itemName);
        if (itemToAdd) {
          addItemToCart(itemToAdd);
        }
      });
    });

    document.querySelectorAll(".decrease-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const itemName = e.target.dataset.name;
        removeOneItemFromCart(itemName);
      });
    });
  }

  let currentDeliveryOption = 'pickup';
  deliveryButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.disabled) return;
      deliveryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentDeliveryOption = button.dataset.value;
      const isDelivery = currentDeliveryOption === 'delivery';
      
      deliverySlider.style.transform = `translateX(${isDelivery ? '100%' : '0'})`;
      addressFields.classList.toggle('hidden', !isDelivery);
      pickupFields.classList.toggle('hidden', isDelivery);
      document.getElementById("address").required = isDelivery;
    });
  });

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const name = document.getElementById("customer-name").value;
    const deliveryType = currentDeliveryOption === 'pickup' ? 'Retirar en el local' : 'Envío a domicilio';

    let message = `¡Hola Italia Café! Quisiera hacer un pedido:\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Tipo de entrega:* ${deliveryType}\n`;

    if (currentDeliveryOption === "pickup") {
      const pickupDetails = document.getElementById("pickup-details").value;
      if (pickupDetails) {
        message += `*Aclaraciones de retiro:* ${pickupDetails}\n`;
      }
    }

    if (currentDeliveryOption === "delivery") {
      const address = document.getElementById("address").value;
      const addressDetails = document.getElementById("address-details").value;
      message += `*Dirección:* ${address}\n`;
      if (addressDetails) {
        message += `*Aclaraciones:* ${addressDetails}\n`;
      }
    }

    message += `\n*Pedido:*\n`;

    const groupedCart = cart.reduce((acc, item) => {
      if (!acc[item.nombre]) {
        acc[item.nombre] = { ...item, quantity: 0 };
      }
      acc[item.nombre].quantity++;
      return acc;
    }, {});

    let total = 0;
    Object.values(groupedCart).forEach(item => {
      message += `- ${item.quantity}x ${item.nombre} (${formatPrice(item.precio * item.quantity)})\n`;
      total += item.precio * item.quantity;
    });

    message += `\n*Total:* ${formatPrice(total)}`;

    const whatsappNumber = "5493624688355";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    localStorage.removeItem("italiaCafeCart");

    window.open(whatsappUrl, "_blank");

    alert("¡Gracias por tu pedido! Serás redirigido a WhatsApp para enviarlo.");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
  });

  renderCart();
  checkDeliveryAvailability();
});
