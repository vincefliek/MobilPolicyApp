'use strict';

  /**
   * @desc    mpSetHeight directive that can be used inside view1;
   *          it sets clientHeight into 'data-ng-style' attr with newHeight variable.
   * @example <div data-ng-style="mob.newHeight" mp-set-height="mob.newHeight"></div>
   */

module.exports = ['$window', '$document', '$timeout', 'Modernizr',

  function setHeight($window, $document, $timeout, Modernizr) {
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        mpSetHeight: '=?' // '?' makes it optional
      }
    };

    return directive;

    function link(scope) {
      var to1, to2;

      // timeout trick runs the Angular digest cycle
      to1 = $timeout(function() {
        scope.mpSetHeight = scope.clientHeight();
      }, 0);

      angular.element($window).on('resize', function() {
        // timeout trick runs the Angular digest cycle
        to2 = $timeout(function() {
          scope.mpSetHeight = scope.clientHeight();
        }, 0);
      });

      scope.clientHeight = function() {
        // IE6+ supports clientHeight
        var elHeight = $document[0].documentElement.clientHeight;

        if ( $document[0].documentMode == 8 || Modernizr.mq('(min-width: 768px)') ) {
          return { 'height': elHeight };
        } else if ( Modernizr.mq('(max-width: 767px)') ) {
          return { 'min-height': elHeight };
        }
      };

      scope.$on('$destroy', function() {
        $interval.cancel(to1);
        $interval.cancel(to2);

      });
    }
  }

];