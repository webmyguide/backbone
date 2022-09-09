/*global Backbone */
var app = app || {};

(function () {
	'use strict';


	app.MenuCollection = Backbone.Collection.extend({
		model: app.MenuModel
	});


	// app.menuCollection = new app.MenuCollection();
})();
