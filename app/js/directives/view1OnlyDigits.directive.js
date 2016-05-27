'use strict';

  /**
   * @desc    mpOnlyDigits directive that can be used to any input;
   *          it checks input and allow for only digits, '+' and spaces.
   * @example <div mp-only-digits></div>
   */

module.exports = [

  function checkDigits() {
    var directive = {
      link: link,
      restrict: 'A',
      require: '?ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      if (!ngModel) return;
      ngModel.$parsers.unshift(function (inputValue) {
        var digits = inputValue.replace(/[^+\d\s]/g, "");
        ngModel.$viewValue = digits;
        ngModel.$render();
        return digits;
      });
    }
  }

];