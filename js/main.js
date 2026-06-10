(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initChooseSchoolSlider();
    initExhibitionMarquee();
    initForm();
    initMarqueeFill();
    initMarqueeAccessibility();
    initHeroGalleryFill();
  }

  /* Choose the School: mobile slider only */
  function initChooseSchoolSlider() {
    var container = document.querySelector('[data-slider="choose-school"]');
    if (!container) return;

    var track = container.querySelector('.choose-school__track');
    var cards = Array.from(container.querySelectorAll('.choose-school__card'));
    var dots = Array.from(container.querySelectorAll('.choose-school__dot'));
    var controls = container.querySelector('.choose-school__controls');
    var statusEl = container.querySelector('[data-choose-status]');

    function updateControlsVisibility() {
      var isMobile = window.innerWidth < 768;
      if (controls) {
        controls.setAttribute('aria-hidden', isMobile ? 'false' : 'true');
      }
      if (track) {
        track.style.transform = isMobile ? track.style.transform : 'none';
      }
    }

    var chooseSlider = new AccessibleSlider({
      container: container,
      slides: cards,
      dots: dots,
      track: track,
      statusEl: statusEl,
      isMobileSlider: true,
      mobileBreakpoint: 768,
      autoplay: false,
      getStatusText: function (i) {
        var titles = ['International Schools', 'Boarding Schools', 'Day Schools', 'Pre-Schools'];
        return 'Showing ' + titles[i] + ', ' + (i + 1) + ' of 4';
      }
    });

    window.addEventListener('resize', updateControlsVisibility);
    updateControlsVisibility();

    window.chooseSchoolSlider = chooseSlider;
  }

  /* Exhibition highlights: infinite horizontal marquee */
  function initExhibitionMarquee() {
    var viewport = document.querySelector('[data-exhibition-marquee]');
    if (!viewport) return;

    var track = viewport.querySelector('.exhibition__track');
    if (!track) return;

    function setupMarquee() {
      track.querySelectorAll('[data-generated="true"]').forEach(function (card) {
        card.remove();
      });

      var baseCards = Array.from(track.querySelectorAll('.exhibition__card:not([data-generated="true"])'));
      baseCards.forEach(function (card) {
        card.setAttribute('data-base-item', 'true');
      });

      baseCards.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('data-generated', 'true');
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    setupMarquee();
    window.addEventListener('resize', setupMarquee);

    viewport.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        var isPaused = track.style.animationPlayState === 'paused';
        track.style.animationPlayState = isPaused ? 'running' : 'paused';
      }
    });
  }

  function bindSwipe(element, callback) {
    var startX = 0;
    var startY = 0;
    var isDragging = false;
    var threshold = 50;

    element.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;
    });

    element.addEventListener('pointerup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diffX = e.clientX - startX;
      var diffY = e.clientY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
        callback(diffX < 0 ? 1 : -1);
      }
    });

    element.addEventListener('pointercancel', function () {
      isDragging = false;
    });
  }

  function initForm() {
    var form = document.querySelector('.enquiry-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var parentName = form.querySelector('#parent-name');
      var phone = form.querySelector('#phone');
      var grade = form.querySelector('#grade');
      var valid = true;

      [parentName, phone, grade].forEach(function (field) {
        if (!field.value.trim()) {
          field.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          field.removeAttribute('aria-invalid');
        }
      });

      if (valid) {
        alert('Thank you! Your enquiry has been submitted.');
        form.reset();
      }
    });
  }

  /* Hero gallery: tile images to fill column, then duplicate for seamless scroll */
  function initHeroGalleryFill() {
    var columns = document.querySelectorAll('.hero__gallery-column');
    if (!columns.length) return;

    function fillColumn(column) {
      var inner = column.querySelector('.hero__gallery-column-inner');
      if (!inner) return;

      inner.querySelectorAll('[data-generated="true"]').forEach(function (node) {
        node.remove();
      });

      var baseImages = Array.from(inner.querySelectorAll('.hero__gallery-img')).filter(function (img) {
        return img.getAttribute('data-base-image') === 'true' || !img.hasAttribute('data-generated');
      });

      baseImages.forEach(function (img) {
        img.setAttribute('data-base-image', 'true');
        img.removeAttribute('data-generated');
      });

      if (!baseImages.length) return;

      var viewportHeight = column.clientHeight || 580;
      var safetyLimit = 24;

      while (inner.scrollHeight < viewportHeight && safetyLimit > 0) {
        baseImages.forEach(function (img) {
          var clone = img.cloneNode(true);
          clone.setAttribute('data-generated', 'true');
          clone.removeAttribute('data-base-image');
          clone.loading = 'lazy';
          inner.appendChild(clone);
        });
        safetyLimit -= 1;
      }

      var segmentNodes = Array.from(inner.children);
      segmentNodes.forEach(function (node) {
        var duplicate = node.cloneNode(true);
        duplicate.setAttribute('data-generated', 'true');
        duplicate.setAttribute('aria-hidden', 'true');
        inner.appendChild(duplicate);
      });
    }

    function fillAll() {
      columns.forEach(fillColumn);
    }

    fillAll();
    window.addEventListener('resize', fillAll);
    window.addEventListener('load', fillAll);
  }

  function initMarqueeAccessibility() {
    var rows = document.querySelectorAll('.logos-marquee__row');
    rows.forEach(function (row) {
      row.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          var track = row.querySelector('.logos-marquee__track');
          if (track) {
            var isPaused = track.style.animationPlayState === 'paused';
            track.style.animationPlayState = isPaused ? 'running' : 'paused';
          }
        }
      });
    });
  }

  function initMarqueeFill() {
    var rows = document.querySelectorAll('.logos-marquee__row');
    if (!rows.length) return;

    function fillRow(row) {
      var track = row.querySelector('.logos-marquee__track');
      var list = row.querySelector('.logos-marquee__list');
      if (!track || !list) return;

      var generatedItems = list.querySelectorAll('.logos-marquee__item[data-generated="true"]');
      generatedItems.forEach(function (item) {
        item.remove();
      });

      var generatedList = track.querySelector('.logos-marquee__list[data-generated-list="true"]');
      if (generatedList) {
        generatedList.remove();
      }

      var baseItems = Array.from(list.querySelectorAll('.logos-marquee__item')).filter(function (item) {
        return item.getAttribute('data-base-item') === 'true' || !item.hasAttribute('data-base-item');
      });

      baseItems.forEach(function (item) {
        item.setAttribute('data-base-item', 'true');
      });

      if (!baseItems.length) return;

      var minimumListWidth = row.clientWidth;
      var safetyLimit = 20;

      while (list.scrollWidth < minimumListWidth && safetyLimit > 0) {
        baseItems.forEach(function (item) {
          var clone = item.cloneNode(true);
          clone.setAttribute('data-generated', 'true');

          var image = clone.querySelector('img');
          if (image) {
            image.alt = '';
            image.loading = 'lazy';
          }

          list.appendChild(clone);
        });
        safetyLimit -= 1;
      }

      var duplicateList = list.cloneNode(true);
      duplicateList.setAttribute('aria-hidden', 'true');
      duplicateList.setAttribute('data-generated-list', 'true');
      track.appendChild(duplicateList);
    }

    function refillRows() {
      rows.forEach(fillRow);
    }

    refillRows();
    window.addEventListener('resize', refillRows);
  }
})();
