var app = app || {};


//コンテンツサイズ調整
app.MenuView = Backbone.View.extend({
    el: '',
    template: _.template($('#tplMenu').html()),
    initialize: function(attr, options){
        var self = this;

    },
    render: function(){
        var self = this;

        self.$el.html(self.template(self.model.toJSON()));
        self.setElement = self.template(self.model.toJSON());

        return self;
    }
});



app.MenuListView = Backbone.View.extend({
    el: 'body',
    events: {
        'click .trrigerMenuOpen': 'open',
        'click .maskMenu': 'close',
        'click .btn.btn_gNav.active': 'close',
        'click .btn.btn_gNav': 'pageChange',
        'click .trrigerMenuClose': 'close'
    },
    menuOpen: false,
    initialize: function(attr, options){
        var self = this;

        self.$wrap = self.$('.wrapper').eq(0);
        self.$memu = $('#renderMenu');
        self.listenTo(app.PagesModel, 'menu:close', self.close);
        self.listenTo(app.PagesModel, 'change:DIV', self.setActive);
        self.listenTo(self.collection, 'reset', self.render);
    },
    render: function(){
        var self = this;

        //render先を空に
        self.$memu.empty();

        //itemを描画
        self.collection.each(function(model) {
            var view = new app.MenuView({ model: model });
            self.$memu.append(view.render().setElement);
        });

        self.setActive();

        return self;
    },
    pageChange: function(e) {
        var self = this;

        //選択したpageDivを取得
        var pageDiv = $(e.currentTarget).attr('data-nav-div');

        //現在のpageDivと選択したpageDivが同じだった場合、何もしない
        if(app.PagesModel.get('DIV') == pageDiv) return false;

        //pageDivがtopだったら空に
        if(pageDiv == 'top'){
            pageDiv = '';
        }

        app.router.navigate(pageDiv, {trigger:true});
    },
    setActive: function() {
        var self = this;

        //リセット
        self.$memu.find('[data-nav-div]').removeClass('active');

        //activeをセット
        self.$memu.find('[data-nav-div="' + app.PagesModel.get('DIV') + '"]').addClass('active');

    },
    open: function() {
        var self = this;

        //openフラグがtrueだった場合、何もしない
        if(self.menuOpen == true) return false;

        //windowの幅・高取得
        var wWidth = self.$wrap.width();
        var wHeight = self.$wrap.height();

        //マスクの表示
        $(('<div class="maskMenu" />')).appendTo(self.$wrap).css({'position':'absolute','top':0,'left':0,'z-index': 999,'width':wWidth,'height': wHeight,'background-color': 'rgba(0,0,0,0.5)'});
        //closeボタンの表示
        $(('<div class="btn btn_menu btn_menu_close trrigerMenuClose" />')).appendTo(self.$wrap).css({'position':'absolute','top':0,'right':0,'z-index': 1000});

        //wrapperを移動（メニューリストの表示）
        self.$wrap.css({'overflow-x':'visible','transform': 'translateX(-60%)'});

        //openフラグをtrue
        self.menuOpen = true;
    },
    close: function() {
        var self = this;

        //openフラグがfalseだった場合、何もしない
        if(self.menuOpen == false) return false;

        //マスクの非表示
        $(('.maskMenu')).remove();
        //closeボタンの非表示
        $(('.trrigerMenuClose')).remove();

        //wrapperを移動（メニューリストの表示）
        self.$wrap.css({'overflow-x':'hidden','transform': 'translateX(0)'});

        //openフラグをfalse
        self.menuOpen = false;
    }
});

//言語選択
app.LanguageChangeView = Backbone.View.extend({
    el: '#changeLanguage',
    events: {
        'click': 'changeLanguage'
    },
    initialize: function(attr, options){
        var self = this;

        self.listenTo(self.collection, 'reset', self.render);
        self.listenTo(app.PagesModel, 'change:LANG', self.render);
    },
    render: function(){
        var self = this;
        console.log('self.collectioncollectioncollectioncollection');
console.log(self.collection);
        self.$el.text(app.PagesModel.get('LANG'));

        return self;
    },
    changeLanguage: function(){
        var self = this;

        var farstLang;
        var nextLang;
        var nextFlg = false;

        self.collection.each(function(model,key) {
            //最初の言語をセット
            if(farstLang == null){
                farstLang = model.get('LANG');
            }

            //nextFlgがtrueだった場合、言語をセット
            if(nextFlg){
                nextLang = model.get('LANG');
            }

            //現在の言語か判定しnextFlgをtrueに
            if(app.PagesModel.get('LANG') == model.get('LANG')){
                nextFlg = true;
            }

        });

        //nextLangがnullだった場合、farstLangをセット
        nextLang = nextLang || farstLang;

        //modelのLANGを更新
        app.PagesModel.set('LANG',nextLang);

        //画面切り替え
        app.PagesModel.trigger('pageChange:' + app.PagesModel.get('DIV'));
    }
});

//コンテンツサイズ調整
app.ResizeContent = Backbone.View.extend({
    initialize: function(attr, options){
        var self = this;
        self.resize();

        $(window).on("resize", function(){
            self.resize();
        });
    },
    resize: function() {
        var self = this;

        //windowの幅・高取得
        var wHeight = $(window).height();
        var hHeight = $('.header').eq(0).height();
        var fHeight = $('.footer').eq(0).height();

        //contentのサイズ指定
        self.$el.css('min-height',wHeight-hHeight-fHeight);
    }
});

//boxサイズ調整
app.ResizeBox = Backbone.View.extend({
    initialize: function(attr, options){
        var self = this;

        self.boxEl = attr['boxEl'] || '';
        if(self.boxEl ){

            self.listenTo(self, 'resize', self.resize);
            $(window).on("resize", function(){
                self.resize();
            });
        }
    },
    resize: function() {
        var self = this;

        //高さをリセット
        $(self.boxEl).height('');

        //最大値の取得
        var maxHeight  = 0;
        for(var i = 0;i < $(self.boxEl).length;i++){
            if(maxHeight <= $(self.boxEl).eq(i).height()){
                maxHeight = $(self.boxEl).eq(i).height();
            }
        }

        //高さをセット
        $(self.boxEl).height(maxHeight);
    }
});


//アコーディオン
app.Accordion = Backbone.View.extend({
    el: '.box__accordion_tit',
    events: {
        'click': 'toggle'
    },
    opneAccordionId: '',
    initialize: function(attr){
        var self = this;
        console.log('Accordion');

        self.el = attr['el'] || '.box__accordion_tit';
        self.target = attr['taget'] || '.box__accordion_target';
        // self.target = $(taget);
        console.log(self);
        $(document).on("click",self.el ,function(e) {
            self.toggle(e);
        });

        self.listenTo(app.PagesModel, 'change:DEVICE', self.reset);
    },
    toggle: function(e) {
        var self = this;

        //選択したaccordionIdを取得
        var accordionId = $(e.currentTarget).attr('data-accordion-id');


        if(accordionId == self.opneAccordionId){
            self.close(self.opneAccordionId);
            self.opneAccordionId = '';
        }else{
            if(self.opneAccordionId){
                self.close(self.opneAccordionId);
            }
            console.log('toggle');

            self.open(accordionId);
            self.opneAccordionId = accordionId;
        }

    },
    open: function(id){
        var self = this;
        $(self.target + '[data-accordion-id="' + id + '"]').css({
            visibility: 'visible'
        }).slideDown();

        $(self.el + '[data-accordion-id="' + id + '"]').addClass('active');
    },
    close: function(id){
        var self = this;
        $(self.target + '[data-accordion-id="' + id + '"]').slideUp(function(target){
            $(target).css('visibility', 'hidden');
        });

        $(self.el + '[data-accordion-id="' + id + '"]').removeClass('active');
    },
    reset: function(){
        var self = this;
        console.log('resetresetresetresetresetresetresetreset');
        $(self.target).attr('style','');

        $(self.el).removeClass('active');

        self.opneAccordionId = '';
    }
});
