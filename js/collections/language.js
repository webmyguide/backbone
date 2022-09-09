/*global Backbone */
var app = app || {};

(function () {
	'use strict';


	app.LanguageCollection = Backbone.Collection.extend({
		model: app.LanguageModel
	});


	// app.menuCollection = new app.MenuCollection();
})();
