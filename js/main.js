/**
 * Mohamed Zidan Portfolio — Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initProjectTabs();
  initLightboxModal();
  initQuranPlayer();
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
 * Scoped Tab Switchers per featured project card
 */
function initProjectTabs() {
  const featuredProjects = document.querySelectorAll('.project-card.featured');
  
  featuredProjects.forEach(project => {
    const tabs = project.querySelectorAll('.gallery-tab');
    const grids = project.querySelectorAll('.gallery-container');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        grids.forEach(g => g.classList.remove('active'));

        tab.classList.add('active');
        const targetGrid = project.querySelector(`#${tab.dataset.tab}`);
        if (targetGrid) {
          targetGrid.classList.add('active');
        }
      });
    });
  });
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

  const galleryItems = Array.from(document.querySelectorAll('.gallery-card'));
  let currentIndex = 0;

  function showImage(index) {
    if (!galleryItems.length) return;
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
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

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showImage(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
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
