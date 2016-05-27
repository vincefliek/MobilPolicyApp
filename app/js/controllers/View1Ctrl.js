'use strict';

module.exports = ['Modernizr',

  function View1Ctrl(Modernizr) {
    var vm = this;

    vm.newHeight = {};

    vm.modalVisible = true;
    vm.toggleModal = toggleModal;

    function toggleModal() {
      vm.modalVisible = false;
    }

    // swedish phone number format regexp
    // accepted input: '+46 70 2344 999' or '+46702344999'
    vm.telPattern = /^([+]46)\s*(\d{2})\s*(\d{4})\s*(\d{3})$/;

    vm.matchMQ = Modernizr.mq('(max-width: 767px)');

  }];