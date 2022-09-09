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

            //ajax成功
            jqXHR.done(function(data, textStatus, jqXHR){

                console.log(data);
                console.log('通信成功通信成功通信成功');


				//最初の通信の際にmenuインスタンス化
				if(!self.menuList && data['menuList']){
					console.log('menuList');
					self.instanceMenu();
				}

				//最初の通信の際にtopContentインスタンス化
				if(!self.topContent && data['topContent']){
					self.instanceTop();
				}

				//最初の通信の際にlineupContentインスタンス化
				if(!self.lineupContent && data['lineupContent']){
					self.instanceLineup();
				}

				//最初の通信の際にdesignContentインスタンス化
				if(!self.designContent && data['designContent']){
					self.instanceDesign();
				}

				//最初の通信の際にbodyColorContentインスタンス化
				if(!self.bodyColorContent && data['bodyColorContent']){
					self.instanceBodyColor();
				}

				//最初の通信の際にperformancContentインスタンス化
				if(!self.performanceContent && data['performanceContent']){
					self.instancePerformance();
				}

				//最初の通信の際にlanguageListインスタンス化
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

				//collectionにdataをセット
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







				//ページの切り替え
				app.PagesModel.trigger('pageChange:' + app.PagesModel.get('DIV'));

				//背景スライダー
				new app.bgSliderView('',{sliderId:'#example'});
				//コンテンツ
				new app.ResizeContent({el:'#renderContent'});

				app.PagesModel.set('initFetchFlg',true);
            });

            //ajax失敗
            jqXHR.fail(function(jqXHR, textStatus, errorThrown){
				console.log('通信失敗');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);


             });

		}
	});
})(jQuery);
