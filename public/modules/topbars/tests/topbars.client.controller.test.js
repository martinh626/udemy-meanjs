'use strict';

(function() {
	// Topbars Controller Spec
	describe('Topbars Controller Tests', function() {
		// Initialize global variables
		var TopbarsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Topbars controller.
			TopbarsController = $controller('TopbarsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Topbar object fetched from XHR', inject(function(Topbars) {
			// Create sample Topbar using the Topbars service
			var sampleTopbar = new Topbars({
				name: 'New Topbar'
			});

			// Create a sample Topbars array that includes the new Topbar
			var sampleTopbars = [sampleTopbar];

			// Set GET response
			$httpBackend.expectGET('topbars').respond(sampleTopbars);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.topbars).toEqualData(sampleTopbars);
		}));

		it('$scope.findOne() should create an array with one Topbar object fetched from XHR using a topbarId URL parameter', inject(function(Topbars) {
			// Define a sample Topbar object
			var sampleTopbar = new Topbars({
				name: 'New Topbar'
			});

			// Set the URL parameter
			$stateParams.topbarId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/topbars\/([0-9a-fA-F]{24})$/).respond(sampleTopbar);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.topbar).toEqualData(sampleTopbar);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Topbars) {
			// Create a sample Topbar object
			var sampleTopbarPostData = new Topbars({
				name: 'New Topbar'
			});

			// Create a sample Topbar response
			var sampleTopbarResponse = new Topbars({
				_id: '525cf20451979dea2c000001',
				name: 'New Topbar'
			});

			// Fixture mock form input values
			scope.name = 'New Topbar';

			// Set POST response
			$httpBackend.expectPOST('topbars', sampleTopbarPostData).respond(sampleTopbarResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Topbar was created
			expect($location.path()).toBe('/topbars/' + sampleTopbarResponse._id);
		}));

		it('$scope.update() should update a valid Topbar', inject(function(Topbars) {
			// Define a sample Topbar put data
			var sampleTopbarPutData = new Topbars({
				_id: '525cf20451979dea2c000001',
				name: 'New Topbar'
			});

			// Mock Topbar in scope
			scope.topbar = sampleTopbarPutData;

			// Set PUT response
			$httpBackend.expectPUT(/topbars\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/topbars/' + sampleTopbarPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid topbarId and remove the Topbar from the scope', inject(function(Topbars) {
			// Create new Topbar object
			var sampleTopbar = new Topbars({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Topbars array and include the Topbar
			scope.topbars = [sampleTopbar];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/topbars\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTopbar);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.topbars.length).toBe(0);
		}));
	});
}());