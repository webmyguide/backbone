/*global Backbone */
var app = app || {};

(function () {
	'use strict';


	var PagesModel = Backbone.Model.extend({
		idAttribute: 'PAGE_ID',
		defaults: {
			PAGE_ID: '',
			DIV: '',
			LANG: 'JP',
			DEVICE: '',
			deviceBreakPoint: {
	            sp:640,
	            tb:960,
	            pc:''
	        },
			initFetchFlg: false
		},
		initialize: function(attr, options){
			var self = this;
			self.setMedia();

			$(window).on("resize", function(){
				self.setMedia();
			});
		},
		setMedia : function(){
			var self = this;

			//windowのwidth取得
			var wWidth = $(window).width();

			//widthによりdeviceTypeを振り分け
			var oldDevice = self.DEVICE;
			var currentDevice, deviceKey;
			_.each(self.get('deviceBreakPoint'),function(val,key) {

				if((wWidth <= val) && (!currentDevice)){
				 	currentDevice = key;
				}
				deviceKey = key;
			});

			//currentDeviceに何もない場合、PCをセット
			if(!currentDevice){
				currentDevice = deviceKey;
			}

			//oldDeviceとcurrentDeviceeを比較、同じ場合何もしない
			if(oldDevice == currentDevice) return false;

			//currentDeviceをDEVICEにセット
			self.set('DEVICE',currentDevice);

		}
	});

    app.PagesModel = new PagesModel();
})();
