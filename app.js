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
  return JSON.parse(localStorage.getItem("lizardStock")) || defaultStock;
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

// This function is to be called from lizard detail pages' Add to Cart button
// Example usage in detail page: addToCart('anole', 'juvenile', 1);
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
  // Optionally update cart icon animation if exists on detail pages
}

// The rest of your existing cart management, admin login, renderCart, renderCheckout, renderStockManagement, etc.
// Keep all that intact since those pages still use it.

// If you want, I can provide those again or you can keep them as is.

document.addEventListener("DOMContentLoaded", () => {
  // No rendering shop page here anymore because shop.html is static with links only

  // You can still render cart and checkout on their respective pages if present:
  if (document.getElementById("cart-items")) {
    renderCart();
  }
  if (document.getElementById("checkout-summary")) {
    renderCheckout();
  }
  // Setup admin login if admin page exists
  if (document.getElementById("adminLoginForm")) {
    setupAdminPage();
  }
});
