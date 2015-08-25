'use strict';

//Topbars service used to communicate Topbars REST endpoints
angular.module('topbars').factory('Topbars', ['$resource',
	function($resource) {
		return $resource('topbars/:topbarId', { topbarId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);