// ---------- Desktop Search ----------
const searchIcon = document.getElementById("searchIcon");
const searchBoxContainer = document.getElementById("searchBoxContainer");
const searchInput = document.getElementById("searchInput");
const submitSearch = document.getElementById("submitSearch");

searchIcon.addEventListener("click", () => {
  searchBoxContainer.style.display = "flex";
  searchIcon.style.display = "none";
  searchInput.focus();
});

submitSearch.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) alert("Searching for: " + query);
});

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") submitSearch.click();
});

// ---------- Mobile Search ----------
const searchIconMobile = document.getElementById("searchIconMobile");
const mobileSearchBox = document.getElementById("mobileSearchBoxContainer");
const mobileSearchInput = document.getElementById("mobileSearchInput");
const mobileSubmitSearch = document.getElementById("mobileSubmitSearch");

searchIconMobile.addEventListener("click", () => {
  mobileSearchBox.classList.add("mobile-active");
  searchIconMobile.classList.add("hidden");
  mobileSearchInput.focus();
});

mobileSubmitSearch.addEventListener("click", () => {
  const query = mobileSearchInput.value.trim();
  if (query) alert("Mobile search: " + query);
});

mobileSearchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") mobileSubmitSearch.click();
});

// ---------- Mobile Menu Toggle ----------
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

// ---------- Cart Logic ----------
const cartIconTriggers = document.querySelectorAll(".cart-trigger");
const cartPanel = document.getElementById("cart-panel");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCountEls = document.querySelectorAll("#cart-count");

// Load and update cart on page load
document.addEventListener("DOMContentLoaded", updateCartUI);

// Open Cart
cartIconTriggers.forEach(icon => {
  icon.addEventListener("click", () => {
    cartPanel.classList.add("open");
  });
});

// Close Cart (X button)
closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
});

// Close Cart & Hide Search Boxes if clicking outside
document.addEventListener("click", (e) => {
  const isOutsideCart = !cartPanel.contains(e.target) && !e.target.closest('.cart-trigger');
  const isOutsideSearch = !searchBoxContainer.contains(e.target) && e.target !== searchIcon;
  const isOutsideMobileSearch = !mobileSearchBox.contains(e.target) && e.target !== searchIconMobile;

  if (isOutsideCart) cartPanel.classList.remove("open");

  if (isOutsideSearch) {
    searchBoxContainer.style.display = "none";
    searchIcon.style.display = "inline";
  }

  if (isOutsideMobileSearch) {
    mobileSearchBox.classList.remove("mobile-active");
    searchIconMobile.classList.remove("hidden");
  }
});

// Update Cart UI
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} - Ksh ${item.price}</span>
      <span class="remove-btn" data-index="${index}">&times;</span>
    `;
    cartItemsContainer.appendChild(div);
    total += parseFloat(item.price);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCountEls.forEach(el => el.textContent = cart.length);

  // Add remove listeners
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(cart));
      updateCartUI();
    });
  });
  cartTotal.textContent = total.toFixed(2);
  // Add or update checkout button
let checkoutBtn = document.getElementById("checkoutBtn");
if (!checkoutBtn) {
  checkoutBtn = document.createElement("button");
  checkoutBtn.id = "checkoutBtn";
  checkoutBtn.textContent = "Proceed to Checkout";
  checkoutBtn.classList.add("checkout-btn"); // Add your CSS class if needed
  cartPanel.appendChild(checkoutBtn);
}
checkoutBtn.onclick = () => {
  window.location.href = "checkout.html";
};

// Open checkout overlay
document.getElementById("openCheckoutBtn").addEventListener("click", () => {
  document.getElementById("checkoutOverlay").style.display = "flex";
});

// Close overlay
document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutOverlay").style.display = "none";
});

}

// Example Add to Cart Function
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
  cart.push({ name, price });
  localStorage.setItem("cartItems", JSON.stringify(cart));
  updateCartUI();
}

// ---------- Carousel Scroll ----------
const track = document.getElementById('carouselTrack');
const leftBtn = document.getElementById('carouselLeft');
const rightBtn = document.getElementById('carouselRight');
const carouselContainer = document.querySelector('.carousel');
let scrollAmount = 0;

leftBtn.addEventListener('click', () => {
  scrollAmount -= track.clientWidth / 2;
  track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});

rightBtn.addEventListener('click', () => {
  scrollAmount += track.clientWidth / 2;
  track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
});

carouselContainer.addEventListener('mouseenter', () => {
  track.style.animationPlayState = 'paused';
});

carouselContainer.addEventListener('mouseleave', () => {
  track.style.animationPlayState = 'running';
});
const products = [
  "5000 Litres Tank",
  "1000 Litres Tank",
  "LED Bulb 12W",
  "Ceiling Light Round",
  "Shower Mixer",
  "PVC Pipe 2 Inch",
  "Wall Socket 13A",
  "Extension Cable 4 Way",
  // Add more products
];

const desktopSearchInput = document.getElementById('searchInput');
const suggestionsPanel = document.getElementById('suggestions');

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function highlightAndScrollToProduct(productName) {
  const id = 'product-' + slugify(productName);
  const productEl = document.getElementById(id);
  if (productEl) {
    productEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    productEl.classList.add('highlight');
    setTimeout(() => productEl.classList.remove('highlight'), 2000);
  }
}

desktopSearchInput.addEventListener('input', function () {
  const input = this.value.trim().toLowerCase();
  suggestionsPanel.innerHTML = '';
  suggestionsPanel.style.display = 'none';

  if (input.length === 0) return;

  const filtered = products.filter(product =>
    product.toLowerCase().includes(input)
  );

  if (filtered.length > 0) {
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item;
      div.classList.add('suggestion-item');
      div.addEventListener('click', () => {
        desktopSearchInput.value = item;
        suggestionsPanel.innerHTML = '';
        suggestionsPanel.style.display = 'none';
        highlightAndScrollToProduct(item);
      });
      suggestionsPanel.appendChild(div);
    });
    suggestionsPanel.style.display = 'block';
  } else {
    const div = document.createElement('div');
    div.textContent = 'Not available now';
    div.style.color = 'red';
    suggestionsPanel.appendChild(div);
    suggestionsPanel.style.display = 'block';
  }
});

// Hide suggestions when clicking outside
document.addEventListener('click', function (e) {
  if (!document.querySelector('.search-container').contains(e.target)) {
    suggestionsPanel.style.display = 'none';
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const featureItems = document.querySelectorAll(".feature-item");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  featureItems.forEach(item => {
    observer.observe(item);
  });
});

// ---------- Scroll to Top with Progress Ring ----------
document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.getElementById('scrollToTop');
  const progressCircle = document.querySelector('.progress-ring__circle');

  if (!scrollBtn || !progressCircle) return;

  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    progressCircle.style.strokeDashoffset = offset;
  }

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setProgress(scrollPercent);

    if (scrollTop > 200) {
  scrollBtn.classList.add('show');
} else {
  scrollBtn.classList.remove('show');
}

  }

  window.addEventListener('scroll', updateProgress);

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  updateProgress(); // Initial load
});

// Save message on typing
document.getElementById('waMessage').addEventListener('input', () => {
  localStorage.setItem('waChatMessage', document.getElementById('waMessage').value);
});

// Load saved message
waBtn.addEventListener('click', () => {
  waPopup.style.display = 'block';
  const savedMessage = localStorage.getItem('waChatMessage');
  document.getElementById('waMessage').value = savedMessage || "Hello 👋, I'd like to ask about...";
});

document.addEventListener("DOMContentLoaded", function () {
  const circles = document.querySelectorAll(".circle-container");

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom >= 0
    );
  }

  function animateCircles() {
    circles.forEach((container) => {
      if (container.classList.contains("animated")) return; // Avoid re-animating

      if (isInViewport(container)) {
        const percent = container.getAttribute("data-percent");
        const circle = container.querySelector(".progress-ring__circle");
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        // Trigger animation
        setTimeout(() => {
          circle.style.transition = "stroke-dashoffset 2s ease";
          circle.style.strokeDashoffset =
            circumference - (percent / 100) * circumference;
        }, 100);

        container.classList.add("animated");
      }
    });
  }

  // Initial check
  animateCircles();

  // On scroll
  window.addEventListener("scroll", animateCircles);
});
function payWithMpesa() {
  const phone = document.getElementById("phone").value;
  const amount = document.getElementById("amount").value;

  fetch("http://localhost:3000/stk-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ phone, amount })
  })
  .then(res => res.json())
  .then(data => {
    console.log("M-PESA Response:", data);
    alert("Payment request sent to your phone!");
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Payment failed");
  });
}

