'use strict';

(function () {
  var SCROLL_Y = 800;
  var SCROLL_X = 0;
  var SCROLL_BEHAVIOUR = 'smooth';

  var orderButton = document.querySelector('.page-header__button');
  var orderModal = document.querySelector('.modal--callback');
  var successModal = document.querySelector('.modal--success');
  var scrollButton = document.querySelector('.promo__scroll');

  var errors = {};

  var form = document.querySelector('.modal__form');
  var telInput = form.querySelector('.form__inner--phone input[type="tel"]');

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

  orderButton.addEventListener('click', onOrderButtonClickShowModal);
  scrollButton.addEventListener('click', onScrollButtonClickDocumentScroll);

  telInput.addEventListener('change', onTelInputChangeValidateValue);
  telInput.addEventListener('focus', onTelInputFocusResetValue);

  form.addEventListener('submit', onFormSubmit);

})();
