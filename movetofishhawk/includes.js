// Move to Fish Hawk — Global Nav & Footer Loader
// Loads nav.html and footer.html into placeholder divs on every page.
// Sets active nav state based on current URL.
// Wires up the mobile hamburger toggle.

(function () {

  // Determine the active page from current URL
  function getActivePage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('schools')) return 'schools';
    if (path.includes('neighborhoods')) return 'neighborhoods';
    if (path.includes('blog')) return 'blog';
    if (path.includes('contact')) return 'contact';
    // Blog posts — highlight Blog in nav
    if (path.includes('/posts/')) return 'blog';
    return '';
  }

  // Fetch an HTML include and inject it into a placeholder element
  function loadInclude(placeholderId, url, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;
        if (callback) callback();
      })
      .catch(function (err) {
        console.warn('Include load error:', err);
      });
  }

  // Set active nav link after nav is injected
  function setActiveNav() {
    const activePage = getActivePage();
    const links = document.querySelectorAll('.site-nav [data-page]');
    links.forEach(function (link) {
      if (link.getAttribute('data-page') === activePage) {
        link.classList.add('active');
      }
    });
  }

  // Wire up hamburger toggle after nav is injected
  function initHamburger() {
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close nav when a link is clicked (mobile UX)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Load nav first, then set active state and hamburger
  loadInclude('nav-placeholder', '/nav.html', function () {
    setActiveNav();
    initHamburger();
  });

  // Load footer independently
  loadInclude('footer-placeholder', '/footer.html');

})();
