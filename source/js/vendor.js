'use strict';

(function () {
  var TEL_REG_EXP = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  var ESC_KEY = 'Escape';


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

  // модалки

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

  window.vendor = {
    showModal: showModal,
    closeModal: closeModal,
    validateTelNumber: validateTelNumber,
    resetInputError: resetInputError,
  };
})();