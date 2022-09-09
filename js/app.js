/*global $ */
var app = app || {};
app.mediator = _.extend({}, Backbone.Events);

$(function () {
	'use strict';


	new app.AppView();

	app.router = new app.Routers();
    Backbone.history.start();
});
