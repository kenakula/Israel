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
