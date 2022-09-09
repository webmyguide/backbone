function CommonManager() {
    this.initialize.apply(this, arguments);
}
//---------------------------------------------------------------------------------------
// 初期値
//---------------------------------------------------------------------------------------
/**
 *
 */
CommonManager.prototype.initialize = function() {
    log('[CommonManager]initialize');
    var th = this;

    th.showNowLoding();

    //wrapperのサイズ調整
    var wHeight = $(window).height();
    var headerHeight = $('#header').height();
    var footerHeight = $('#footer').height();
    $('#wrapper').css('min-height', (wHeight-headerHeight-footerHeight) + 'px');

    //menuリスト表示
    // th.procMenu();

    //page topのボタンの表示
    th.viewPageTopGo(wHeight);

    //mouse overの処理
    th.procMouseOver();

    //headerのscroll時の処理
    th.procScrollHeader();


    $(window).hashchange(function(){
        var hash = location.hash;
        var pDiv = hash.replace('#','');
        th.pageChange(pDiv);
    })
    $(window).hashchange();


    $(document).on("click",'[data-menu-btn]', function(){
        var pageDiv = $(this).attr('data-menu-btn');
        th.pageChange(pageDiv);
    });

    $(document).on("click",'[data-work-detail="1"]', function(elm){
        th.pageWorksDetail(this);
    });

    $(document).on(evtClickName,'#scrollpageTop', function(){
        th.procPageTopGo();
    });

    $(document).on(evtClickName,'[data-tab-works]', function(elm){
        th.procWorksTab(this);
    });
};

// 共通処理
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
// テンプレートの適用
//---------------------------------------------------------------------------------------
/**
 * @param {Object} dataTpl 必須 tplに表示させるdata
 * @param {string} tplSelector 必須 表示するtpl
 * @param {string} outputSelector 必須 output先
 */
CommonManager.prototype.outputTemplate = function(dataTpl,tplSelector,outputSelector) {
    log('[CommonManager]outputTemplate');
    // テンプレートを取得
    var template = $(tplSelector).text();
    // テンプレートを定義
    var compiled = _.template(template);
    // テンプレート適用
    $(outputSelector).html(compiled(dataTpl));
};

//---------------------------------------------------------------------------------------
// 初期メニュリスト表示
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.procMenu = function() {
    // log('[CommonManager]procMenu');
    // var fetchOb = {
    //     url:'Menu.php',
    //     data:'',
    // }
    // this.fetchAjax(fetchOb);
};
/**
 * @param {Object} data 必須 非同期で成功したdata
 */
CommonManager.prototype.doneMenu = function(data) {
    log('[CommonManager]doneMenu');
    this.outputTemplate(data,'#tplMenuList','#outputHeaderMenu');
    this.outputTemplate(data,'#tplMenuList','#outputFooterMenu');

    //menuの設定
    var visitPageDiv = sessionStorage.getItem("visitPageDiv");

    visitPageDiv = visitPageDiv?visitPageDiv:'top';

    // this.pageChange(visitPageDiv,workId);

    //menuのselectedを再設定
    visitPageDiv = (visitPageDiv == 'worksDetail')?'works':visitPageDiv;
    $('[data-menu-btn=' + visitPageDiv + ']').attr('data-menu-selected',1);
};
//---------------------------------------------------------------------------------------
// now loding
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.showNowLoding = function() {
    log('[CommonManager]showNowLoding');
    // $('#wrapper').html('<div id="nowLoading"><div>now loding...</div></div>');
    // $('#nowLoading').css('min-height',$('#wrapper').height());
};
/**
 */
CommonManager.prototype.hideNowLoding = function(data) {
    log('[CommonManager]hideNowLoding');
};

//---------------------------------------------------------------------------------------
// ページ切り替え
//---------------------------------------------------------------------------------------
/**
 * @param {string} pageDiv ページ名
 */
CommonManager.prototype.pageChange = function(pageDiv,wId) {
    log('[CommonManager]pageChange');
    var pDiv = pageDiv;
    var workId = sessionStorage.getItem("workId") || '';
    //リセット
    $('[data-menu-btn]').attr('data-menu-selected','');
    //SessionStorageのworkIdをクリア
    this.setSessionStorage('workId','');

    //処理の振り分け
    if(pDiv == 'about'){
        this.pageAbout();
    }else if (pDiv == 'works') {
            this.pageWorks();
    }else if (pDiv == 'worksDetail') {
        if (workId){
            this.pageWorksDetail('',workId);
        }else {
            this.pageWorks();
        }
    }else {
        pDiv = 'top';
        this.pageTop();
    }

    //ブラウザバック用にハッシュタグをセット:
    if (pDiv == 'top'){//TOP
        var hashString = location.hash.substr(1); // remove '#'
        history.replaceState('', document.title, window.location.pathname);
    }else {//TOP以外
        location.hash = pDiv;
    }


    //Todo page topの処理
    this.procPageTopGo();

    //SessionStorageに保存
    this.setSessionStorage('visitPageDiv',pDiv);

};

//---------------------------------------------------------------------------------------
// page topボタンの表示処理
//---------------------------------------------------------------------------------------
/**
 * @param {numbar} wHeight window size 高さ
 */
CommonManager.prototype.viewPageTopGo = function(wHeight) {
    log('[CommonManager]viewPageTopGo');
    var btnPageTop = $('#scrollpageTop');
    btnPageTop.hide();
    //◇ボタンの表示設定
    $(window).scroll(function(){
      if($(this).scrollTop() > wHeight/8){
        btnPageTop.fadeIn();
      }else{
        btnPageTop.fadeOut();
      }
    });
};
//---------------------------------------------------------------------------------------
// page topの動作処理
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.procPageTopGo = function() {
    log('[CommonManager]procPageTopGo');
    $('body,html').animate({
      scrollTop: 0},200);
      return false;
};

//---------------------------------------------------------------------------------------
// mouse overの処理
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.procMouseOver = function() {
    log('[CommonManager]procMouseOver');
    var btnEvents = {};
   // タッチしたとき
   btnEvents[evtMoveName] = function(){
       $(this).addClass('hover');

   };

   // 指離したとき
   btnEvents[evtOutName] = function(){
       var target = $(this);
       if (target.hasClass('hover')) {
           target.removeClass('hover');
       }
       else{
           target.addClass('hover');
       }
   };
    $(document).on(btnEvents,'a,input,select,label,[class^="btn_"],[data-mouse-over="1"]');
};

//---------------------------------------------------------------------------------------
// mouse overの処理
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.procScrollHeader = function() {
    log('[CommonManager]procScrollHeader');
    var scrollTimer = false;
    $(window).scroll(function(){
        var thisTop  = $(this).scrollTop();
        if(thisTop > 0){
            $('#header').addClass('sty_scroll01');
        }else {
            $('#header').removeClass('sty_scroll01');
        }

        //scrollが終わった時の処理
        if (scrollTimer !== false) {
             clearTimeout(scrollTimer);
         }
         scrollTimer = setTimeout(function() {
             $('#header').removeClass('sty_scroll01');
         }, 800);
    });
};

//---------------------------------------------------------------------------------------
// 非同期処理
//---------------------------------------------------------------------------------------
/**
 * @param {Object.<string|Object>} fetchOb 必須 ajaxに必要なdata
 * @param {number} doneDiv done区分
 * @param {Object} localOb done後に引き継ぐdata
 */
CommonManager.prototype.fetchAjax = function(fetchOb,doneDiv,localOb) {
    log('[CommonManager]fetchAjax');
    var th = this;
    log('通信準備');
    log(fetchOb);
    log(doneDiv);
    log(localOb);
    //fetchObをセットしてajaxを取得
    var jqXHR =  $.ajax(fetchOb['url'], {
        "type": "post",
        "dataType": "json",
        "data": fetchOb['data'],
        "timeout": fetchOb['timeout'] || 2000
    });

    //ajax成功
    jqXHR.done(function(data, textStatus, jqXHR){
        var ajaxFetchData = data;
        log(data);
        log('通信成功');
        // エラーならエラー文表示
        if (ajaxFetchData.success === 0) {
            // サーバー側からのエラーメッセージ
            ajaxFetchData['errorCode'] = {
                1: "",  // insertみすったぜぇ
                2: "", // updateミスったぜぇ
                3: "", // ほげ
                4: "" // ぴよ
            };
            // jqXHR.statusによるステータス確認（必要そうなら）
            return;
        }

        // Top
        if (doneDiv == 1){
            th.doneTop(data);
        // About
        }else if (doneDiv == 2){
            th.doneAbout(data);
        // Works
        }else if (doneDiv == 3){
            if (localOb != null){
                th.doneWorksDetail(data);
            }else {
                th.doneWorks(data);
            }
        }

        // menu
        th.doneMenu(data);

    });

    //ajax失敗
    jqXHR.fail(function(jqXHR, textStatus, errorThrown){
        log('通信成功');

     });
};

// ページ処理
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------
// TOP　doneDiv=1
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.pageTop = function() {
    log('[CommonManager]pageTop');
    this.showNowLoding();
    var fetchOb = {
        url:'Top.php',
        data:'',
    }
    this.fetchAjax(fetchOb,1);
};
/**
* @param {Object} data 必須 非同期で成功したdata
 */
CommonManager.prototype.doneTop = function(data) {
    log('[CommonManager]doneTop');
    this.outputTemplate('','#tplPageTop','#wrapper');
    this.outputTemplate(data,'#tplContentSkill','#outputContentSkill');
    this.outputTemplate(data,'#tplContentWorks','#outputContentWorks');
};

//---------------------------------------------------------------------------------------
// ABOUT　doneDiv=2
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.pageAbout = function() {
    log('[CommonManager]pageAbout');
    this.showNowLoding();
    var fetchOb = {
        url:'About.php',
        data:'',
    }
    this.fetchAjax(fetchOb,2);
};
/**
* @param {Object} data 必須 非同期で成功したdata
 */
CommonManager.prototype.doneAbout = function(data) {
    log('[CommonManager]doneAbout');
    this.outputTemplate('','#tplPageAbout','#wrapper');
    this.outputTemplate(data,'#tplContentIntroduction','#outputContentIntroduction');
    this.outputTemplate(data,'#tplContentSkill','#outputContentSkill');
    this.outputTemplate(data,'#tplContentCareer','#outputContentCareer');
};

//---------------------------------------------------------------------------------------
// WORKS　doneDiv=3
//---------------------------------------------------------------------------------------
/**
 */
CommonManager.prototype.pageWorks = function() {
    log('[CommonManager]pageWorks');
    this.showNowLoding();
    var fetchOb = {
        url:'Works.php',
        data:'',
    }
    this.fetchAjax(fetchOb,3);
};
/**
 * @param {Object} data 必須 非同期で成功したdata
 */
CommonManager.prototype.doneWorks = function(data) {
    log('[CommonManager]doneWorks');
    console.log(data);

    //全リストをdispWorksListに保存
    this.dispWorksList = data['worksList'];

    //tab情報更新
    this.tabWorkList = data['tabWorkList'];
    this.tabSecList = data['tabSecList'];
    this.tabDigitalList = data['tabDigitalList'];

    //tplの定義
    this.outputTemplate('','#tplPageWorks','#wrapper');

    //tplの定義
    this.viewWorksList();
};

/**
 * worksListの表示
 */
CommonManager.prototype.viewWorksList = function() {
    log('[CommonManager]viewWorksList');
console.log('aaaaaaaaaaa');
    var worksList = this.getDispWorksList();

    var dataWorks = {
        tabWorkList: this.tabWorkList,
        tabSecList: this.tabSecList,
        tabDigitalList: this.tabDigitalList,
        worksList: worksList
    };


    this.outputTemplate(dataWorks,'#tplContentWorks','#outputContentWorks');
};

//---------------------------------------------------------------------------------------
// WORKS 詳細　doneDiv=3
//---------------------------------------------------------------------------------------
/**
 * @param {Element} elm Element
 * @param {number} id work id
 */
CommonManager.prototype.pageWorksDetail = function(elm,id) {
    log('[CommonManager]pageWorksDetail');
    this.showNowLoding();

    //idのセット
    var workId;
    if (id != null){
        workId = id;
    }else {
        workId = $(elm).attr('data-work-id');
    }
    var fetchOb = {
        url:'WorksDetail.php',
        data: {
            workId: workId
        },
    };

    var localOb = {
        isDetail: 1
    };

    this.fetchAjax(fetchOb,3,localOb);
};
/**
* @param {Object} data 必須 非同期で成功したdata
 */
CommonManager.prototype.doneWorksDetail = function(data) {
    log('[CommonManager]doneWorksDetail');
    //SessionStorageに保存
    this.setSessionStorage('workId',data['workInfo']['WORK_ID']);
    this.setSessionStorage('visitPageDiv','worksDetail');
    location.hash = 'worksDetail';
    this.outputTemplate('','#tplPageWorks','#wrapper');
    this.outputTemplate(data,'#tplContentWorkDetail','#outputContentWorks');
};

//---------------------------------------------------------------------------------------
// WORKS tab
//---------------------------------------------------------------------------------------
/**
* @param {Element} elm Element
*/
CommonManager.prototype.procWorksTab = function(elm) {
    log('[CommonManager]procWorksTab');
    //SessionStorageに保存

    var elmSelected = $(elm).attr('data-tab-select');
    var elmTabDiv = $(elm).attr('data-tab-div');
    var elmTabWorksName = $(elm).attr('data-tab-works');
    // var currentElm =
console.log(elmSelected);
console.log(elmTabDiv);
console.log(elmTabWorksName);
console.log($('[data-tab-div=" + elmTabDiv + "][data-tab-works=" + elmTabWorksName + "]'));

    if(elmSelected == 1){
        $('[data-tab-div="' + elmTabDiv + '"][data-tab-works="' + elmTabWorksName + '"]').attr('data-tab-select',0);
    }else {
        $('[data-tab-div="' + elmTabDiv + '"][data-tab-works="' + elmTabWorksName + '"]').attr('data-tab-select',1);
    }


    var tabSelector = $('[data-tab-works]');
    var tabWorksList = [];
    for(var i = 0; i < tabSelector.length; i++){
        tabWorksList[i] = {
            divName: tabSelector.eq(i).attr('data-tab-works'),
            div: tabSelector.eq(i).attr('data-tab-div'),
            select: tabSelector.eq(i).attr('data-tab-select'),
        };
    }
    this.currentTabWorksList = tabWorksList
    // console.log(tabSelector);
    console.log(tabWorksList);

    this.viewWorksList();


    //tabの表示変更
    _.each(this.currentTabWorksList,function(tabList,tLKey){
        if ( tabList['select'] == 1 ){
            $('[data-tab-div="' + tabList['div'] + '"][data-tab-works="' + tabList['divName'] + '"]').attr('data-tab-select',1);
        }else {
            $('[data-tab-div="' + tabList['div'] + '"][data-tab-works="' + tabList['divName'] + '"]').attr('data-tab-select',0);
        }
    })


};

/**
 * @return 表示させるworksListを返す
 */
 CommonManager.prototype.getDispWorksList = function() {
     log('[CommonManager]doneWorks');
console.log('this.currentTabWorksList');
console.log(this.currentTabWorksList);
     //ToDo ソートさせる
     var returnWorksList;
     if (this.currentTabWorksList != null){
         var currentTabWorksList = this.currentTabWorksList;
        //  var sortWorksList = [];
        //  for(var i = 0; i < currentTabWorksList.length; i++){
        //
        //      _.each(this.dispWorksList,function(worksList,wLKey){
        //          if ( (worksList[currentTabWorksList[i]['divName']] == currentTabWorksList[i]['div']) && (currentTabWorksList[i]['select'] == 1) ){
        //              sortWorksList[wLKey] = worksList;
        //          }
        //
        //      })
        //
        //  }
        //
        // returnWorksList = [];
        // for (var wlValue in sortWorksList) {
        //     returnWorksList.push(sortWorksList[wlValue]);
        // }
        var returnWorksList = $.grep(this.dispWorksList, function(value, index){
            var sortWorksInfo = value;
            var divName = '';
            var disp = true;
            console.log(value);
            for(var i = 0; i < currentTabWorksList.length; i++){
                if ( (value[currentTabWorksList[i]['divName']] == currentTabWorksList[i]['div']) && (divName != currentTabWorksList[i]['divName']) && (disp == true) ){
                    divName = currentTabWorksList[i]['divName'];
                    if(currentTabWorksList[i]['select'] == 1){

                    }else {
                        disp = false;
                    }
                }

            }
            if(disp){
                return value;
            }

        });

     }else {
        returnWorksList = this.dispWorksList;
     }

console.log(returnWorksList);

     return returnWorksList;
 };

//---------------------------------------------------------------------------------------
// setSessionStorage
//---------------------------------------------------------------------------------------
/**
* @param {Object} key
* @param {Object} value
*/


 CommonManager.prototype.setSessionStorage = function(key, value) {
     log('[CommonManager]setSessionStorage');
     //SessionStorageに保存
     if (!window.sessionStorage) return;
     try {
       sessionStorage.setItem(key, value);
     } catch (err) {
       console.error(err);
     }
 };
