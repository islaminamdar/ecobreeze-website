
// ============================================================
// EcoBreeze Website - scripts.js
// Full interactive JS - Urban Company style features
// ============================================================

// === GLOBAL STATE ===
let currentReviewPage = 0;
const REVIEWS_PER_PAGE = 3;

// === SEARCH FUNCTIONALITY ===
const searchData = [
  {icon:'🧹', name:'Villa Deep Cleaning', price:'AED 299+'},
  {icon:'🧹', name:'Apartment Cleaning', price:'AED 199+'},
  {icon:'🧹', name:'Office Cleaning', price:'AED 249+'},
  {icon:'🍳', name:'Kitchen Deep Clean', price:'AED 149+'},
  {icon:'🛁', name:'Bathroom Deep Clean', price:'AED 99+'},
  {icon:'❄️', name:'AC Duct Cleaning', price:'AED 349+'},
  {icon:'🛋️', name:'Sofa Cleaning', price:'AED 179+'},
  {icon:'📦', name:'Move-In/Out Cleaning', price:'AED 399+'},
  {icon:'♨️', name:'Steam Cleaning', price:'AED 199+'},
  {icon:'🐛', name:'General Pest Control', price:'AED 199+'},
  {icon:'🪲', name:'Termite Control', price:'AED 499+'},
  {icon:'💨', name:'Fumigation Services', price:'AED 349+'},
  {icon:'🐞', name:'Bed Bug Treatment', price:'AED 299+'},
  {icon:'🦟', name:'Mosquito Control', price:'AED 249+'},
  {icon:'🪳', name:'Cockroach Control', price:'AED 149+'},
];

function initSearch() {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', function() {
    const q = this.value.toLowerCase().trim();
    if (q.length < 2) { dropdown.classList.remove('show'); return; }
    const matches = searchData.filter(s => s.name.toLowerCase().includes(q));
    if (matches.length === 0) { dropdown.classList.remove('show'); return; }
    dropdown.innerHTML = matches.slice(0, 6).map(s =>
      '<div class="search-item" onclick="selectSearchItem(\'' + s.name + '\')">' +
      '<span style="font-size:20px">' + s.icon + '</span>' +
      '<div><strong>' + s.name + '</strong><br>' +
      '<small style="color:#888">From ' + s.price + '</small></div></div>'
    ).join('');
    dropdown.classList.add('show');
  });

  document.addEventListener('click', function(e) {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function selectSearchItem(name) {
  const input = document.getElementById('searchInput');
  const dropdown = document.getElementById('searchDropdown');
  if (input) input.value = name;
  dropdown.classList.remove('show');
  openBookingModal(name);
}

// === HEADER SCROLL EFFECT ===
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      header && header.classList.add('scrolled');
      scrollBtn && scrollBtn.classList.add('show');
    } else {
      header && header.classList.remove('scrolled');
      scrollBtn && scrollBtn.classList.remove('show');
    }
  });
}

// === MOBILE MENU ===
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('show');
}

// === USER MENU ===
function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.classList.toggle('show');
}

// === SERVICE SELECTION IN HERO WIDGET ===
function selectService(el, name, price) {
  document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  window._selectedService = name;
}

// === BOOKING MODAL ===
function openBookingModal(serviceName) {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('show');
  if (serviceName) {
    const sel = document.getElementById('modalService');
    if (sel) {
      for (let opt of sel.options) {
        if (opt.text.toLowerCase().includes(serviceName.toLowerCase())) {
          sel.value = opt.value;
          break;
        }
      }
    }
  }
  document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';
}

// === LOGIN MODAL ===
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  const bookingModal = document.getElementById('bookingModal');
  if (bookingModal) bookingModal.classList.remove('show');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';
}

function switchTab(tab, btn) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('loginForm').classList.toggle('hidden', tab === 'signup');
  document.getElementById('signupForm').classList.toggle('hidden', tab === 'login');
}

// Close modals when clicking overlay
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeBookingModal();
    closeLoginModal();
  }
});

// === FORM SUBMISSIONS ===
function submitBooking(e) {
  e.preventDefault();
  showToast('✅ Quote request submitted! We will call you within 30 minutes.');
}

function submitModalBooking(e) {
  e.preventDefault();
  closeBookingModal();
  showToast('🎉 Booking confirmed! Our team will WhatsApp you shortly.');
}

function submitLogin(e) {
  e.preventDefault();
  closeLoginModal();
  showToast('👋 Welcome back! You are now logged in.');
}

function submitSignup(e) {
  e.preventDefault();
  closeLoginModal();
  showToast('🎉 Account created! Welcome to EcoBreeze.');
}

function submitContact(e) {
  e.preventDefault();
  showToast('📨 Message sent! We will get back to you within 2 hours.');
  e.target.reset();
}

// === TOAST NOTIFICATIONS ===
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// === REVIEWS SLIDER ===
function initReviewsSlider() {
  const cards = document.querySelectorAll('.review-card');
  const dotsContainer = document.getElementById('sliderDots');
  if (!cards.length || !dotsContainer) return;

  const totalPages = Math.ceil(cards.length / REVIEWS_PER_PAGE);
  dotsContainer.innerHTML = Array.from({length: totalPages}, (_, i) =>
    '<div class="dot' + (i === 0 ? ' active' : '') + '" onclick="goToReviewPage(' + i + ')"></div>'
  ).join('');

  updateReviewSlider();
}

function updateReviewSlider() {
  const cards = document.querySelectorAll('.review-card');
  const dots = document.querySelectorAll('.dot');
  cards.forEach((c, i) => {
    const page = Math.floor(i / REVIEWS_PER_PAGE);
    c.style.display = page === currentReviewPage ? 'block' : 'none';
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === currentReviewPage));
}

function slideReviews(dir) {
  const cards = document.querySelectorAll('.review-card');
  const totalPages = Math.ceil(cards.length / REVIEWS_PER_PAGE);
  currentReviewPage = (currentReviewPage + dir + totalPages) % totalPages;
  updateReviewSlider();
}

function goToReviewPage(page) {
  currentReviewPage = page;
  updateReviewSlider();
}

// === FAQ ACCORDION ===
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-a');
  const isOpen = answer.classList.contains('open');

  // Close all others
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('active'));

  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('active');
  }
}

// === COUNTER ANIMATION ===
function initCounters() {
  const counters = document.querySelectorAll('.counter-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.service-item, .category-card, .package-card, .usp-card, .tech-card, .area-card, .review-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// === ACTIVE NAV LINK ===
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

// === SMOOTH ANCHOR LINKS ===
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth'});
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) mobileMenu.classList.remove('show');
      }
    });
  });
}

// === STICKY BOOKING BAR (mobile) ===
function initStickyBar() {
  // Show sticky CTA after scrolling past hero
  const hero = document.querySelector('.hero');
  if (!hero) return;
}

// === INIT ALL ===
document.addEventListener('DOMContentLoaded', function() {
  initSearch();
  initScrollEffects();
  initReviewsSlider();
  initCounters();
  initScrollAnimations();
  initActiveNav();
  initSmoothLinks();
  initStickyBar();

  // Set min date for date inputs
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(d => d.min = today);

  // Keyboard escape to close modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeBookingModal();
      closeLoginModal();
    }
  });

  console.log('EcoBreeze website loaded successfully');
});
