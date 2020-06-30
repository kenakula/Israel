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

  document.body.classList.remove('no-js');


  // скролл
  var onScrollButtonClickDocumentScroll = function () {
    window.scrollBy({
      top: SCROLL_Y,
      left: SCROLL_X,
      behavior: SCROLL_BEHAVIOUR,
    });
  };

  // модалки

  var onOrderButtonClickShowModal = function () {
    window.vendor.showModal(orderModal);
  };

  // валидация

  // сделай валидацию поля имени

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

  // табы

  // проверка на тач-устройство
  var isTouchCapable = 'ontouchstart' in window ||
    window.DocumentTouch && document instanceof window.DocumentTouch ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;

  // drag'n'drop для мыши. При ширине меньше 1024px некоторые элементы списка скрываются, список получает позиционирование relative, на бОльших ширинах drag'n'drop не работает, все элементы видны.

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

  // TODO tab centering

  var onTabButtonClickContentShow = function (evt) {
    var activeTabIndex = window.vendor.getActiveTab(tabsContainer).dataset.tab;
    var newTabIndex = evt.currentTarget.dataset.tab;

    window.vendor.setNewTab(activeTabIndex, newTabIndex, tabButtons, tabContents);
  };

  tabButtons.forEach(function (it) {
    it.addEventListener('click', onTabButtonClickContentShow);
  });

  orderButton.addEventListener('click', onOrderButtonClickShowModal);
  scrollButton.addEventListener('click', onScrollButtonClickDocumentScroll);

  telInput.addEventListener('change', onTelInputChangeValidateValue);
  telInput.addEventListener('focus', onTelInputFocusResetValue);

  form.addEventListener('submit', onFormSubmit);

})();
