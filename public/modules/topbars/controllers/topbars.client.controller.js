'use strict';

// Topbars controller
angular.module('topbars').controller('TopbarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Topbars',
	function($scope, $stateParams, $location, Authentication, Topbars) {
		$scope.authentication = Authentication;

		// Create new Topbar
		$scope.create = function() {
			// Create new Topbar object
			var topbar = new Topbars ({
				name: this.name
			});

			// Redirect after save
			topbar.$save(function(response) {
				$location.path('topbars/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Topbar
		$scope.remove = function(topbar) {
			if ( topbar ) { 
				topbar.$remove();

				for (var i in $scope.topbars) {
					if ($scope.topbars [i] === topbar) {
						$scope.topbars.splice(i, 1);
					}
				}
			} else {
				$scope.topbar.$remove(function() {
					$location.path('topbars');
				});
			}
		};

		// Update existing Topbar
		$scope.update = function() {
			var topbar = $scope.topbar;

			topbar.$update(function() {
				$location.path('topbars/' + topbar._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Topbars
		$scope.find = function() {
			$scope.topbars = Topbars.query();
		};

		// Find existing Topbar
		$scope.findOne = function() {
			$scope.topbar = Topbars.get({ 
				topbarId: $stateParams.topbarId
			});
		};
	}
]);