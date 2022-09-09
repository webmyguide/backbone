/*global Backbone */
var app = app || {};

(function () {
	'use strict';


	app.MenuModel = Backbone.Model.extend({
		idAttribute: 'PAGE_ID',
		defaults: {
			PAGE_ID: '',
			NAME: '',
			LINK_PATH: '',
			DIV: '',
			DEL_FLG: ''
		},
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		}
	});
})();
