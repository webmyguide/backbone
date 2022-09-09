var app = app || {};

app.bgSliderView = Backbone.View.extend({
    sliderId: '',
    sliderDotsId: '#bgSliderDots',
    sliderOptions: {
        speed: 500,
        autoplaySpeed: 10000,
        cssEase: 'ease',
        deviceBreakPoint: {
            sp:640,
            tb:960,
            pc:''
        },
        arrowsHiddenWidth: 1200,
        transformType: '',
        animType: true,// アニメーションするかどうか
        cssTransitions: false,// CSS Transitionを有効にするかどうか
        transformsEnabled: false,// transitionが最終的に有効にできるか
        transformType: '',
        transformType: ''
    },
    currentSlide:0,// 現在のitem
    lengthSlide:0,// itemの数
    widthSlide: '',// sliderの幅
    animating: false,
    deviceType: '',
    el: 'body',
    events: {
        'click #bgGoToPrev': 'goToPrev',
        'click #bgGoToNext': 'goToNext'
    },
    initialize: function(attr, options){
        var self = this;
        self.setting(options);//初期設定

        self.listenTo(self, 'deviceType:change', self.updateImages);

        $(window).on("resize", function(){
            self.resize();
            self.setFade();
        });

        $(document).on("click",self.$dots.find('li').selector, function(e){
            self.goToDots(e);
        });
    },
    sliding: function (index) {
        var self = this;


        var targetIndex = index != null? index:self.currentSlide;



        if (self.animating === true) {
            return;
        }


        // slideCurrentが0以下だったら
        if( targetIndex < 0 ){
            targetSlide = self.lengthSlide - 1;
        // slideCurrentがslideNumを超えたら
        }else if( targetIndex > self.lengthSlide - 1 ){
            targetSlide = 0;
        }else {
            targetSlide = targetIndex;
        }

        self.animating = true;

        var oldSlide = self.currentSlide;
        self.currentSlide = targetSlide;


        self.updateDots();

        self.fadeSlideOut(oldSlide);

        self.fadeSlide(self.currentSlide, function() {
            self.postSlide();

           //  self.animating = false;
           //
           // if (self.slideCount > 1) {
           //     self.setFade();
           // }
           //
           //  self.autoPlay();
        });



    },
    fadeSlideOut: function(slideIndex) {
        var self = this;



        if (self.sliderOptions.cssTransitions === false) {

            self.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: 1
            }, self.sliderOptions.speed, self.sliderOptions.easing);

        } else {
            self.applyTransition(slideIndex);
            self.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: 1
            });

        }
    },
    fadeSlide: function(slideIndex, callback) {
        var self = this;



        if (self.sliderOptions.cssTransitions === false) {

            self.$slides.eq(slideIndex).css({
                zIndex: self.sliderOptions.zIndex
            });

            self.$slides.eq(slideIndex).animate({
                opacity: 1
            }, self.sliderOptions.speed, self.sliderOptions.easing, callback);

        } else {
            self.applyTransition(slideIndex);
            self.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: 5
            });

            setTimeout(function() {
                self.disableTransition(slideIndex);

                callback.call();
            }, self.sliderOptions.speed);

        }

    },
    postSlide: function(){
        var self = this;

        self.animating = false;

       if (self.slideCount > 1) {
           self.setFade();
       }

        self.autoPlay();
    },
    goToPrev: function() {
        var self = this;

        self.sliding(self.currentSlide-1);
    },
    goToNext: function() {
        var self = this;

        self.sliding(self.currentSlide+1);
    },
    goToDots: function(e) {
        var self = this;

        self.sliding(self.$dots.find('li').index($(e.currentTarget)));
    },
    autoPlay: function(){
        var self = this;
        self.autoPlayClear();

        if ( self.lengthSlide > 1 ) {
            self.count = 0;
            self.autoPlayTimer = setInterval( function(){self.autoPlayIterator()}, self.sliderOptions.autoplaySpeed);
        }
    },
    autoPlayClear: function(){
        var self = this;

        if (self.autoPlayTimer) {
             clearInterval(self.autoPlayTimer);
         }
    },
    autoPlayIterator: function(){
        var self = this;
        self.count = self.count + 1;

        var slideTo = self.currentSlide +1;

        self.sliding(slideTo);
    },
    applyTransition: function(index){
        var self = this;
        var transition = {};

        transition[self.sliderOptions.transitionType] = 'opacity ' + self.sliderOptions.speed + 'ms ' + self.sliderOptions.cssEase;
        self.$slides.eq(index).css(transition);
    },
    disableTransition: function(index){
        var self = this;
        var transition = {};

        transition[self.sliderOptions.transitionType] = '';
        self.$slides.eq(index).css(transition);
    },
    buildDots : function(){
        var self = this;
        var dot;

        // DocumentFragment
        var fragment = document.createDocumentFragment();

        for (var i = 0; i < self.lengthSlide; i += 1) {
            var $li = document.createElement('li');
            if(i == self.currentSlide){
                $li.className = 'mainSlider__dot active';
            }else {
                $li.className = 'mainSlider__dot';
            }

            fragment.appendChild($li);
        }

        $('<ul class="mainSlider__dots" />').appendTo($(self.sliderDotsId))[0].appendChild(fragment);

        self.$dots = $(self.sliderDotsId).find('.mainSlider__dots');

    },
    updateDots: function(){
        var self = this;

        if (self.$dots !== null) {

            //リセット
            self.$dots
                .find('li')
                    .removeClass('active')
                .end()
                .find('li')
                    .eq(self.currentSlide)
                    .addClass('active');
        }
    },
    updateImages: function(){
        var self = this;

        self.$slides.each(function(i) {
            var imgPath;
            var imgSelector = self.$slides.eq(i).find('[data-slide-img]');

            //data-slide-imgがない場合、何のしない
            if(imgSelector){
                //デバイス別の画像パスをセット
                imgPath = imgSelector.attr('data-slide-img-' + self.deviceType);

                //imgPathがない場合、PC画像パスをセット
                if(!imgPath){
                    imgPath = imgSelector.attr('data-slide-img');
                }

                //画像を描画
                imgSelector.css('background-image','url(' + imgPath + ')');
            }
        });
    },
    resize: function() {
        var self = this;

        //windowの幅・高取得
        var wWidth = $(window).width();
        var wHeight = $(window).height();

        //thisに保存
        self.widthSlide = wWidth;

        //デバイスタイプをセット
        self.setDeviceType(wWidth);

        //wrapのサイズ指定
        self.$sliderWrap.css({
            width: wWidth,
            height: wHeight
        });

        //slideのサイズ指定
        self.$slides.css({
            width: wWidth,
            height: wHeight
        });

        //slideの総サイズをセット
        var panelWidth = self.$slides.length*wWidth;

        //panelのサイズ指定
        self.$sliderPanel.css('width',panelWidth);

        //前へ・次へのボタンの表示非表示
        self.displayArrows();


    },
    displayArrows: function(){
        var self = this;

        //arrowsHiddenWidthより大きい場合は、表示
        if((self.widthSlide-$('#bgGoToPrev,#bgGoToNext').width()) > self.sliderOptions.arrowsHiddenWidth) {
            $('#bgGoToPrev,#bgGoToNext').css('display', 'block');
        //arrowsHiddenWidthより小さい場合は、表示
        }else {
            $('#bgGoToPrev,#bgGoToNext').css('display', 'none');
        }
    },
    setFade: function() {
        var self = this;
        var targetLeft;

        self.$slides.each(function(index, element) {
            targetLeft = (self.widthSlide * index) * -1;

            $(element).css({
                position: 'relative',
                left: targetLeft,
                top: 0,
                zIndex: 1,
                opacity: 0
            });

        });

        self.$slides.eq(self.currentSlide).css({
            zIndex: 5,
            opacity: 1
        });
    },
    setDeviceType: function(width) {
        var self = this;


        //引数がない場合、何のしない
        if(width == null) return false;

        //widthによりdeviceTypeを振り分け
        var oldDeviceType = self.deviceType;
        var currentDeviceType, deviceKey;
        _.each(self.sliderOptions.deviceBreakPoint,function(val,key) {
            if((width <= val) && (!currentDeviceType)){
                currentDeviceType = key;
            }
            deviceKey = key;
        });

        //currentDeviceTypeに何もない場合、PCをセット
        if(!currentDeviceType){
            currentDeviceType = deviceKey;
        }

        //oldDeviceTypeとcurrentDeviceTypeを比較、同じ場合何もしない
        if(oldDeviceType == currentDeviceType) return false;

        //currentDeviceTypeをdeviceTypeにセット
        self.deviceType = currentDeviceType;

        //画像の更新トリガー
        self.trigger('deviceType:change');
    },
    setting: function(options) {
        var self = this;
        var bodyStyle = document.body.style;


        self.sliderId = options.sliderId;
        self.$sliderWrap = $(self.sliderId);
        self.$sliderPanel = self.$sliderWrap.find('.sliderPanel');
        self.$slides = self.$sliderPanel.find('li');
        self.lengthSlide = self.$slides.length;


        //サイズ調整
        self.resize();

        //画像の描画
        self.updateImages();

        self.setFade();



        // Transitionが使用できる場合は、Transitionを有効
        if (bodyStyle.OTransform !== undefined) {
            self.sliderOptions.animType = 'OTransform';
            self.sliderOptions.transformType = '-o-transform';
            self.sliderOptions.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) self.sliderOptions.animType = false;
            self.sliderOptions.cssTransitions = true;
        }
        if (bodyStyle.MozTransform !== undefined) {
            self.sliderOptions.animType = 'MozTransform';
            self.sliderOptions.transformType = '-moz-transform';
            self.sliderOptions.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) self.sliderOptions.animType = false;
            self.sliderOptions.cssTransitions = true;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            self.sliderOptions.animType = 'webkitTransform';
            self.sliderOptions.transformType = '-webkit-transform';
            self.sliderOptions.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) self.sliderOptions.animType = false;
            self.sliderOptions.cssTransitions = true;
        }
        if (bodyStyle.msTransform !== undefined) {
            self.sliderOptions.animType = 'msTransform';
            self.sliderOptions.transformType = '-ms-transform';
            self.sliderOptions.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) self.sliderOptions.animType = false;
            self.sliderOptions.cssTransitions = true;
        }
        if (bodyStyle.transform !== undefined && self.sliderOptions.animType !== false) {
            self.sliderOptions.animType = 'transform';
            self.sliderOptions.transformType = 'transform';
            self.sliderOptions.transitionType = 'transition';
            self.sliderOptions.cssTransitions = true;
        }


        self.sliderOptions.transformsEnabled = self.sliderOptions.cssTransitions && (self.sliderOptions.animType !== null && self.sliderOptions.animType !== false);


        self.buildDots();

        self.autoPlay();
    }

});
