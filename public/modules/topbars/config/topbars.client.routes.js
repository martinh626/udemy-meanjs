'use strict';

//Setting up route
angular.module('topbars').config(['$stateProvider',
	function($stateProvider) {
		// Topbars state routing
		$stateProvider.
		state('listTopbars', {
			url: '/topbars',
			templateUrl: 'modules/topbars/views/list-topbars.client.view.html'
		}).
		state('createTopbar', {
			url: '/topbars/create',
			templateUrl: 'modules/topbars/views/create-topbar.client.view.html'
		}).
		state('viewTopbar', {
			url: '/topbars/:topbarId',
			templateUrl: 'modules/topbars/views/view-topbar.client.view.html'
		}).
		state('editTopbar', {
			url: '/topbars/:topbarId/edit',
			templateUrl: 'modules/topbars/views/edit-topbar.client.view.html'
		});
	}
]);