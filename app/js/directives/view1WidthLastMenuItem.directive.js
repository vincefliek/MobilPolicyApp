'use strict';

  /**
   * @desc    mpWidthLMI directive that can be used inside view1;
   *          it sets width for last menu item into 'data-ng-style'
   *          attr with calcWidth variable
   * @example <div mp-width-l-m-i></div>
   */

module.exports = ['$window', '$timeout',

  function setWidthLMI($window, $timeout) {
    var directive = {
      link: link,
      restrict: 'A'
    };

    return directive;

    function link(scope) {
      var elemsClasses = [
        '.menu-fixed',
        '.logo-wrapper',
        '.menu-fixed__kant',
        '.menu-fixed__item--1',
        '.menu-fixed__item--2',
        '.menu-fixed__item--3',
        '.menu-fixed__item--4'
      ];
      var widths = {
        menu: 0,
        firstDirItem: 0,
        secondDirItem: 0,
        menuItem1: 0,
        menuItem2: 0,
        menuItem3: 0,
        menuItemEmpty: 0
      };
      var lastMenuItemWidth;
      var sumItemsWithoutLast = 0;

      var calcWidthTimeout = $timeout(function() {
        calcWidth();

        angular.element($window).on('resize orientationchange', function() {
          calcWidth();
        });

        // outerWidth(true) calculation time is different in each browser,
        // so this timeout is needed to calculate proper widths
      }, 60);

      function calcWidth() {
        // reset width for new calculating in this fn
        angular.element( elemsClasses[elemsClasses.length - 1] ).css({width: 0});
        // reset number, because in loop each value
        // increases current value of sumItemsWithoutLast
        sumItemsWithoutLast = 0;

        var objCounter = 0;

        for ( var item in widths ) {
          if( widths.hasOwnProperty(item) ) {

            for ( var i = 0; i < elemsClasses.length; i++ ) {
              if ( i == objCounter ) {
                widths[item] = angular.element(elemsClasses[i]).outerWidth(true);
              }
              if ( (i == objCounter) && (i > 0) && (i < elemsClasses.length - 1) ) {
                sumItemsWithoutLast += widths[item];
              }
            }

          }
          objCounter++;
        }

        lastMenuItemWidth = widths.menu - sumItemsWithoutLast - widths.menuItemEmpty;

        scope.calcWidth = {
          width: lastMenuItemWidth + 'px'
        };
      }

      scope.$on('$destroy', function() {
        $interval.cancel(calcWidthTimeout);
        angular.element($window).off('resize orientationchange', function() {
          calcWidth();
        });
      });
    }
  }

];