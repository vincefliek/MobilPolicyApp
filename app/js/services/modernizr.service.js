'use strict';

module.exports = ['$window',

	function ModernizrFactory($window) {

		if($window.Modernizr){
			// Delete Modernizr from window so it's not globally accessible.
			// We can still get it through _thirdParty
			$window._thirdParty = $window._thirdParty || {};
			$window._thirdParty.Modernizr = $window.Modernizr;
			try {
				delete $window.Modernizr;
			} catch (e) {
				$window.Modernizr = undefined;
			}
		}

		var Modernizr = $window._thirdParty.Modernizr;

		return Modernizr;
	}

];