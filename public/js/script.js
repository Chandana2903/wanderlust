(() => {
  "use strict";

  /* ===============================
     BOOTSTRAP VALIDATION
  =============================== */
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach(form => {
    form.addEventListener("submit", e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add("was-validated");
    });
  });
})();

/* ===============================
   FILTER PANEL TOGGLE
================================ */
function toggleFilters() {
  const panel = document.getElementById("filterPanel");
  panel?.classList.toggle("d-none");
}

/* ===============================
   MAIN LOGIC
================================ */
document.addEventListener("DOMContentLoaded", () => {

  const searchInput   = document.getElementById("searchInput");
  const locationInput = document.getElementById("locationFilter");
  const priceRange    = document.getElementById("priceRange");
  const priceValue    = document.getElementById("priceValue");
  const clearBtn      = document.getElementById("clearFilters");
const applyBtn = document.getElementById("applyFilters");

  const cards         = document.querySelectorAll(".listing-card");
  const categoryItems = document.querySelectorAll(".category-item");
  const moodButtons   = document.querySelectorAll(".mood-btn");

  let activeCategory = "";
  let activeMood = "";

  /* ===============================
     MOOD → CATEGORY MAP
  =============================== */
  const moodCategoryMap = {
    relax: ["amazing pools", "boats", "rooms"],
    adventure: ["mountains", "camping", "arctic"],
    romantic: ["iconic cities", "castles", "domes"],
    family: ["rooms", "farms", "boats"]
  };

  /* ===============================
     FUZZY MATCH (TYPO TOLERANCE)
     unites → united
  =============================== */
  function fuzzyMatch(input, text) {
    if (!input) return true;
    if (text.includes(input)) return true;

    // simple typo tolerance
    let i = 0, j = 0;
    while (i < input.length && j < text.length) {
      if (input[i] === text[j]) i++;
      j++;
    }
    return i === input.length;
  }

  /* ===============================
     MAIN FILTER FUNCTION
  =============================== */
  function applyFilters() {
    const search   = searchInput?.value.toLowerCase().trim() || "";
    const location = locationInput?.value.toLowerCase().trim() || "";
    const maxPrice = parseInt(priceRange?.value) || Infinity;

    if (priceValue) priceValue.textContent = maxPrice;

    cards.forEach(card => {
      const title    = card.dataset.title || "";
      const loc      = card.dataset.location || ""; // location + country
      const price    = parseInt(card.dataset.price) || 0;
      const category = card.dataset.category || "";

      /* ---- MATCHES ---- */
      const matchTitle    = !search || fuzzyMatch(search, title);
      const matchLocation = !location || fuzzyMatch(location, loc);
      const matchPrice    = price <= maxPrice;

      // Rooms = show all
      const matchCategory =
        !activeCategory ||
        activeCategory === "rooms" ||
        category === activeCategory;

      let matchMood = true;
      if (activeMood) {
        const allowed = moodCategoryMap[activeMood] || [];
        matchMood = allowed.includes(category);
      }

      const show =
        matchTitle &&
        matchLocation &&
        matchPrice &&
        matchCategory &&
        matchMood;

      card.parentElement.style.display = show ? "block" : "none";
    });
  }

  /* ===============================
     CATEGORY FILTER
  =============================== */
  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      const selected = item.dataset.category;

      if (activeCategory === selected) {
        activeCategory = "";
        categoryItems.forEach(i => i.classList.remove("active"));
      } else {
        activeCategory = selected;
        categoryItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
      }
      applyFilters();
    });
  }); /* ===============================
   APPLY (SET) FILTERS
================================ */
applyBtn?.addEventListener("click", () => {
  applyFilters(); // apply selected filters
  toggleFilters(); // hide filter panel
});


  /* ===============================
     MOOD FILTER
  =============================== */
  moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      moodButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeMood = btn.dataset.mood || "";
      applyFilters();
    });
  });

  /* ===============================
     INPUT LISTENERS
  =============================== */
  searchInput?.addEventListener("input", applyFilters);
  locationInput?.addEventListener("input", applyFilters);
  priceRange?.addEventListener("input", applyFilters);

  clearBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (locationInput) locationInput.value = "";
    if (priceRange) priceRange.value = 5000;
    if (priceValue) priceValue.textContent = 5000;

    activeCategory = "";
    activeMood = "";

    categoryItems.forEach(i => i.classList.remove("active"));
    moodButtons.forEach(b => b.classList.remove("active"));

    applyFilters();
  });

});
