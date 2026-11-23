// tomiweb.pro — main client scripts
// Theme toggle & project filters

(function () {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  }

  function updateToggleIcon() {
    if (!themeToggle) return;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light' && 
      (document.documentElement.getAttribute('data-theme') === 'dark' || !window.matchMedia('(prefers-color-scheme: light)').matches);
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  if (themeToggle) {
    updateToggleIcon();
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      let target = 'light';
      if (current === 'light') {
        target = 'dark';
      } else if (!current && window.matchMedia('(prefers-color-scheme: light)').matches) {
        target = 'dark';
      }
      document.documentElement.setAttribute('data-theme', target);
      localStorage.setItem('theme', target);
      updateToggleIcon();
    });
  }

  // Project Filtering (for /public/ projects index)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
})();
