/**
 * Accessible carousel/slider utility
 * Supports: autoplay, pause on hover/focus, keyboard, touch swipe, reduced motion
 */
(function (global) {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function AccessibleSlider(options) {
    this.container = options.container;
    this.slides = options.slides;
    this.dots = options.dots || [];
    this.prevBtn = options.prevBtn || null;
    this.nextBtn = options.nextBtn || null;
    this.statusEl = options.statusEl || null;
    this.track = options.track || null;
    this.currentIndex = 0;
    this.total = this.slides.length;
    this.autoplay = options.autoplay && !prefersReducedMotion.matches;
    this.interval = options.interval || 5000;
    this.timer = null;
    this.isMobileSlider = options.isMobileSlider || false;
    this.mobileBreakpoint = options.mobileBreakpoint || 768;
    this.fullWidthSlides = options.fullWidthSlides || false;
    this.slideWidthPercent = options.slideWidthPercent || 85;
    this.onSlideChange = options.onSlideChange || null;
    this.getStatusText = options.getStatusText || null;

    this._bindEvents();
    this._update();
    if (this.autoplay) {
      this._startAutoplay();
    }
  }

  AccessibleSlider.prototype._bindEvents = function () {
    var self = this;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', function () {
        self.goTo(self.currentIndex - 1);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', function () {
        self.goTo(self.currentIndex + 1);
      });
    }

    this.dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        self.goTo(index);
      });
    });

    this.container.addEventListener('mouseenter', function () {
      self._stopAutoplay();
    });

    this.container.addEventListener('mouseleave', function () {
      if (self.autoplay) {
        self._startAutoplay();
      }
    });

    this.container.addEventListener('focusin', function () {
      self._stopAutoplay();
    });

    this.container.addEventListener('focusout', function (e) {
      if (!self.container.contains(e.relatedTarget) && self.autoplay) {
        self._startAutoplay();
      }
    });

    this.container.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        self.goTo(self.currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        self.goTo(self.currentIndex + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        self.goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        self.goTo(self.total - 1);
      }
    });

    this._bindSwipe();

    prefersReducedMotion.addEventListener('change', function () {
      self.autoplay = optionsAutoplay(self) && !prefersReducedMotion.matches;
      if (!self.autoplay) {
        self._stopAutoplay();
      }
    });

    function optionsAutoplay(slider) {
      return slider.container.dataset.autoplay === 'true';
    }

    if (this.isMobileSlider) {
      window.addEventListener('resize', function () {
        self._update();
      });
    }
  };

  AccessibleSlider.prototype._bindSwipe = function () {
    var self = this;
    var startX = 0;
    var startY = 0;
    var isDragging = false;
    var threshold = 50;

    this.container.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;
    });

    this.container.addEventListener('pointerup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diffX = e.clientX - startX;
      var diffY = e.clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        if (diffX < 0) {
          self.goTo(self.currentIndex + 1);
        } else {
          self.goTo(self.currentIndex - 1);
        }
      }
    });

    this.container.addEventListener('pointercancel', function () {
      isDragging = false;
    });
  };

  AccessibleSlider.prototype._startAutoplay = function () {
    var self = this;
    this._stopAutoplay();
    this.timer = window.setInterval(function () {
      self.goTo(self.currentIndex + 1);
    }, this.interval);
  };

  AccessibleSlider.prototype._stopAutoplay = function () {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  };

  AccessibleSlider.prototype._isMobile = function () {
    return window.innerWidth < this.mobileBreakpoint;
  };

  AccessibleSlider.prototype.goTo = function (index) {
    if (this.total === 0) return;

    if (index < 0) {
      index = this.total - 1;
    } else if (index >= this.total) {
      index = 0;
    }

    this.currentIndex = index;
    this._update();

    if (this.onSlideChange) {
      this.onSlideChange(index);
    }
  };

  AccessibleSlider.prototype._update = function () {
    var i = this.currentIndex;
    var mobileMode = this.isMobileSlider && this._isMobile();
    var useTrack = this.track && (this.isMobileSlider ? mobileMode : true);

    if (this.track) {
      if (mobileMode) {
        var offset = -(i * this.slideWidthPercent);
        this.track.style.transform = 'translateX(' + offset + '%)';
      } else if (useTrack) {
        var slideOffset;
        if (this.fullWidthSlides) {
          slideOffset = -(i * 100);
          this.track.style.transform = 'translateX(' + slideOffset + '%)';
        } else {
          var card = this.slides[0];
          if (card) {
            var cardWidth = card.offsetWidth;
            var gap = 16;
            slideOffset = -(i * (cardWidth + gap));
            this.track.style.transform = 'translateX(' + slideOffset + 'px)';
          }
        }
      } else {
        this.track.style.transform = 'none';
      }
    }

    this.slides.forEach(function (slide, idx) {
      var isActive = idx === i;

      if (this.isMobileSlider && !this._isMobile()) {
        slide.classList.toggle('is-active', isActive);
        slide.removeAttribute('hidden');
        return;
      }

      if (useTrack && slide.hasAttribute('hidden')) {
        slide.removeAttribute('hidden');
      } else if (!useTrack) {
        if (isActive) {
          slide.classList.add('is-active');
          slide.removeAttribute('hidden');
        } else {
          slide.classList.remove('is-active');
          slide.setAttribute('hidden', '');
        }
      }
    }, this);

    this.dots.forEach(function (dot, idx) {
      var isActive = idx === i;
      dot.classList.toggle('is-active', isActive);
      if (isActive) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
      dot.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    if (this.statusEl && this.getStatusText) {
      this.statusEl.textContent = this.getStatusText(i);
    }
  };

  global.AccessibleSlider = AccessibleSlider;
})(window);
