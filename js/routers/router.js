/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Router
	// ----------
	app.Routers = Backbone.Router.extend({
		routes: {
			'': 'index',
			'*pageFilter': 'other',
            // 'design': 'design'
		},
		index: function(param){
			var self = this;
			console.log('indexindexindexindexindexindex');

			var div = param || 'top';


			app.PagesModel.set('DIV', div);

			//初回通信が終了している場合
			if(app.PagesModel.get('initFetchFlg') == true){
				app.PagesModel.trigger('pageChange:' + div);
			}

			app.PagesModel.trigger('menu:close');
		},
        other: function(param){
            var self = this;
			console.log('designdesigndesigndesigndesign');

			var div = param || 'top';
			app.PagesModel.set('DIV', div);

			//初回通信が終了している場合
			if(app.PagesModel.get('initFetchFlg') == true){
				app.PagesModel.trigger('pageChange:' + div);
			}

            app.PagesModel.trigger('menu:close');
        }

	});


})();
