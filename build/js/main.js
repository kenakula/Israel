'use strict';

(function () {
  var SCROLL_X = 0;
  var SCROLL_BEHAVIOUR = 'smooth';
  var STORAGE_NAME_VALUE = 'name';
  var STORAGE_PHONE_NUMBER = 'tel';

  var orderButton = document.querySelector('.page-header__button');
  var orderModal = document.querySelector('.modal--callback');
  var successModal = document.querySelector('.modal--success');
  var scrollButton = document.querySelector('.promo__scroll');

  // объект для ошибок при валидации
  var errors = {};
  // объект для сохранения в localStorage
  var user = {};

  var forms = document.querySelectorAll('.form');
  var formInputs = document.querySelectorAll('input:not([type="checkbox"])');
  var telInputs = document.querySelectorAll('input[type="tel"]');
  var nameInputs = document.querySelectorAll('input[type="text"]');

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

  // вставляет данные из Localstorage
  var onPageLoadSetInputsValues = function () {
    window.vendor.setInputValuesFromLocalStorage(telInputs, nameInputs);
  };

  // -------------------------------------- скролл

  var onScrollButtonClickDocumentScroll = function () {
    var elem = document.querySelector('#about');

    window.scrollBy({
      top: elem.getBoundingClientRect().y,
      left: SCROLL_X,
      behavior: SCROLL_BEHAVIOUR,
    });
  };

  // -------------------------------------- модалки

  var onOrderButtonClickShowModal = function () {
    window.vendor.showModal(orderModal);
    orderModal.querySelector('input[type="text"]').focus();
  };

  // -------------------------------------- валидация

  // TODO примени маски

  var onTelInputChangeValidateValue = function (evt) {
    window.vendor.validateTelNumber(evt.target, errors);
  };

  // при фокусе на инпут сбрасывает стили ошибки
  var onTelInputFocusResetValue = function (evt) {
    window.vendor.resetInputError(evt.target);
  };

  // получает значения инпута имени
  var getNameInputValue = function (form) {
    var nameInput = form.querySelector('input[type="text"]');

    return nameInput.value;
  };

  // получает значения инпута телефона
  var getPhoneInputValue = function (form) {
    var phoneInput = form.querySelector('input[type="tel"]');

    return phoneInput.value;
  };

  var onFormSubmit = function (evt) {
    if (errors.tel) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
      window.vendor.closeModal(orderModal);
      window.vendor.showModal(successModal);
      window.vendor.setLocalStorage(STORAGE_PHONE_NUMBER, getPhoneInputValue(evt.target), user);
      // проверяет наличие поля имени в форме
      if (evt.target.querySelector('input[type="text"]')) {
        window.vendor.setLocalStorage(STORAGE_NAME_VALUE, getNameInputValue(evt.target), user);
      }

      evt.target.reset();
    }
  };

  // фокус и наведение на инпуты
  var onInputFocusBlurChangeOutline = function (evt) {
    var container = evt.target.parentElement;

    if (!container.classList.contains('form__inner--focused')) {
      container.classList.add('form__inner--focused');
    } else {
      container.classList.remove('form__inner--focused');
    }

  };

  var onInputHoverChangeOutline = function (evt) {
    var container = evt.target.parentElement;

    if (container.classList.contains('form__inner--hovered')) {
      container.classList.remove('form__inner--hovered');
    } else {
      container.classList.add('form__inner--hovered');
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

  // TODO центрирование таба в окне при его выборе

  // -------------------------------------- слайдер

  // israel slider

  // получает активный слайд
  var getActiveSlide = function (container) {
    return container.querySelector('.cards__img--active');
  };

  // получает активную кнопку контрола
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

  // testimonials slider

  // устанавливает количество слайдов в индикатор
  totalPagesIndicator.textContent = testimonials.length;

  var onArrowClickChangeTestimonialSlide = function (evt) {
    var direction = evt.target.id;
    var newSlideIndex = window.vendor.getNewSlideIndex(direction, testimonials, testimonialsContainer);
    window.vendor.changeTestimonialSlide(testimonialsContainer, testimonials, newSlideIndex);
    window.vendor.changeCurrentPageIndicator(currentPageIndicator, testimonialsContainer);
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

  scrollButton.addEventListener('click', onScrollButtonClickDocumentScroll);

  orderButton.addEventListener('click', onOrderButtonClickShowModal);

  telInputs.forEach(function (it) {
    it.addEventListener('change', onTelInputChangeValidateValue);
    it.addEventListener('focus', onTelInputFocusResetValue);
  });

  forms.forEach(function (it) {
    it.addEventListener('submit', onFormSubmit);
  });

  formInputs.forEach(function (it) {
    it.addEventListener('focus', onInputFocusBlurChangeOutline);
    it.addEventListener('blur', onInputFocusBlurChangeOutline);
    it.addEventListener('mouseover', onInputHoverChangeOutline);
    it.addEventListener('mouseout', onInputHoverChangeOutline);
  });

  window.addEventListener('load', onPageLoadSetInputsValues);

})();
