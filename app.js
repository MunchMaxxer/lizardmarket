// Data for lizards with full info (prices etc)
const lizards = [
  {
    id: "anole",
    name: "Anole",
    img: "images/anole2_large.jpg",
    prices: { hatchling: 15, baby: 20, juvenile: 28, adult: 40 }
  },
  {
    id: "texas_spiny",
    name: "Texas Spiny Lizard",
    img: "images/Texas_Spiny_Lizard_(Sceloporus_olivaceus)_(31037017).jpg",
    prices: { hatchling: 22, baby: 30, juvenile: 37, adult: 50 }
  },
  {
    id: "racerunner",
    name: "Six Lined Racerunner",
    img: "images/images (23).jpeg",
    prices: { hatchling: 18, baby: 25, juvenile: 32, adult: 45 }
  },
  {
    id: "bearded",
    name: "Bearded Dragon",
    img: "images/bearded.jpg",
    prices: { hatchling: 45, baby: 75, juvenile: 125, adult: 235 }
  },
  {
    id: "leopard",
    name: "Leopard Gecko",
    img: "images/leopard.jpg",
    prices: { hatchling: 12, baby: 35, juvenile: 50, adult: 85 }
  },
  {
    id: "crested",
    name: "Crested Gecko",
    img: "images/crested.jpg",
    prices: { hatchling: 45, baby: 105, juvenile: 195, adult: 250 }
  },
  {
    id: "house",
    name: "House Gecko",
    img: "images/house.jpg",
    prices: { hatchling: 5, baby: 12, juvenile: 16, adult: 23 }
  },
];

const defaultStock = {
  anole: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  texas_spiny: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  racerunner: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  bearded: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  leopard: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  crested: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 },
  house: { hatchling: 0, baby: 0, juvenile: 0, adult: 0 }
};

function getStock() {
  return JSON.parse(localStorage.getItem("lizardStock")) || JSON.parse(JSON.stringify(defaultStock));
}

function setStock(stock) {
  localStorage.setItem("lizardStock", JSON.stringify(stock));
}

function getCart() {
  return JSON.parse(localStorage.getItem("lizardCart")) || [];
}

function setCart(cart) {
  localStorage.setItem("lizardCart", JSON.stringify(cart));
}

/**
 * Add item to cart.
 * @param {string} lizardId - ID of the lizard.
 * @param {string} age - Age category.
 * @param {number} qty - Quantity (default 1).
 */
function addToCart(lizardId, age, qty = 1) {
  const stock = getStock();
  if (!stock[lizardId] || stock[lizardId][age] === undefined) {
    alert("Invalid lizard or age category.");
    return;
  }
  if (qty < 1) {
    alert("Quantity must be at least 1.");
    return;
  }
  if (qty > stock[lizardId][age]) {
    alert("Not enough stock!");
    return;
  }
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.lizardId === lizardId && item.age === age);
  if (itemIndex > -1) {
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
  // You can add animation or update cart icon here if you want
}

// Renders the cart page
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
      <span>
        <img src="${lizard.img}" alt="${lizard.name}" style="width:48px;vertical-align:middle;border-radius:8px;margin-right:12px;">
        ${lizard.name} (${item.age}) - $${price} x 
        <input type="number" min="1" max="${stockQty}" value="${item.qty}" class="cart-qty" id="cart-qty-${idx}">
      </span>
      <span>Total: $${price * item.qty}</span>
      <button class="remove-cart-btn" onclick="removeCartItem(${idx})">Remove</button>
    `;
    cartDiv.appendChild(row);

    // Set up onchange event for quantity input
    setTimeout(() => {
      const qtyInput = document.getElementById(`cart-qty-${idx}`);
      if (qtyInput) {
        qtyInput.onchange = function () {
          let newQty = parseInt(this.value, 10);
          if (newQty < 1) newQty = 1;
          if (newQty > stockQty) newQty = stockQty;
          cart[idx].qty = newQty;
          setCart(cart);
          renderCart();
          animateSuccess(qtyInput);
        };
      }
    }, 0);
  });
}

// Remove item from cart
function removeCartItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  setCart(cart);
  renderCart();
  animateCart();
  showToast("Removed from cart.");
}

function animateSuccess(el) {
  el.style.boxShadow = "0 0 10px #6dd47e";
  setTimeout(() => (el.style.boxShadow = ""), 500);
}

function animateCart() {
  const cartLink = document.querySelector('nav a[href="cart.html"]');
  if (cartLink) {
    cartLink.classList.add("pulse");
    setTimeout(() => cartLink.classList.remove("pulse"), 700);
  }
}

function showToast(msg) {
  let toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "40px";
  toast.style.right = "40px";
  toast.style.background = "#6dd47e";
  toast.style.color = "#fff";
  toast.style.fontWeight = "bold";
  toast.style.padding = "1em 2em";
  toast.style.borderRadius = "15px";
  toast.style.boxShadow = "0 2px 18px #6dd47e99";
  toast.style.zIndex = "9999";
  toast.style.fontSize = "1.1em";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.4s";
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => (toast.style.opacity = "0"), 1800);
  setTimeout(() => toast.remove(), 2200);
}

// Render checkout page summary
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

// Admin login credentials
const ADMIN_USERNAME = "lzrdmktAdmin2025!";
const ADMIN_PASSWORD = "sR9!qLzD7xYp@eK3uT";

function setupAdminPage() {
  const loginDiv = document.getElementById("admin-login");
  const panelDiv = document.getElementById("admin-panel");
  const loginForm = document.getElementById("adminLoginForm");
  const loginError = document.getElementById("login-error");

  if (!loginForm) return;

  loginForm.onsubmit = function (e) {
    e.preventDefault();
    const user = document.getElementById("admin-username").value;
    const pass = document.getElementById("admin-password").value;
    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      loginDiv.style.display = "none";
      panelDiv.style.display = "block";
      renderStockManagement();
    } else {
      loginError.style.display = "block";
      loginError.classList.add("shake");
      setTimeout(() => loginError.classList.remove("shake"), 400);
    }
  };
}

function renderStockManagement() {
  const stockDiv = document.getElementById("stock-management");
  if (!stockDiv) return;

  const stock = getStock();
  stockDiv.innerHTML = "";

  lizards.forEach(lizard => {
    const card = document.createElement("div");
    card.className = "lizard-card";
    card.innerHTML = `
      <div class="lizard-title">${lizard.name}</div>
      <img class="lizard-img" src="${lizard.img}" alt="${lizard.name}" />
    `;

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

  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save Stock";
  saveBtn.className = "pulse";
  saveBtn.onclick = () => {
    lizards.forEach(lizard => {
      Object.keys(lizard.prices).forEach(age => {
        const input = document.getElementById(`stock-${lizard.id}-${age}`);
        stock[lizard.id][age] = parseInt(input.value, 10) || 0;
      });
    });
    setStock(stock);
    alert("Stock updated!");
  };
  stockDiv.appendChild(saveBtn);
}

function logoutAdmin() {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("admin-login").style.display = "block";
}

// Initialize page specific renderings
document.addEventListener("DOMContentLoaded", () => {
  // If cart page
  if (document.getElementById("cart-items")) {
    renderCart();
  }

  // If checkout page
  if (document.getElementById("checkout-summary")) {
    renderCheckout();
  }

  // If admin page
  if (document.getElementById("adminLoginForm")) {
    setupAdminPage();
  }
});
