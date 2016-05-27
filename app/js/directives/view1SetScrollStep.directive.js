'use strict';

  /**
   * @desc    mpSetScrollStep directive sets scroll step that
   *          equals to $document[0].documentElement.clientHeight
   *          when !MOUSEWHEEL! event is triggered
   * @example <div mp-set-scroll-step></div>
   */

module.exports = ['$document', '$window', '$timeout',

  function setScrollStep($document, $window, $timeout) {
    var directive = {
      link: link,
      restrict: 'A'
    };

    return directive;

    function link(scope, element, attrs) {
      var lastClientHeight;
      // "- 1" means that navigation as an element child is excluded
      var amountPageElems = element.children().length - 1;
      // IE6+ supports clientHeight
      var clientHeight = $document[0].documentElement.clientHeight;
      // detecting IE browser (AngularJS uses the same approach)
      var msie = $document[0].documentMode;
      // the last scroll position from page top after last !MOUSEWHEEL! activeness
      var lastScrollPos = 0;
      // it is changing to 'true', when user scrolls !MOUSEWHEEL!
      // and after setting new scroll position it becomes again 'false'
      var isMouseWheelActive = false;
      // this calculation workaround is used instead of detecting document
      // innerHeight/scrollHeight/offsetHeight and so on, because of data
      // inaccuracy in different browsers and browser compatibility issues
      var documentHeight = amountPageElems * clientHeight;
      var lastAllowedScrollPos = documentHeight - clientHeight;

      if ( msie == 8 ) ie8SetActiveClass(lastScrollPos);

      /* --------------- Resize Event -------------- */
      angular.element($window).on('resize', clientHt);

      // after changing screen sizes it's needed to refresh all variables for
      // giving current data to the mousewheel handlers
      function clientHt() {
        var newScrPos = lastScrollPos / lastClientHeight * $document[0].documentElement.clientHeight;

        clientHeight = $document[0].documentElement.clientHeight;
        documentHeight = amountPageElems * clientHeight;
        lastAllowedScrollPos = documentHeight - clientHeight;
        lastScrollPos = newScrPos;
      }

      /* --------------- Scroll Event -------------- */
      // this event is called, when user scrolls the page using
      // something else than mousewheel (e.g., navbar, button
      // at the bottom of the block)
      angular.element($window).on('scroll', watchScroll);

      function watchScroll() {
        var scrollHere = $document.duScrollTop();

        updateLastScrollPos(scrollHere);
        if ( msie == 8 ) ie8SetActiveClass(lastScrollPos);
      }

      function updateLastScrollPos(scroll) {
        element.children().each(function() {
          var $this = $(this);
          var $thisScrPos = $this.position().top;

          if ( $this.index() != 0 ) { /* omit 1-st child - it's menu */
            if ( scroll == $thisScrPos ) lastScrollPos = scroll ;
          }
        });
      }

      /* --------------- Keydown Event -------------- */
      var watchKeydownElem = $window;
      if ( msie == 8 ) watchKeydownElem = $document;

      angular.element(watchKeydownElem).on('keydown', watchKeydown);

      function watchKeydown(e) {
        e = e || $window.event;

        if ( e.keyCode == 40 || /* btn 'Down' */
             e.keyCode == 34 || /* btn 'PageDown' */
             e.keyCode == 32    /* btn 'Space' */
            ) {
          manageWheelDown();
          watchScroll();
        } else
        if ( e.keyCode == 38 || /* btn 'Up' */
             e.keyCode == 33    /* btn 'PageUp' */
            ) {
          manageWheelUp();
          watchScroll();
        }
      }

      /* --------------- Mousewheel Event -------------- */
      if ( $window.addEventListener ) {
        if ( 'onwheel' in document ) {
          // IE9+, FF17+, Ch31+, Safari7+, Opera18+
          $window.addEventListener( 'wheel', watchMouseWheel, false );
        } else if ( 'onmousewheel' in document ) {
          // Ch1+, Safari3+, Opera10+
          $window.addEventListener( 'mousewheel', watchMouseWheel, false );
        }
      } else {
        // IE8-
        $document[0].attachEvent( 'onmousewheel', watchMouseWheel );
      }

      function watchMouseWheel(e) {
        e = e || $window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var delta = e.deltaY || e.detail || e.wheelDelta;

        // off scroll event during mousewheel (or another) event handling
        angular.element($window).off('scroll', watchScroll);

        if (msie) {
          // in IE delta returns value that is opposite to the non-ie browsers
          // example: delta in chrome == 100; delta in IE == -120
          if ( delta < 0 ) manageWheelDown();
          if ( delta > 0 ) manageWheelUp();
        } else {
          if ( delta > 0 ) manageWheelDown();
          if ( delta < 0 ) manageWheelUp();
        }
      }

      function manageWheelDown() {
        var plus = lastScrollPos + clientHeight;

        if ( isMouseWheelActive != true ) {
          isMouseWheelActive = true;

          if ( (lastScrollPos + clientHeight) >= documentHeight ) {
            isMouseWheelActive = false;
          } else {
            setScroll(plus);
            refreshUpVarLSP();
          }
        }
      }

      function manageWheelUp() {
        var minus = lastScrollPos - clientHeight;

        if ( isMouseWheelActive != true ) {
          isMouseWheelActive = true;

          if ( lastScrollPos == 0 ) {
            isMouseWheelActive = false;
          } else if ( lastScrollPos <= lastAllowedScrollPos ) {
            setScroll(minus);
            refreshDownVarLSP();
          }
        }
      }

      function setScroll(value) {
        $document.find('html, body')
          .animate(
            { scrollTop: value },
            500,
            function() { setScrollCallback(value); }
          );
      }

      var setScrollCallbackTimeout;

      function setScrollCallback(val) {
        lastClientHeight = clientHeight;
        isMouseWheelActive = false;

        if ( msie == 8 ) ie8SetActiveClass(val);

        setScrollCallbackTimeout = $timeout(function() {
          // switch on scroll event after end of mousewheel (or another) event;
          // timeout is for preventing simultaneous launch of
          // both scroll and mousewheel events
          angular.element($window).on('scroll', watchScroll);
        }, 100);
      }

      function ie8SetActiveClass(val) {
        // 'duScrollActiveClass' is laggy in IE8, so this's a fallback function
        element.children().eq(0).find('#navig-elems .nav > li').each(function() {
          var $this = $(this);
          // last menu item hasn't attribute 'du-scrollspy', so it == false
          var targetBlockId = $this.attr('data-du-scrollspy') ||
                              $this.attr('du-scrollspy') ||
                              false;
          var targetBlockPos = $( '#' + targetBlockId ).offset();

          $this.removeClass('js-active-item');

          if ( (targetBlockId != false) && (targetBlockPos.top == val) ) {
            // 'active class' approach is used instead of Angular way (e.g. ng-class),
            // because of angular-scroll library (it sets active class in menu item)
            $this.addClass('js-active-item');
          }
        });
      }

      function refreshUpVarLSP() {
        // VarLSP means var lastScrollPos
        lastScrollPos += clientHeight;
      }

      function refreshDownVarLSP() {
        // VarLSP means var lastScrollPos
        lastScrollPos -= clientHeight;
      }

      scope.$on('$destroy', function() {
        watchKeydownElem = null;

        angular.element($window).off('resize', clientHt);
        angular.element($window).off('scroll', watchScroll);
        angular.element(watchKeydownElem).off('keydown', watchKeydown);

        $interval.cancel(setScrollCallbackTimeout);
      });

      // clean up all vanilla JavaScript
      element.on('$destroy', function() {
        if ( $window.addEventListener ) {
          if ( 'onwheel' in document ) {
            // IE9+, FF17+, Ch31+, Safari7+, Opera18+
            $window.removeEventListener( 'wheel', watchMouseWheel, false );
          } else if ( 'onmousewheel' in document ) {
            // Ch1+, Safari3+, Opera10+
            $window.removeEventListener( 'mousewheel', watchMouseWheel, false );
          }
        } else {
          // IE8-
          $document[0].detachEvent( 'onmousewheel', watchMouseWheel );
        }
      });
    }
  }

];