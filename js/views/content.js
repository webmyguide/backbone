/*global Backbone */
var app = app || {};


(function ($) {
	'use strict';


	app.IndexContent = Backbone.View.extend({

		template: _.template($('#tplIndexContent').html()),
		initialize: function () {
            var self = this;

            self.$content = $('#renderContent');
			self.$mainSliderDots = $('#bgSliderDots');

			self.resizeBoxView = new app.ResizeBox({boxEl:'.btn_top'});

			self.listenTo(app.PagesModel, 'pageChange:top', self.pageChange);

			if(app.PagesModel.get('DIV')  == 'top') self.render();

        	self.listenTo(self.collection, 'reset', self.render);


		},
        render: function(){
            var self = this;

			var boxs = {};
			self.collection.each(function(model) {
				var box = model.toJSON();

				if(boxs[box.DIV] == null){
					boxs[box.DIV] = [];
				}
				boxs[box.DIV][boxs[box.DIV].length] = box;
			});

			self.$content.html(self.template({boxs:boxs,pages:app.PagesModel.toJSON()}));


			self.$mainSliderDots.removeClass('mainSlider__dotsArea_other')

			console.log(self.resizeBoxView);
			self.resizeBoxView.trigger('resize');
			// self.resizeBoxView.resize();
        },
        pageChange: function(){
            var self = this;

            self.render();
        }

	});




	app.DesignContent = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#tplDesignContent').html()),
		initialize: function () {
            var self = this;

			self.$content = $('#renderContent');
            self.$mainSliderDots = $('#bgSliderDots');

			self.listenTo(app.PagesModel, 'pageChange:design', self.render);

			// if(app.pageFilter == 'design') self.render();
			console.log('DesignContentDesignContentDesignContentDesignContent');
			console.log(app.PagesModel.get('DIV'));

			self.accordionView =  new app.Accordion({el:'.box__accordion_tit',target:'.box__accordion_target'});
		},
        render: function(){
            var self = this;
			var boxs = {};

			self.collection.each(function(model,key) {
				var box = model.toJSON();

				boxs[key] = box;
			});

			self.$content.html(self.template({boxs:boxs,pages:app.PagesModel.toJSON()}));

			self.$mainSliderDots.addClass('mainSlider__dotsArea_other')

        }

	});

	app.LineupContent = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#tplLineupContent').html()),
		initialize: function () {
			var self = this;

			self.$content = $('#renderContent');
			self.$mainSliderDots = $('#bgSliderDots');

			self.listenTo(app.PagesModel, 'pageChange:lineup', self.render);

			// if(app.pageFilter == 'design') self.render();



		},
		render: function(){
			var self = this;
			var boxs = {};

			self.collection.each(function(model,key) {
				var box = model.toJSON();
				boxs[key] = box;
			});

			self.$content.html(self.template({boxs:boxs,pages:app.PagesModel.toJSON()}));

			self.$mainSliderDots.addClass('mainSlider__dotsArea_other')

		}
	});

	app.BodyColorContent = Backbone.View.extend({
		currentPanelId: 0,
		template: _.template($('#tplBodyColorContent').html()),
		initialize: function () {
			var self = this;

			self.$content = $('#renderContent');
			self.$mainSliderDots = $('#bgSliderDots');
			self.btnColorPanel = '.btn_colorPanel';

			self.listenTo(app.PagesModel, 'pageChange:color', self.render);

			// if(app.pageFilter == 'design') self.render();


			$(document).on('click', self.btnColorPanel, function(e){
	            self.cahngePanel(e);
	        });

		},
		render: function(){
			var self = this;
			var boxs = {};

			self.collection.each(function(model,key) {
				var box = model.toJSON();
				boxs[key] = box;
			});

			self.$content.html(self.template({boxs:boxs,pages:app.PagesModel.toJSON()}));

			self.$mainSliderDots.addClass('mainSlider__dotsArea_other')

			self.panel();
		},
		panel: function(){
			var self = this;

			self.$panel = $('#colorPanel');
			self.$panelFigure = self.$panel.find('.list_panel_figure');
			self.$panelFigureLi = self.$panelFigure.find('li');

			self.$panelFigureLi.hide();
			self.$panelFigureLi.eq(self.currentPanelId).show();

			$(self.btnColorPanel).removeClass('active');
			$(self.btnColorPanel + '[data-panel-id="' + self.currentPanelId + '"]').addClass('active');
		},
		cahngePanel: function(e){
			var self = this;

			var panelId = $(e.currentTarget).attr('data-panel-id');

			//panelIdがない場合、何もしない
			if(panelId == null) return false;

			//現在IDとpanelIdが同じ場合、何もしない
			if(panelId == self.currentPanelId) return false;

			//activeをセット
			console.log($(e.currentTarget).attr('class'));
			console.log($(e.currentTarget));
			$(self.btnColorPanel).removeClass('active');
			$(e.currentTarget).addClass('active');

			self.$panelFigureLi.hide();
			self.$panelFigureLi.eq(panelId).show();
			self.currentPanelId = panelId;
		}
	});


	app.PerformanceContent = Backbone.View.extend({

		// Cache the template function for a single item.
		template: _.template($('#tplPerformanceContent').html()),
		initialize: function () {
			var self = this;

			self.$content = $('#renderContent');
			self.$mainSliderDots = $('#bgSliderDots');

			self.listenTo(app.PagesModel, 'pageChange:performance', self.render);

			// if(app.pageFilter == 'design') self.render();



		},
		render: function(){
			var self = this;
			var boxs = {};

			self.collection.each(function(model,key) {
				var box = model.toJSON();
				boxs[key] = box;
			});

			self.$content.html(self.template({boxs:boxs,pages:app.PagesModel.toJSON()}));

			self.$mainSliderDots.addClass('mainSlider__dotsArea_other')

		}
	});
})(jQuery);
