// ========== Add to Cart ==========
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    // Get the product details (from the parent element)
    const product = this.closest('.product');
    const name = product.querySelector('h3').innerText;
    const price = product.querySelector('p').innerText;
    const image = product.querySelector('img').src;

    // Add the quantity and size to the product object
    const quantity = 1; // default to 1, you can make this dynamic based on user input
    const size = product.querySelector('.size-select') ? product.querySelector('.size-select').value : 'N/A'; // Get selected size (if any)

    const item = {
      name,
      price,
      image,
      quantity,
      size
    };

    // Retrieve the current cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item is already in the cart
    const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);
    if (existingItemIndex > -1) {
      // If item exists in cart, update quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // If item doesn't exist, add it to the cart
      cart.push(item);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Optionally, alert the user
    alert(`${name} added to cart!`);
  });
});

// ========== Cart Page: Show Items, Quantity & Total ==========
if (document.getElementById('cart-items')) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  cartContainer.innerHTML = '';

  // Add default quantity = 1 if not already set
  cart = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));

  function renderCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const itemTotal = priceValue * item.quantity;
      total += itemTotal;

      const div = document.createElement('div');
      div.classList.add('cart-product');
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h3>${item.name}</h3>
          <p>${item.price}</p>
          <label>Quantity:
            <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" />
          </label>
          <label>Shoe Size:
              <select class="size-select" data-index="${index}">
              <option value="N/A" disabled ${item.size === 'N/A' ? 'selected' : ''}>Select Size</option>
              ${['6', '7', '8', '9', '10'].map(sizeOption => `
            <option value="${sizeOption}" ${item.size === sizeOption ? 'selected' : ''}>${sizeOption}</option>
            `).join('')}
               </select>
          </label>

          <p>Item Total: ₹${itemTotal.toFixed(2)}</p>
          <button class="remove" data-index="${index}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    if (totalPriceEl) totalPriceEl.innerText = `Total: ₹${total.toFixed(2)}`;
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  renderCart();

  // Quantity change
  cartContainer.addEventListener('input', function (e) {
    if (e.target.classList.contains('qty-input')) {
      const index = e.target.getAttribute('data-index');
      const qty = parseInt(e.target.value);
      if (qty > 0) {
        cart[index].quantity = qty;
        renderCart();
      }
    }
  });

  // Size change
  cartContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('size-select')) {
      const index = e.target.getAttribute('data-index');
      const size = e.target.value;
      cart[index].size = size;
      renderCart();
    }
  });

  // Remove item
  cartContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove')) {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      renderCart();
    }
  });
}
// === Toggle payment fields visibility ===
const paymentRadios = document.getElementsByName("payment-method");
const paymentDetails = document.getElementById("payment-details");

if (paymentRadios && paymentDetails) {
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (document.querySelector('input[name="payment-method"]:checked').value === "online") {
        paymentDetails.style.display = "block";
      } else {
        paymentDetails.style.display = "none";
      }
    });
  });
}

// === Shipping form submit handler ===
const shippingForm = document.getElementById("shipping-form");

if (shippingForm) {
  shippingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate all items have a selected size
    const invalidItem = cart.find(item => item.size === 'N/A');
    if (invalidItem) {
      alert(`Please select a shoe size for ${invalidItem.name}`);
      return;
    }

    const shippingDetails = {
      name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      paymentMethod: document.querySelector('input[name="payment-method"]:checked').value
    };

    if (shippingDetails.paymentMethod === "online") {
      shippingDetails.cardNumber = document.getElementById("card-number").value;
      shippingDetails.expiryDate = document.getElementById("expiry-date").value;
      shippingDetails.cvv = document.getElementById("cvv").value;
    }

    const orderData = {
      cart,
      shippingDetails,
      total: document.getElementById("total-price").innerText
    };

    // Store all order data to localStorage
    localStorage.setItem("orderData", JSON.stringify(orderData));

    // Redirect to checkout
    window.location.href = "checkout.html";
  });
}
    //Buy Now
function buyNow(name, price, image) {
  const selectedProduct = {
    name: name,
    price: price,
    image: image,
  };

  // Save to localStorage
  localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));

  // Redirect to cart.html
  window.location.href = 'cart.html';
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('cart.html')) {
    const cartContainer = document.getElementById('cart-container');
    const productData = localStorage.getItem('selectedProduct');

    if (productData) {
      const product = JSON.parse(productData);

      cartContainer.innerHTML = `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" width="150">
          <h3>${product.name}</h3>
          <p>Price: ${product.price}</p>
          <!-- You can add quantity, size, and checkout button here -->
        </div>
      `;
    } else {
      cartContainer.innerHTML = "<p>No product selected.</p>";
    }
  }
});

