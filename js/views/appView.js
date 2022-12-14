/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.AppView = Backbone.View.extend({
        url: 'php/app.php',
		menuList: '',
		menuView: '',
		topContent: '',
		topView: '',
		designContent: '',
		designView: '',
		el: 'body',
		events: {
			'click [data-ts-div]': 'pageChange'
		},
		initialize: function () {
            var self = this;

            self.fetchPages();
		},
		pageChange: function(e) {
	        var self = this;

			var pageDiv = $(e.currentTarget).attr('data-ts-div');
			app.PagesModel.trigger('pageChange:' + pageDiv);

	    },

		instanceMenu: function () {
            var self = this;

            self.menuView = new app.MenuListView({collection: new app.MenuCollection,mpdel:app.PagesModel});
		},
		instanceLanguage: function () {
			var self = this;

			self.languageView = new app.LanguageChangeView({collection: new app.LanguageCollection,mpdel:app.PagesModel});
		},
		instanceTop: function () {
			var self = this;

			self.topView = new app.IndexContent({collection: new app.PagesCollection,mpdel:app.PagesModel});
		},
		instanceLineup: function () {
			var self = this;

			self.lineupnView = new app.LineupContent({collection: new app.PagesCollection,mpdel:app.PagesModel});
		},
		instanceDesign: function () {
			var self = this;

			self.designView = new app.DesignContent({collection: new app.PagesCollection,mpdel:app.PagesModel});
		},
		instanceBodyColor: function () {
			var self = this;

			self.bodyColorView = new app.BodyColorContent({collection: new app.PagesCollection,mpdel:app.PagesModel});
		},
		instancePerformance: function () {
			var self = this;

			self.performanceView = new app.PerformanceContent({collection: new app.PagesCollection,mpdel:app.PagesModel});
		},
		fetchPages: function (data) {
            var self = this;

            var jqXHR =  $.ajax(self.url, {
                "type": "post",
                "dataType": "json",
                "data": data,
                "timeout": 5000
            });

            //ajax??????
            jqXHR.done(function(data, textStatus, jqXHR){

                console.log(data);
                console.log('????????????????????????????????????');


				//????????????????????????menu?????????????????????
				if(!self.menuList && data['menuList']){
					console.log('menuList');
					self.instanceMenu();
				}

				//????????????????????????topContent?????????????????????
				if(!self.topContent && data['topContent']){
					self.instanceTop();
				}

				//????????????????????????lineupContent?????????????????????
				if(!self.lineupContent && data['lineupContent']){
					self.instanceLineup();
				}

				//????????????????????????designContent?????????????????????
				if(!self.designContent && data['designContent']){
					self.instanceDesign();
				}

				//????????????????????????bodyColorContent?????????????????????
				if(!self.bodyColorContent && data['bodyColorContent']){
					self.instanceBodyColor();
				}

				//????????????????????????performancContent?????????????????????
				if(!self.performanceContent && data['performanceContent']){
					self.instancePerformance();
				}

				//????????????????????????languageList?????????????????????
				if(!self.languageList && data['languageList']){
					self.instanceLanguage();
				}


				self.menuList = data['menuList'];
				self.topContent = data['topContent'];
				self.lineupContent = data['lineupContent'];
				self.designContent = data['designContent'];
				self.bodyColorContent = data['bodyColorContent'];
				self.performanceContent = data['performanceContent'];
				self.languageList = data['languageList'];

				//collection???data????????????
				if(self.menuList){
					self.menuView.collection.reset(self.menuList);
				}
				if(self.topContent){
					self.topView.collection.reset(self.topContent);
				}
				if(self.lineupContent){
					self.lineupnView.collection.reset(self.lineupContent);
				}
				if(self.designContent){
					self.designView.collection.reset(self.designContent);
				}
				if(self.bodyColorContent){
					self.bodyColorView.collection.reset(self.bodyColorContent);
				}
				if(self.performanceContent){
					self.performanceView.collection.reset(self.performanceContent);
				}
				if(self.languageList){
					self.languageView.collection.reset(self.languageList);
				}







				//????????????????????????
				app.PagesModel.trigger('pageChange:' + app.PagesModel.get('DIV'));

				//?????????????????????
				new app.bgSliderView('',{sliderId:'#example'});
				//???????????????
				new app.ResizeContent({el:'#renderContent'});

				app.PagesModel.set('initFetchFlg',true);
            });

            //ajax??????
            jqXHR.fail(function(jqXHR, textStatus, errorThrown){
				console.log('????????????');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);


             });

		}
	});
})(jQuery);
