// Data for lizards and stock
const lizards = [
  {
    id: "anole",
    name: "Anole",
    img: "anole2_large.jpg",
    prices: { hatchling: 15, baby: 20, juvenile: 28, adult: 40 }
  },
  {
    id: "texas_spiny",
    name: "Texas Spiny Lizard",
    img: "Texas_Spiny_Lizard_(Sceloporus_olivaceus)_(31037017).jpg",
    prices: { hatchling: 22, baby: 30, juvenile: 37, adult: 50 }
  },
  {
    id: "racerunner",
    name: "Six Lined Racerunner",
    img: "images (23).jpeg",
    prices: { hatchling: 18, baby: 25, juvenile: 32, adult: 45 }
  },
  {
    id: "bearded",
    name: "Bearded Dragon",
    img: "bearded.jpg",
    prices: { hatchling: 45, baby: 75, juvenile: 125, adult: 235 }
  },
  {
    id: "leopard",
    name: "Leopard Gecko",
    img: "leopard.jpg",
    prices: { hatchling: 12, baby: 35, juvenile: 50, adult: 85 }
  },
  {
    id: "crested",
    name: "Crested Gecko",
    img: "crested.jpg",
    prices: { hatchling: 45, baby: 105, juvenile: 195, adult: 250 }
  },
  {
    id: "house",
    name: "House Gecko",
    img: "house.jpg",
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

// ⬇️ Simplified shop UI: Only image + name, with expandable info on click
function renderShop(filtered = lizards) {
  const stock = getStock();
  const listings = document.getElementById("lizard-listings");
  if (!listings) return;

  listings.innerHTML = "";

  filtered.forEach(lizard => {
    const card = document.createElement("div");
    card.className = "lizard-card";
    card.innerHTML = `
      <img class="lizard-img clickable" src="${lizard.img}" alt="${lizard.name}" />
      <div class="lizard-title">${lizard.name}</div>
      <div class="lizard-info" style="display:none;"></div>
    `;

    const infoDiv = card.querySelector(".lizard-info");

    // Add detailed info to hidden div
    let infoHtml = "<ul>";
    Object.keys(lizard.prices).forEach(age => {
      const price = lizard.prices[age];
      const qty = stock[lizard.id][age];
      infoHtml += `<li>${age.charAt(0).toUpperCase() + age.slice(1)} - $${price} (${qty} in stock)</li>`;
    });
    infoHtml += "</ul>";
    infoDiv.innerHTML = infoHtml;

    // Toggle info on click
    card.querySelector("img").addEventListener("click", () => {
      infoDiv.style.display = infoDiv.style.display === "none" ? "block" : "none";
    });

    listings.appendChild(card);
  });
}

// Optional: Inject search bar
function injectSearchBar() {
  const listingsContainer = document.getElementById("lizard-listings");
  if (!listingsContainer) return;

  const searchInput = document.createElement("input");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("placeholder", "Search lizards...");
  searchInput.className = "search-bar";
  listingsContainer.parentNode.insertBefore(searchInput, listingsContainer);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = lizards.filter(lizard => lizard.name.toLowerCase().includes(query));
    renderShop(filtered);
  });
}

// -- Cart and admin functions remain unchanged -- //
function renderCart() { /* unchanged */ }
function addToCart() { /* unchanged */ }
function setCart() { /* unchanged */ }
function getCart() { /* unchanged */ }
function removeCartItem() { /* unchanged */ }
function renderCheckout() { /* unchanged */ }
function setupAdminPage() { /* unchanged */ }
function renderStockManagement() { /* unchanged */ }
function logoutAdmin() { /* unchanged */ }
function showToast() { /* unchanged */ }
function animateSuccess() { /* unchanged */ }
function animateError() { /* unchanged */ }
function animateCart() { /* unchanged */ }

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  renderShop();
  injectSearchBar();
  renderCart();
  renderCheckout();
  setupAdminPage();
});
