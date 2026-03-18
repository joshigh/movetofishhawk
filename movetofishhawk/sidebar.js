// Move to Fish Hawk — Sidebar Loader
// Fetches sidebar.html into #sidebar-placeholder, then populates
// the article list from blog-posts.json. Highlights the current article
// and shows a Next Article link.

(function () {

  function getCurrentSlug() {
    const path = window.location.pathname;
    const match = path.match(/\/posts\/(.+)\.html/);
    return match ? match[1] : null;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function loadSidebar() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    fetch('/sidebar.html')
      .then(res => res.text())
      .then(html => {
        placeholder.innerHTML = html;
        populateArticles();
      })
      .catch(err => console.warn('Sidebar load error:', err));
  }

  function populateArticles() {
    const listEl = document.getElementById('sidebar-article-list');
    if (!listEl) return;

    const currentSlug = getCurrentSlug();

    fetch('/blog-posts.json')
      .then(res => res.json())
      .then(posts => {
        // Sort by date descending
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Find next article (next most recent after current)
        const currentIndex = posts.findIndex(p => p.slug === currentSlug);
        const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        // Build article list
        const listHTML = posts.map(post => {
          const isCurrent = post.slug === currentSlug;
          return `
            <a href="/posts/${post.slug}.html" class="sidebar-article-link ${isCurrent ? 'sidebar-article-current' : ''}">
              <span class="sidebar-article-category">${post.category}</span>
              <span class="sidebar-article-title">${post.title}</span>
              <span class="sidebar-article-date">${formatDate(post.date)}</span>
            </a>
          `;
        }).join('');

        listEl.innerHTML = listHTML || '<p style="font-size:0.85rem;color:var(--text-light);">More articles coming soon.</p>';

        // Inject next/prev nav if we have neighbours
        const navEl = document.getElementById('post-article-nav');
        if (navEl) {
          navEl.innerHTML = `
            ${prevPost ? `<a href="/posts/${prevPost.slug}.html" class="article-nav-link article-nav-prev">
              <span class="article-nav-label">Previous</span>
              <span class="article-nav-title">${prevPost.title}</span>
            </a>` : '<div></div>'}
            ${nextPost ? `<a href="/posts/${nextPost.slug}.html" class="article-nav-link article-nav-next">
              <span class="article-nav-label">Next</span>
              <span class="article-nav-title">${nextPost.title}</span>
            </a>` : '<div></div>'}
          `;
        }
      })
      .catch(err => {
        if (listEl) listEl.innerHTML = '<p style="font-size:0.85rem;color:var(--text-light);">Articles coming soon.</p>';
        console.warn('Blog posts load error:', err);
      });
  }

  loadSidebar();

})();
