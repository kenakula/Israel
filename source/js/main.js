'use strict';

(function () {
  var TEL_REG_EXP = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  var ESC_KEY = 'Escape';
  var USER_OBJECT_NAME = 'user';
  var SCROLL_X = 0;
  var SCROLL_BEHAVIOUR = 'smooth';
  var STORAGE_NAME_VALUE = 'name';
  var STORAGE_PHONE_NUMBER = 'tel';
  var MIN_NAME_CHARS = 2;

  var orderButton = document.querySelector('.page-header__button');
  var orderModal = $('.modal--callback');
  var successModal = $('.modal--success');
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
  var accordeonButtons = accordeon.querySelectorAll('.accordeon__button');
  var accordeonHeaders = accordeon.querySelectorAll('.accordeon__item h3');

  var testimonialsContainer = document.querySelector('.testimonials__container');
  var testimonials = testimonialsContainer.querySelectorAll('.testimonials__item');
  var currentPageIndicator = testimonialsContainer.querySelector('#testimonialsCurrent');
  var totalPagesIndicator = testimonialsContainer.querySelector('#testimonialsTotal');
  var testimonialsArrows = testimonialsContainer.querySelectorAll('.testimonials__button');

  document.body.classList.remove('no-js');

  // -------------------------------------- lazyload bg images

  document.addEventListener('DOMContentLoaded', function () {
    var lazyloadImages;

    if ('IntersectionObserver' in window) {
      lazyloadImages = document.querySelectorAll('.lazy');
      var imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            image.classList.remove('lazy');
            imageObserver.unobserve(image);
          }
        });
      });

      lazyloadImages.forEach(function (image) {
        imageObserver.observe(image);
      });

    } else {
      var lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll('.lazy');

      var lazyload = function () {
        if (lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function () {
          var scrollTop = window.pageYOffset;
          lazyloadImages.forEach(function (img) {
            if (img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
          });
          if (lazyloadImages.length === 0) {
            document.removeEventListener('scroll', lazyload);
            window.removeEventListener('resize', lazyload);
            window.removeEventListener('orientationChange', lazyload);
          }
        }, 20);
      };

      document.addEventListener('scroll', lazyload);
      window.addEventListener('resize', lazyload);
      window.addEventListener('orientationChange', lazyload);
    }
  });

  // -------------------------------------- Localstorage

  var setLocalStorage = function (key, value, userObj) {
    userObj[key] = value;
    localStorage.setItem(USER_OBJECT_NAME, JSON.stringify(userObj));
  };

  var getLocalStorageValue = function (key) {
    return JSON.parse(localStorage.getItem(key));
  };

  var setInputValuesFromLocalStorage = function (phoneInputs, textInputs) {
    var data = getLocalStorageValue(USER_OBJECT_NAME);

    if (data) {
      phoneInputs.forEach(function (it) {
        it.value = data.tel;
      });

      if (data.name !== undefined) {
        textInputs.forEach(function (it) {
          it.value = data.name;
        });
      }
    }
  };

  var onPageLoadSetInputsValues = function () {
    setInputValuesFromLocalStorage(telInputs, nameInputs);
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

  // TODO scroll block

  // -------------------------------------- модалки

  var closeModal = function (modal) {
    modal.fadeOut(200);
    $('body').removeClass('no-scroll');
    document.removeEventListener('keydown', onEscButtonPressCloseModal);
  };

  var onEscButtonPressCloseModal = function (evt, modal) {
    if (evt.key === ESC_KEY) {
      closeModal(modal);
      $(document).unbind();
    }
  };

  var onOverlayClickCloseModal = function (evt, modal) {
    if ($(evt.target).hasClass('modal')) {
      closeModal(modal);
    }
  };

  var showModal = function (modal) {
    var closeButton = $(modal).find('button[name="closeButton"]');

    modal.fadeIn(200);
    $('body').addClass('no-scroll');

    closeButton.click(function () {
      closeModal(modal);
    });

    modal.click(function (evt) {
      onOverlayClickCloseModal(evt, modal);
    });

    $(document).bind('keydown', function (evt) {
      onEscButtonPressCloseModal(evt, modal);
    });
  };

  var onOrderButtonClickShowModal = function (evt) {
    evt.preventDefault();
    showModal(orderModal);
    orderModal.find('input[type="text"]').focus();
  };

  // -------------------------------------- формы и валидация

  // сбрасывает стили ошибки
  var resetInputError = function (input) {
    if (input.parentElement.classList.contains('form__inner--error')) {
      input.parentElement.classList.remove('form__inner--error');
    }
  };

  // устанавливает стили ошибки
  var setErrorStyle = function (input) {
    input.parentElement.classList.add('form__inner--error');
  };

  // устанавливает стили валидного ввода
  var setValidStyle = function (input) {
    input.parentElement.classList.add('form__inner--valid');
  };

  // удалаяет стили валидного ввода
  var resetValidStyle = function (form) {
    var inputs = form.querySelectorAll('input');

    inputs.forEach(function (it) {
      if (it.parentElement.classList.contains('form__inner--valid')) {
        it.parentElement.classList.remove('form__inner--valid');
      }
    });
  };

  // валидация номера телефона
  var validateTelNumber = function (input, errorsObj) {
    var value = input.value;

    if (!TEL_REG_EXP.test(value)) {
      setErrorStyle(input);
      errorsObj.tel = 'wrong tel';
    } else {
      resetInputError(input);
      setValidStyle(input);
      delete errorsObj.tel;
    }
  };

  // валидация поля имени
  var validateName = function (input, errorsObj) {
    var value = input.value;

    if (value.length < MIN_NAME_CHARS) {
      setErrorStyle(input);
      errorsObj.name = 'wrong name';
    } else {
      resetInputError(input);
      setValidStyle(input);
      delete errorsObj.name;
    }
  };

  var onTelInputChangeValidateValue = function (evt) {
    validateTelNumber(evt.target, errors);
  };

  var onNameInputChangeValidateValue = function (evt) {
    validateName(evt.target, errors);
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
    if (errors.tel || errors.name) {
      evt.preventDefault();
    } else {
      evt.preventDefault();
      resetValidStyle(evt.target);
      closeModal(orderModal);
      showModal(successModal);
      setLocalStorage(STORAGE_PHONE_NUMBER, getPhoneInputValue(evt.target), user);
      // проверяет наличие поля имени в форме
      if (evt.target.querySelector('input[type="text"]')) {
        setLocalStorage(STORAGE_NAME_VALUE, getNameInputValue(evt.target), user);
      }

      evt.target.reset();
    }
  };

  // фокус и наведение на инпуты
  var onInputFocusBlurChangeOutline = function (evt) {
    var container = evt.target.parentElement;

    if (!container.classList.contains('form__inner--focused')) {
      container.classList.add('form__inner--focused');
    }

    if (evt.type === 'focus' && container.classList.contains('form__inner--error')) {
      container.classList.remove('form__inner--error');
    }
  };

  var onInputBlurChangeOutline = function (evt) {
    var container = evt.target.parentElement;

    if (container.classList.contains('form__inner--focused')) {
      container.classList.remove('form__inner--focused');
    }

    if (evt.target.type === 'text' && errors.name !== undefined) {
      container.classList.add('form__inner--error');
    } else if (evt.target.type === 'tel' && errors.tel !== undefined) {
      container.classList.add('form__inner--error');
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

  // получает активный таб
  var getActiveTab = function (container) {
    return container.querySelector('.tabs__item--active');
  };

  // устанавливает активный таб
  var setNewTab = function (currentIndex, newIndex, tabs, contents) {
    var currentTab = $(tabs[currentIndex]);
    var currentContent = $(contents[currentIndex]);

    currentTab.removeClass('tabs__item--active');
    $(tabs[newIndex]).addClass('tabs__item--active');

    currentContent.removeClass('tabs__description--active');
    currentContent.fadeOut();
    $(contents[newIndex]).fadeIn();
  };

  var onTabButtonClickContentShow = function (evt) {
    var activeTabIndex = getActiveTab(tabsContainer).dataset.tab;
    var newTabIndex = evt.currentTarget.dataset.tab;

    setNewTab(activeTabIndex, newTabIndex, tabButtons, tabContents);
    centerNewTab(evt);
  };

  var centerNewTab = function (evt) {
    var activeTab = getActiveTab(tabsContainer); // находит активный (новый) таб
    var tabHalfWidth = evt.currentTarget.clientWidth / 2; // половина ширины таба
    var screenHalfWidth = document.documentElement.clientWidth / 2; // половина ширины окна
    var buttonToListEdge = activeTab.getBoundingClientRect().x - tabsList.getBoundingClientRect().x; // расстояние от таба до края списка
    var buttonToScreenEdge = buttonToListEdge + tabHalfWidth; // расстояние от таба до края окна
    var shift = screenHalfWidth - buttonToScreenEdge; // смещение относительно центра окна

    tabsList.style.left = shift + 'px';
  };

  // -------------------------------------- слайдер

  // israel slider

  // меняет слайд
  var changeSlide = function (slides, bullets, newIndex) {
    slides[newIndex].classList.add('cards__img--active');
    bullets[newIndex].classList.add('cards__bullet--active');
  };

  // получает активный слайд
  var getActiveSlide = function (container) {
    return container.querySelector('.cards__img--active');
  };

  // получает активную кнопку контрола
  var getActiveBullet = function (container) {
    return container.querySelector('.cards__bullet--active');
  };

  // при клике на кнопку контрола меняет слайд
  var onBulletClickChangeIsraelSlide = function (evt) {
    var activeSlide = getActiveSlide(israelSlidesContainer);
    var activeBullet = getActiveBullet(israelSlidesContainer);

    activeBullet.classList.remove('cards__bullet--active');
    activeSlide.classList.remove('cards__img--active');

    var newIndex = evt.target.dataset.index;
    changeSlide(israelSlides, israelSlidesBullets, newIndex);
  };

  // testimonials slider

  // получает текущий активный слайд
  var getActiveTestimonialSlide = function (container) {
    return container.querySelector('.testimonials__item--active');
  };

  // устанавливает количество слайдов в индикатор общего количества слайдов
  totalPagesIndicator.textContent = testimonials.length;

  // меняет индикатор текущего слайда
  var changeCurrentPageIndicator = function (indicator, slidesContainer) {
    var currentSlide = getActiveTestimonialSlide(slidesContainer);
    var currentPage = +currentSlide.dataset.slide + 1;
    indicator.textContent = currentPage;
  };

  // получает индекс нового слайда
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

  // меняет слайды
  var changeTestimonialSlide = function (container, slides, newIndex) {
    var currentSlide = getActiveTestimonialSlide(container);
    currentSlide.classList.remove('testimonials__item--active');
    slides[newIndex].classList.add('testimonials__item--active');
  };

  // меняет слайды при использовании стрелок
  var onArrowClickChangeTestimonialSlide = function (evt) {
    var direction = evt.target.id;
    var newSlideIndex = getNewSlideIndex(direction, testimonials, testimonialsContainer);
    changeTestimonialSlide(testimonialsContainer, testimonials, newSlideIndex);
    changeCurrentPageIndicator(currentPageIndicator, testimonialsContainer);
  };

  // -------------------------------------- accordeon

  // разворачивает контент таба

  var onAccordeonButtonClickToggleContent = function (evt) {
    $(evt.target).nextAll('p').slideToggle();
    $(evt.target).parent().toggleClass('accordeon__item--active');
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
  });

  nameInputs.forEach(function (it) {
    it.addEventListener('change', onNameInputChangeValidateValue);
  });

  forms.forEach(function (it) {
    it.addEventListener('submit', onFormSubmit);
  });

  formInputs.forEach(function (it) {
    it.addEventListener('focus', onInputFocusBlurChangeOutline);
    it.addEventListener('blur', onInputBlurChangeOutline);
    it.addEventListener('mouseover', onInputHoverChangeOutline);
    it.addEventListener('mouseout', onInputHoverChangeOutline);
  });

  window.addEventListener('load', onPageLoadSetInputsValues);

})();
