'use strict';

(function () {
  var ESC_KEY = 'Escape';

  var orderButton = document.querySelector('.page-header__button');
  var orderModal = document.querySelector('.modal--callback');
  var modalInner = orderModal.querySelector('.modal__inner');
  var closeButton = orderModal.querySelector('.modal__close');

  document.body.classList.remove('no-js');

  var onOverlayClickCloseModal = function (evt) {
    if (evt.target === orderModal && evt.target !== modalInner) {
      window.vendor.closeModal(orderModal);
      document.removeEventListener('keydown', onEscButtonPressCloseModal);
    }
  };

  var onEscButtonPressCloseModal = function (evt) {
    if (evt.key === ESC_KEY) {
      window.vendor.closeModal(orderModal);
      document.removeEventListener('keydown', onEscButtonPressCloseModal);
    }
  };

  var onOrderButtonClickShowModal = function () {
    window.vendor.showModal(orderModal);
    document.addEventListener('keydown', onEscButtonPressCloseModal);
  };

  var onCloseButtonClickCloseModal = function () {
    window.vendor.closeModal(orderModal);
    document.removeEventListener('keydown', onEscButtonPressCloseModal);
  };

  orderModal.addEventListener('click', onOverlayClickCloseModal);
  orderButton.addEventListener('click', onOrderButtonClickShowModal);
  closeButton.addEventListener('click', onCloseButtonClickCloseModal);

})();
