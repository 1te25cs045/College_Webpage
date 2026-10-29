document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdown = document.querySelector(".nav-dropdown");
const backToTop = document.querySelector(".back-to-top");

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (dropdownToggle && dropdown) {
  dropdownToggle.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const searchInputs = [
  document.getElementById("siteSearch"),
  document.getElementById("mobileSearch"),
  document.getElementById("programSearch")
].filter(Boolean);

function applySearchFilter(value) {
  const query = value.trim().toLowerCase();

  const cards = document.querySelectorAll(".program-card, .dept-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const content = (card.dataset.search || card.textContent || "").toLowerCase();
    const isVisible = !query || content.includes(query);
    card.classList.toggle("hidden", !isVisible);
    if (isVisible) visibleCount += 1;
  });

  const emptyState = document.getElementById("programEmptyState");
  if (emptyState) {
    emptyState.classList.toggle("hidden", visibleCount !== 0 || !query);
  }
}

searchInputs.forEach((input) => {
  input.addEventListener("input", (event) => {
    applySearchFilter(event.target.value);
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const newsCards = document.querySelectorAll(".news-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

    newsCards.forEach((card) => {
      const matches = selected === "all" || card.dataset.category === selected;
      card.classList.toggle("hidden", !matches);
    });
  });
});

function validateForm(form) {
  const fields = form.querySelectorAll("input, textarea, select");
  let isValid = true;

  fields.forEach((field) => {
    const isRequired = field.hasAttribute("required");
    const value = field.value.trim();
    const error = field.validationMessage || "";

    if (isRequired && !value) {
      isValid = false;
      field.setAttribute("aria-invalid", "true");
    } else if (field.type === "email" && value && !field.checkValidity()) {
      isValid = false;
      field.setAttribute("aria-invalid", "true");
    } else {
      field.setAttribute("aria-invalid", "false");
    }

    if (error && value) {
      field.setAttribute("aria-invalid", "true");
    }
  });

  return isValid;
}

function showFormStatus(form, message, isError = false) {
  const statusElement = form.querySelector(".form-status");
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.style.color = isError ? "#ad2f2f" : "#1d3557";
}

document.querySelectorAll(".site-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm(form)) {
      showFormStatus(form, "Please complete all required fields correctly.", true);
      return;
    }

    const formName = form.id === "contactForm" ? "Contact" : "Admission enquiry";
    showFormStatus(form, `${formName} submitted successfully. This is a frontend placeholder until backend integration is added.`, false);
    form.reset();
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 250) {
    backToTop?.classList.add("visible");
  } else {
    backToTop?.classList.remove("visible");
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
