'use strict';

(function () {
  var SCROLL_Y = 870;
  var SCROLL_X = 0;
  var SCROLL_BEHAVIOUR = 'smooth';

  var orderButton = document.querySelector('.page-header__button');
  var orderModal = document.querySelector('.modal--callback');
  var successModal = document.querySelector('.modal--success');
  var scrollButton = document.querySelector('.promo__scroll');

  var errors = {};

  var form = document.querySelector('.modal__form');
  var telInput = form.querySelector('.form__inner--phone input[type="tel"]');

  var tabsContainer = document.querySelector('.tabs');
  var tabsInner = tabsContainer.querySelector('.tabs__inner');
  var tabsList = tabsContainer.querySelector('.tabs__list');
  var tabButtons = tabsContainer.querySelectorAll('.tabs__item');
  var tabContents = tabsContainer.querySelectorAll('.tabs__description');

  var israelSlidesContainer = document.querySelector('.cards');
  var israelSlides = israelSlidesContainer.querySelectorAll('.cards__img');
  var israelSlidesBullets = israelSlidesContainer.querySelectorAll('.cards__bullet');

  var accordeon = document.querySelector('.accordeon');
  var accordeonItems = accordeon.querySelectorAll('.accordeon__item');
  var accordeonButtons = accordeon.querySelectorAll('.accordeon__button');
  var accordeonHeaders = accordeon.querySelectorAll('.accordeon__item h3');

  var testimonialsContainer = document.querySelector('.testimonials__container');
  var testimonials = testimonialsContainer.querySelectorAll('.testimonials__item');
  var currentPageIndicator = testimonialsContainer.querySelector('#testimonialsCurrent');
  var totalPagesIndicator = testimonialsContainer.querySelector('#testimonialsTotal');
  var testimonialsArrows = testimonialsContainer.querySelectorAll('.testimonials__button');

  document.body.classList.remove('no-js');

  // скролл
  var onScrollButtonClickDocumentScroll = function () {
    window.scrollBy({
      top: SCROLL_Y,
      left: SCROLL_X,
      behavior: SCROLL_BEHAVIOUR,
    });
  };

  // -------------------------------------- модалки

  var onOrderButtonClickShowModal = function () {
    window.vendor.showModal(orderModal);
  };

  // -------------------------------------- валидация

  // TODO сделай валидацию поля имени

  var onTelInputChangeValidateValue = function () {
    window.vendor.validateTelNumber(telInput, errors);
  };

  var onTelInputFocusResetValue = function () {
    window.vendor.resetInputError(telInput);
  };

  var onFormSubmit = function (evt) {
    if (errors.tel) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
      window.vendor.closeModal(orderModal);
      window.vendor.showModal(successModal);
      form.reset();
    }
  };

  // -------------------------------------- табы

  // проверка на тач-устройство
  var isTouchCapable = 'ontouchstart' in window ||
    window.DocumentTouch && document instanceof window.DocumentTouch ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;

  // drag'n'drop

  tabsList.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var shiftX = evt.clientX - tabsList.getBoundingClientRect().left;

    var onMouseMoove = function (mooveEvt) {
      var newLeft = mooveEvt.clientX - shiftX - tabsInner.getBoundingClientRect().left;
      tabsList.style.left = newLeft + 'px';
    };

    var onMouseUp = function () {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMoove);
    };

    document.addEventListener('mousemove', onMouseMoove);
    document.addEventListener('mouseup', onMouseUp);
  });

  if (isTouchCapable) {
    tabsList.addEventListener('touchstart', function (touchEvt) {

      touchEvt.preventDefault();
      var shiftX = touchEvt.touches[0].clientX - tabsList.getBoundingClientRect().left;

      var onMouseMoove = function (moveTouchEvt) {
        var newLeft = moveTouchEvt.touches[0].clientX - shiftX - tabsInner.getBoundingClientRect().left;
        tabsList.style.left = newLeft + 'px';
      };

      var onMouseUp = function () {
        document.removeEventListener('touchend', onMouseUp);
        document.removeEventListener('touchmove', onMouseMoove);
      };

      document.addEventListener('touchmove', onMouseMoove);
      document.addEventListener('touchend', onMouseUp);
    });
  }

  var onTabButtonClickContentShow = function (evt) {
    var activeTabIndex = window.vendor.getActiveTab(tabsContainer).dataset.tab;
    var newTabIndex = evt.currentTarget.dataset.tab;

    window.vendor.setNewTab(activeTabIndex, newTabIndex, tabButtons, tabContents);
  };

  // TODO tab centering

  // -------------------------------------- слайдер

  // israel

  var getActiveSlide = function (container) {
    return container.querySelector('.cards__img--active');
  };

  var getActiveBullet = function (container) {
    return container.querySelector('.cards__bullet--active');
  };

  var onBulletClickChangeIsraelSlide = function (evt) {
    var activeSlide = getActiveSlide(israelSlidesContainer);
    var activeBullet = getActiveBullet(israelSlidesContainer);

    activeBullet.classList.remove('cards__bullet--active');
    activeSlide.classList.remove('cards__img--active');

    var newIndex = evt.target.dataset.index;

    window.vendor.changeSlide(israelSlides, israelSlidesBullets, newIndex);
  };

  // -------------------------------------- accordeon

  var onAccordeonButtonClickToggleContent = function (evt) {
    var newIndex = evt.target.dataset.content;
    var elParent = evt.target.parentElement;

    if (elParent.classList.contains('accordeon__item--active')) {
      elParent.classList.remove('accordeon__item--active');
    } else {
      window.vendor.showAccordeonContent(accordeon, accordeonItems, newIndex);
    }

  };

  // -------------------------------------- testimonials

  totalPagesIndicator.textContent = testimonials.length;

  var onArrowClickChangeTestimonialSlide = function (evt) {
    var direction = evt.target.id;
    var newSlideIndex = window.vendor.getNewSlideIndex(direction, testimonials, testimonialsContainer);
    window.vendor.changeTestimonialSlide(testimonialsContainer, testimonials, newSlideIndex);
    window.vendor.changeCurrentPageIndicator(currentPageIndicator, testimonialsContainer);
  };

  // -------------------------------------- действия

  testimonialsArrows.forEach(function (it) {
    it.addEventListener('click', onArrowClickChangeTestimonialSlide);
  });

  accordeonButtons.forEach(function (it) {
    it.addEventListener('click', onAccordeonButtonClickToggleContent);
  });

  accordeonHeaders.forEach(function (it) {
    it.addEventListener('click', onAccordeonButtonClickToggleContent);
  });

  israelSlidesBullets.forEach(function (it) {
    it.addEventListener('click', onBulletClickChangeIsraelSlide);
  });

  tabButtons.forEach(function (it) {
    it.addEventListener('click', onTabButtonClickContentShow);
  });

  orderButton.addEventListener('click', onOrderButtonClickShowModal);
  scrollButton.addEventListener('click', onScrollButtonClickDocumentScroll);

  telInput.addEventListener('change', onTelInputChangeValidateValue);
  telInput.addEventListener('focus', onTelInputFocusResetValue);

  form.addEventListener('submit', onFormSubmit);

})();
