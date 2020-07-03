'use strict';

(function () {
  var TEL_REG_EXP = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  var ESC_KEY = 'Escape';
  var USER_OBJECT_NAME = 'user';

  // forEach polyfill for IE
  if ('NodeList' in window && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
  // end of forEach polyfill

  // -------------------------------------- форма

  var resetInputError = function (input) {
    if (input.parentElement.classList.contains('form__inner--error')) {
      input.parentElement.classList.remove('form__inner--error');
    }
  };

  var setErrorStyle = function (input) {
    input.parentElement.classList.add('form__inner--error');
  };

  var validateTelNumber = function (input, errors) {
    var value = input.value;

    if (!TEL_REG_EXP.test(value)) {
      setErrorStyle(input);
      errors.tel = 'wrong tel';
    } else {
      resetInputError(input);
      delete errors.tel;
    }
  };

  // -------------------------------------- модалки

  var onEscButtonPressCloseModal = function (evt, modal) {
    if (evt.key === ESC_KEY) {
      window.vendor.closeModal(modal);
      document.removeEventListener('keydown', onEscButtonPressCloseModal);
    }
  };

  var onOverlayClickCloseModal = function (evt, modal) {
    var modalInner = modal.querySelector('.modal__inner');
    if (evt.target === modal && evt.target !== modalInner) {
      window.vendor.closeModal(modal);
      document.removeEventListener('keydown', onEscButtonPressCloseModal);
    }
  };

  var showModal = function (modal) {
    if (!modal.classList.contains('modal--show')) {
      modal.classList.add('modal--show');
      document.body.classList.add('no-scroll');

      var closeButton = modal.querySelector('.modal__close');

      closeButton.addEventListener('click', function () {
        closeModal(modal);
      });
      modal.addEventListener('click', function (evt) {
        onOverlayClickCloseModal(evt, modal);
      });
      document.addEventListener('keydown', function (evt) {
        onEscButtonPressCloseModal(evt, modal);
      });
    }
  };

  var closeModal = function (modal) {
    if (modal.classList.contains('modal--show')) {
      modal.classList.remove('modal--show');
      document.body.classList.remove('no-scroll');
    }
  };

  // -------------------------------------- табы

  var getActiveTab = function (container) {
    return container.querySelector('.tabs__item--active');
  };

  var setNewTab = function (currentIndex, newIndex, tabs, contents) {
    var currentTab = tabs[currentIndex];
    var currentContent = contents[currentIndex];

    currentTab.classList.remove('tabs__item--active');
    tabs[newIndex].classList.add('tabs__item--active');

    currentContent.classList.remove('tabs__description--active');
    contents[newIndex].classList.add('tabs__description--active');
  };

  // -------------------------------------- слайдер

  var changeSlide = function (slides, bullets, newIndex) {
    slides[newIndex].classList.add('cards__img--active');
    bullets[newIndex].classList.add('cards__bullet--active');
  };

  // -------------------------------------- accordeon

  var showAccordeonContent = function (container, items, newIndex) {
    var activeTab = container.querySelector('.accordeon__item--active');

    if (activeTab) {
      activeTab.classList.remove('accordeon__item--active');
    }

    items[newIndex].classList.add('accordeon__item--active');
  };

  // -------------------------------------- testimonials

  var getActiveTestimonialSlide = function (container) {
    return container.querySelector('.testimonials__item--active');
  };

  var changeCurrentPageIndicator = function (indicator, slidesContainer) {
    var currentSlide = getActiveTestimonialSlide(slidesContainer);
    var currentPage = +currentSlide.dataset.slide + 1;
    indicator.textContent = currentPage;
  };

  var getNewSlideIndex = function (direction, slides, container) {
    var currentSlide = getActiveTestimonialSlide(container);
    var newIndex;

    switch (direction) {
      case 'leftButton':
        newIndex = +currentSlide.dataset.slide - 1;
        break;
      default:
        newIndex = +currentSlide.dataset.slide + 1;
    }

    if (newIndex < 0) {
      newIndex = slides.length - 1;
    } else if (newIndex > slides.length - 1) {
      newIndex = 0;
    }

    return newIndex;
  };

  var changeTestimonialSlide = function (container, slides, newIndex) {
    var currentSlide = getActiveTestimonialSlide(container);
    currentSlide.classList.remove('testimonials__item--active');
    slides[newIndex].classList.add('testimonials__item--active');
  };

  // ------------- localstorage

  var setLocalStorage = function (key, value, userObj) {
    userObj[key] = value;
    localStorage.setItem(USER_OBJECT_NAME, JSON.stringify(userObj));
  };

  var getLocalStorageValue = function (key) {
    return JSON.parse(localStorage.getItem(key));
  };

  var setInputValuesFromLocalStorage = function (telInputs, nameInputs) {
    var data = getLocalStorageValue(USER_OBJECT_NAME);

    if (data) {
      telInputs.forEach(function (it) {
        it.value = data.tel;
      });

      if (data.name !== undefined) {
        nameInputs.forEach(function (it) {
          it.value = data.name;
        });
      }
    }
  };

  window.vendor = {
    showModal: showModal,
    closeModal: closeModal,
    validateTelNumber: validateTelNumber,
    resetInputError: resetInputError,
    getActiveTab: getActiveTab,
    setNewTab: setNewTab,
    changeSlide: changeSlide,
    showAccordeonContent: showAccordeonContent,
    getNewSlideIndex: getNewSlideIndex,
    changeTestimonialSlide: changeTestimonialSlide,
    changeCurrentPageIndicator: changeCurrentPageIndicator,
    setInputValuesFromLocalStorage: setInputValuesFromLocalStorage,
    setLocalStorage: setLocalStorage,
  };
})();
