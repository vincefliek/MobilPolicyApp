'use strict';

  /**
   * @desc    mpCreateModal directive that can be used everywhere in app;
   *          it creates modal window by templating special html from templateUrl
   * @example <div mp-create-modal></div>
   */

module.exports = ['$window', '$timeout', '$document',

  function createModal($window, $timeout, $document) {
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        mpCreateModal: '='
      },
      templateUrl: 'views/view1/modalWindow.directive.template.html',
      transclude: true
    };

    return directive;

    function link(scope, elem) {
      var watchKeydownElem = $window;
      if ( $document[0].documentMode == 8 ) watchKeydownElem = $document; // IE8

      scope.submit = function() {
        console.log( 'Form is sending: ' + angular.toJson(scope.invitationForm) );
      };

      scope.hideModal = function() {
        scope.mpCreateModal = true;
        elem.find('.mp-modal').attr({
          'tabindex': -1,
          'aria-hidden': true
        });
      };


      /* ------------------------------------------------ */
      /* ---- Let's add some Accessibility (WCAG2.0) ---- */
      /* ------------------------------------------------ */
      var mpCreateModalListener = scope.$watch('mpCreateModal', function() {
        if ( !scope.mpCreateModal ) {
          elem.find('.mp-modal').attr({
            'tabindex': 0,
            'aria-hidden': false
          });
        }
      });

      elem.find('button[type=submit]').click( scope.submit );

      angular.element(watchKeydownElem).on('keydown', keydownHandler);

      var keydownTimeout;

      function keydownHandler(e) {
        e = e || $window.event;

        keydownTimeout = $timeout(function() {
          if ( e.keyCode === 27 ) { /* btn 'Esc' */
            scope.hideModal();
          }

          if ( e.keyCode === 13 && !scope.mpCreateModal ) { /* btn 'Enter' */
            scope.submit();
          }
        }, 0);
      }

      scope.$on('$destroy', function() {
        mpCreateModalListener();

        elem.find('button[type=submit]').off('click', function() {
          scope.submit();
        });
        angular.element(watchKeydownElem).off('keydown', keydownHandler);

        $interval.cancel(keydownTimeout);
      });
    }
  }

];