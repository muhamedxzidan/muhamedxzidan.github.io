/**
 * Mohamed Zidan Portfolio — Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initProjectTabs();
  initLightboxModal();
  initQuranPlayer();
  initProjectShowcase();
});

/**
 * Theme Switcher with localStorage persistence
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Scoped Tab Switchers per featured project card and inside case study modal
 */
function initProjectTabs() {
  const tabContainers = document.querySelectorAll('.project-card.featured, .case-study-article');
  
  tabContainers.forEach(container => {
    const tabs = container.querySelectorAll('.gallery-tab');
    const grids = container.querySelectorAll('.gallery-container');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        grids.forEach(g => g.classList.remove('active'));

        tab.classList.add('active');
        const targetGrid = container.querySelector(`#${tab.dataset.tab}`);
        if (targetGrid) {
          targetGrid.classList.add('active');
        }
      });
    });
  });
}

/**
 * Project Showcase Controller: Filtering, Case Study Modal, and Deep Linking
 */
function initProjectShowcase() {
  const projectOrder = ['laundry-saas', 'makhzani', 'miss-safaa', 'bookia', 'vaygoo'];
  const projectMeta = {
    'laundry-saas': { title: 'Laundry SaaS Platform', icon: '🧺', category: 'SaaS Platform' },
    'makhzani': { title: 'Makhzani (مخزني)', icon: '🏬', category: 'Enterprise ERP' },
    'miss-safaa': { title: 'Miss Safaa (صفاء زيدان)', icon: '📖', category: 'Flutter Web' },
    'bookia': { title: 'Bookia Store', icon: '📚', category: 'Mobile App' },
    'vaygoo': { title: 'Vaygoo', icon: '🛎️', category: 'Tourism Platform' }
  };

  const filterChips = document.querySelectorAll('.filter-chip');
  const showcaseCards = document.querySelectorAll('.showcase-card');
  const modalOverlay = document.getElementById('case-study-modal');
  const modalNavTitle = document.getElementById('modal-project-title');
  const modalNavIcon = document.getElementById('modal-project-icon');
  const modalNavCounter = document.getElementById('modal-project-counter');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalScrollBody = document.querySelector('.case-study-scroll-body');
  const caseStudyArticles = document.querySelectorAll('.case-study-article');

  let currentProjectIndex = 0;

  // 1. Category Filtering
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');

      showcaseCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden-by-filter');
        } else {
          card.classList.add('hidden-by-filter');
        }
      });
    });
  });

  // 2. Open Specific Project Case Study
  function openProject(projectId, updateHash = true) {
    const targetIndex = projectOrder.indexOf(projectId);
    if (targetIndex === -1) return;

    currentProjectIndex = targetIndex;
    const meta = projectMeta[projectId];

    // Update Header UI
    if (modalNavTitle) modalNavTitle.textContent = meta.title;
    if (modalNavIcon) modalNavIcon.textContent = meta.icon;
    if (modalNavCounter) modalNavCounter.textContent = `${currentProjectIndex + 1} / ${projectOrder.length}`;

    // Switch active article
    caseStudyArticles.forEach(art => art.classList.remove('active'));
    const targetArticle = document.getElementById(`case-study-${projectId}`);
    if (targetArticle) {
      targetArticle.classList.add('active');
    }

    // Reset scroll position to top
    if (modalScrollBody) {
      modalScrollBody.scrollTop = 0;
    }

    // Open modal
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Update hash for deep linking
    if (updateHash) {
      history.replaceState(null, '', `#project-${projectId}`);
    }
  }

  // 3. Close Modal
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // 4. Navigation (Next / Prev)
  function navigateProject(direction) {
    let nextIndex = currentProjectIndex + direction;
    if (nextIndex < 0) nextIndex = projectOrder.length - 1;
    if (nextIndex >= projectOrder.length) nextIndex = 0;
    openProject(projectOrder[nextIndex]);
  }

  // Event Listeners for Opening Modal
  document.querySelectorAll('[data-open-project]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-open-project');
      openProject(projectId);
    });
  });

  // Close Button & Overlay Click
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Modal Prev / Next Buttons
  if (modalPrevBtn) {
    modalPrevBtn.addEventListener('click', () => navigateProject(-1));
  }
  if (modalNextBtn) {
    modalNextBtn.addEventListener('click', () => navigateProject(1));
  }

  // Bottom Banner Next Button triggers
  document.querySelectorAll('[data-next-project]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextId = btn.getAttribute('data-next-project');
      openProject(nextId);
    });
  });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    const isLightboxOpen = lightbox && lightbox.classList.contains('active');
    const isModalOpen = modalOverlay && modalOverlay.classList.contains('active');

    if (!isModalOpen || isLightboxOpen) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      navigateProject(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      navigateProject(-1);
    }
  });

  // Deep Linking / Hash on Initial Page Load
  function checkInitialHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
      const projectId = hash.replace('#project-', '');
      if (projectOrder.includes(projectId)) {
        setTimeout(() => openProject(projectId, false), 150);
      }
    }
  }

  window.addEventListener('hashchange', checkInitialHash);
  checkInitialHash();
}

/**
 * Lightbox Modal for gallery preview
 */
function initLightboxModal() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxDesc || !closeBtn || !prevBtn || !nextBtn) return;

  let currentGalleryItems = [];
  let currentIndex = 0;

  function showImage(index) {
    if (!currentGalleryItems.length) return;
    if (index < 0) index = currentGalleryItems.length - 1;
    if (index >= currentGalleryItems.length) index = 0;
    currentIndex = index;

    const item = currentGalleryItems[currentIndex];
    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-card-title');
    const descEl = item.querySelector('.gallery-card-desc');

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }
    if (titleEl) lightboxTitle.textContent = titleEl.textContent;
    if (descEl) lightboxDesc.textContent = descEl.textContent;
  }

  // Delegated click listener so any gallery card (even dynamically rendered or in modal) opens cleanly
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card) return;

    // Find the container parent of this card to scope prev/next
    const parentContainer = card.closest('.gallery-container') || card.closest('.case-study-article') || document;
    currentGalleryItems = Array.from(parentContainer.querySelectorAll('.gallery-card'));
    currentIndex = currentGalleryItems.indexOf(card);

    if (currentIndex === -1) currentIndex = 0;

    showImage(currentIndex);
    lightbox.classList.add('active');
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    const modalOverlay = document.getElementById('case-study-modal');
    if (!modalOverlay || !modalOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

/**
 * Custom Quran Audio Player Controls
 */
function initQuranPlayer() {
  const hpAudio = document.getElementById('hero-audio');
  const hpPlayBtn = document.getElementById('hp-play-btn');
  const hpCurrentTime = document.getElementById('hp-current-time');
  const hpDuration = document.getElementById('hp-duration');
  const hpProgressContainer = document.getElementById('hp-progress-container');
  const hpProgressFill = document.getElementById('hp-progress-fill');
  const hpVolumeBtn = document.getElementById('hp-volume-btn');
  const hpVolumeContainer = document.getElementById('hp-volume-container');
  const hpVolumeFill = document.getElementById('hp-volume-fill');

  if (!hpAudio || !hpPlayBtn || !hpProgressContainer || !hpProgressFill || !hpVolumeBtn || !hpVolumeContainer || !hpVolumeFill) return;

  const hpPlayIcon = hpPlayBtn.querySelector('.hp-play-icon');
  const hpPauseIcon = hpPlayBtn.querySelector('.hp-pause-icon');
  const hpSpeakerIcon = hpVolumeBtn.querySelector('.hp-speaker-icon');
  const hpMuteIcon = hpVolumeBtn.querySelector('.hp-mute-icon');

  let lastVolume = 0.5;
  hpAudio.volume = lastVolume;

  function formatTime(secs) {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function setPlayUI(isPlaying) {
    if (hpPlayIcon && hpPauseIcon) {
      hpPlayIcon.style.display = isPlaying ? 'none' : 'block';
      hpPauseIcon.style.display = isPlaying ? 'block' : 'none';
    }
  }

  hpPlayBtn.addEventListener('click', () => {
    if (hpAudio.paused) {
      hpAudio.play();
      setPlayUI(true);
    } else {
      hpAudio.pause();
      setPlayUI(false);
    }
  });

  hpAudio.addEventListener('loadedmetadata', () => {
    if (hpDuration) hpDuration.textContent = formatTime(hpAudio.duration);
  });

  hpAudio.addEventListener('timeupdate', () => {
    if (!isNaN(hpAudio.duration)) {
      if (hpDuration) hpDuration.textContent = formatTime(hpAudio.duration);
      const pct = (hpAudio.currentTime / hpAudio.duration) * 100;
      hpProgressFill.style.width = `${pct}%`;
      if (hpCurrentTime) hpCurrentTime.textContent = formatTime(hpAudio.currentTime);
    }
  });

  hpAudio.addEventListener('ended', () => {
    setPlayUI(false);
    hpProgressFill.style.width = '0%';
    if (hpCurrentTime) hpCurrentTime.textContent = '00:00';
  });

  hpProgressContainer.addEventListener('click', (e) => {
    const rect = hpProgressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (hpAudio.duration) {
      hpAudio.currentTime = (clickX / width) * hpAudio.duration;
    }
  });

  function setVolume(pct) {
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    hpAudio.volume = pct;
    hpVolumeFill.style.width = `${pct * 100}%`;
    if (hpSpeakerIcon && hpMuteIcon) {
      if (pct === 0) {
        hpSpeakerIcon.style.display = 'none';
        hpMuteIcon.style.display = 'block';
      } else {
        hpSpeakerIcon.style.display = 'block';
        hpMuteIcon.style.display = 'none';
        lastVolume = pct;
      }
    }
  }

  hpVolumeBtn.addEventListener('click', () => {
    if (hpAudio.volume > 0) {
      lastVolume = hpAudio.volume;
      setVolume(0);
    } else {
      setVolume(lastVolume);
    }
  });

  hpVolumeContainer.addEventListener('click', (e) => {
    const rect = hpVolumeContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = clickX / rect.width;
    setVolume(pct);
  });

  // Autoplay handler with fallback for browser autoplay policies
  function attemptAutoplay() {
    hpAudio.play().then(() => {
      setPlayUI(true);
    }).catch(() => {
      const startOnInteraction = () => {
        hpAudio.play().then(() => {
          setPlayUI(true);
        });
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
        document.removeEventListener('scroll', startOnInteraction);
      };
      
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('touchstart', startOnInteraction);
      document.addEventListener('scroll', startOnInteraction);
    });
  }

  attemptAutoplay();
}
