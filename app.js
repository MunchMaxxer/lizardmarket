// Data for lizards and stock
const lizards = [
  {
    id: "anole",
    name: "Anole",
    prices: { hatchling: 15, baby: 20, juvenile: 28, adult: 40 }
  },
  {
    id: "texas_spiny",
    name: "Texas Spiny Lizard",
    prices: { hatchling: 22, baby: 30, juvenile: 37, adult: 50 }
  },
  {
    id: "racerunner",
    name: "Six Lined Racerunner",
    prices: { hatchling: 18, baby: 25, juvenile: 32, adult: 45 }
  }
];

// Default stock (can be set by admin)
const defaultStock = {
  anole: { hatchling: 10, baby: 6, juvenile: 4, adult: 2 },
  texas_spiny: { hatchling: 8, baby: 5, juvenile: 3, adult: 1 },
  racerunner: { hatchling: 9, baby: 7, juvenile: 3, adult: 2 }
};

function getStock() {
  return JSON.parse(localStorage.getItem("lizardStock")) || defaultStock;
}

function setStock(stock) {
  localStorage.setItem("lizardStock", JSON.stringify(stock));
}

// Render lizard listings on shop page
function renderShop() {
  const stock = getStock();
  const listings = document.getElementById("lizard-listings");
  if (!listings) return;
  listings.innerHTML = "";
  lizards.forEach(lizard => {
    const card = document.createElement("div");
    card.className = "lizard-card";
    card.innerHTML = `<div class="lizard-title">${lizard.name}</div>`;
    Object.keys(lizard.prices).forEach(age => {
      const price = lizard.prices[age];
      const qty = stock[lizard.id][age];
      card.innerHTML += `
        <div class="price-row">
          <span>${age.charAt(0).toUpperCase() + age.slice(1)} - $${price} (${qty} in stock)</span>
          <input type="number" min="1" max="${qty}" value="1" id="${lizard.id}-${age}-qty">
          <button onclick="addToCart('${lizard.id}','${age}')">Add to Cart</button>
        </div>
      `;
    });
    listings.appendChild(card);
  });
}

// Cart functions
function getCart() {
  return JSON.parse(localStorage.getItem("lizardCart")) || [];
}

function setCart(cart) {
  localStorage.setItem("lizardCart", JSON.stringify(cart));
}

function addToCart(lizardId, age) {
  const qtyInput = document.getElementById(`${lizardId}-${age}-qty`);
  if (!qtyInput) return;
  const qty = parseInt(qtyInput.value, 10);
  if (qty < 1) return;
  const stock = getStock();
  if (qty > stock[lizardId][age]) {
    alert("Not enough stock!");
    return;
  }
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.lizardId === lizardId && item.age === age);
  if (itemIndex > -1) {
    // Update existing item
    if (cart[itemIndex].qty + qty > stock[lizardId][age]) {
      alert("Not enough stock!");
      return;
    }
    cart[itemIndex].qty += qty;
  } else {
    cart.push({ lizardId, age, qty });
  }
  setCart(cart);
  alert("Added to cart!");
}

// Render cart page
function renderCart() {
  const cartDiv = document.getElementById("cart-items");
  if (!cartDiv) return;
  const cart = getCart();
  const stock = getStock();
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty!</p>";
    return;
  }
  cartDiv.innerHTML = "";
  cart.forEach((item, idx) => {
    const lizard = lizards.find(l => l.id === item.lizardId);
    const price = lizard.prices[item.age];
    const stockQty = stock[item.lizardId][item.age];
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${lizard.name} (${item.age}) - $${price} x 
        <input type="number" min="1" max="${stockQty}" value="${item.qty}" class="cart-qty" id="cart-qty-${idx}">
      </span>
      <span>Total: $${price * item.qty}</span>
      <button class="remove-cart-btn" onclick="removeCartItem(${idx})">Remove</button>
    `;
    cartDiv.appendChild(row);

    // Update qty event
    setTimeout(() => {
      const qtyInput = document.getElementById(`cart-qty-${idx}`);
      if (qtyInput) {
        qtyInput.onchange = function() {
          let newQty = parseInt(this.value, 10);
          if (newQty < 1) newQty = 1;
          if (newQty > stockQty) newQty = stockQty;
          cart[idx].qty = newQty;
          setCart(cart);
          renderCart();
        };
      }
    }, 0);
  });
}

// Remove cart item
function removeCartItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  setCart(cart);
  renderCart();
}

// Render checkout summary
function renderCheckout() {
  const summaryDiv = document.getElementById("checkout-summary");
  if (!summaryDiv) return;
  const cart = getCart();
  if (cart.length === 0) {
    summaryDiv.innerHTML = "<p>Your cart is empty!</p>";
    return;
  }
  let total = 0;
  summaryDiv.innerHTML = "<h2>Order Summary</h2><ul>";
  cart.forEach(item => {
    const lizard = lizards.find(l => l.id === item.lizardId);
    const price = lizard.prices[item.age];
    summaryDiv.innerHTML += `<li>${lizard.name} (${item.age}) x ${item.qty}: $${price * item.qty}</li>`;
    total += price * item.qty;
  });
  summaryDiv.innerHTML += `</ul><strong>Total: $${total}</strong>`;
}

// Admin panel login and management
const ADMIN_USERNAME = "lzrdmktAdmin2025!";
const ADMIN_PASSWORD = "sR9!qLzD7xYp@eK3uT";

function setupAdminPage() {
  const loginDiv = document.getElementById("admin-login");
  const panelDiv = document.getElementById("admin-panel");
  const loginForm = document.getElementById("adminLoginForm");
  const loginError = document.getElementById("login-error");

  if (!loginForm) return;

  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const user = document.getElementById("admin-username").value;
    const pass = document.getElementById("admin-password").value;
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      loginDiv.style.display = "none";
      panelDiv.style.display = "block";
      renderStockManagement();
    } else {
      loginError.style.display = "block";
    }
  };
}

function renderStockManagement() {
  const stockDiv = document.getElementById("stock-management");
  const stock = getStock();
  stockDiv.innerHTML = "";
  lizards.forEach(lizard => {
    const card = document.createElement("div");
    card.className = "lizard-card";
    card.innerHTML = `<div class="lizard-title">${lizard.name}</div>`;
    Object.keys(lizard.prices).forEach(age => {
      card.innerHTML += `
        <div class="price-row">
          <span>${age.charAt(0).toUpperCase() + age.slice(1)} Stock:</span>
          <input type="number" min="0" class="admin-input" id="stock-${lizard.id}-${age}" value="${stock[lizard.id][age]}">
        </div>
      `;
    });
    stockDiv.appendChild(card);
  });
  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save Stock";
  saveBtn.onclick = () => {
    lizards.forEach(lizard => {
      Object.keys(lizard.prices).forEach(age => {
        const input = document.getElementById(`stock-${lizard.id}-${age}`);
        stock[lizard.id][age] = parseInt(input.value, 10) || 0;
      });
    });
    setStock(stock);
    alert("Stock updated!");
    renderShop();
  };
  stockDiv.appendChild(saveBtn);
}

function logoutAdmin() {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-login").style.display = "block";
}

// Page-specific rendering
document.addEventListener("DOMContentLoaded", function() {
  renderShop();
  renderCart();
  renderCheckout();
  setupAdminPage();
});
