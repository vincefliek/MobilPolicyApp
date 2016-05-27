'use strict';

/* Directives */

module.exports = angular

	.module('mobPolAppDirectives', [ require('angular-scroll') ])

	.value('duScrollActiveClass', 'js-active-item')
	.directive('mpCreateModal', require('./modalWindow.directive'))
	.directive('mpOnlyDigits', require('./view1OnlyDigits.directive'))
	.directive('mpSetHeight', require('./view1SetHeight.directive'))
	.directive('mpSetScrollStep', require('./view1SetScrollStep.directive'))
	.directive('mpWidthLMI', require('./view1WidthLastMenuItem.directive'));