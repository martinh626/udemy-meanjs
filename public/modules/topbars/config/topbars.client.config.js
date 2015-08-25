'use strict';

// Configuring the Articles module
angular.module('topbars').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Topbars', 'topbars', 'dropdown', '/topbars(/create)?');
		Menus.addSubMenuItem('topbar', 'topbars', 'List Topbars', 'topbars');
		Menus.addSubMenuItem('topbar', 'topbars', 'New Topbar', 'topbars/create');
	}
]);