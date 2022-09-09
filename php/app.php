<?php

//Ajax通信ではなく、直接URLを叩かれた場合はエラーメッセージを表示
if (
    !(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    && (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))
    )
{
    die ('このページは直接ロードしないでください。');
}


require_once dirname(__FILE__) . "/Manager/ManagerCommon.php";


//JSON形式で出力する
header('Content-Type: application/json');
$comMng = new CommonManager();

$data = array();

// menuのデータ取得
// $data['menuList'] = $comMng->menu();

// menuのデータ取得
$sqlMenu = 'SELECT * ';
$sqlMenu .= 'FROM MENU_MST ';
$sqlMenu .= 'WHERE DEL_FLG != 1 ';
$data['menuList'] = $comMng->mysql($sqlMenu,true);

// topのデータ取得
$sqlTop = 'SELECT * ';
$sqlTop .= 'FROM TOP_MST ';
$sqlTop .= 'WHERE DEL_FLG != 1 ';

$topContent = $comMng->mysql($sqlTop,true);

foreach ($topContent as $key => &$value) {
    $value['DETAIL'] = array(
        'JP' => $value['DETAIL_JP'],
        'EN' => $value['DETAIL_EN'],
    );
    $value['TITLE'] = array(
        'JP' => $value['TITLE_JP'],
        'EN' => $value['TITLE_EN'],
    );
}

$data['topContent'] = $topContent;


// designのデータ取得
$sqlDesign = 'SELECT * ';
$sqlDesign .= 'FROM DESIGN_MST ';
$sqlDesign .= 'WHERE DEL_FLG != 1 ';

$resDesign = $comMng->mysql($sqlDesign,true);

$designContent = array();
foreach ($resDesign as $key => &$value) {
    $value['DETAIL'] = array(
        'JP' => $value['DETAIL_JP'],
        'EN' => $value['DETAIL_EN'],
    );
    $value['TITLE'] = array(
        'JP' => $value['TITLE_JP'],
        'EN' => $value['TITLE_EN'],
    );

    $groupId = $value['GROUP_ID'];
    if(!empty($designContent[$groupId])){
        $boxDiv = $value['DIV'];
        //listがない場合は、listを作成
        if(empty($designContent[$groupId]['LIST'])){
            $temporarilyValue = $designContent[$groupId];
            $designContent[$groupId] = array();
            $designContent[$groupId]['DIV'] = $boxDiv;
            $designContent[$groupId]['LIST'][] = $temporarilyValue;
            $designContent[$groupId]['LIST'][] = $value;

        }else {
            $designContent[$groupId]['LIST'][] = $value;
        }

    }else {
        $designContent[$groupId] = $value;
    }

}

$data['designContent'] = $designContent;

// lineupのデータ取得
$sqlLineup = 'SELECT * ';
$sqlLineup .= 'FROM LINEUP_MST ';
$sqlLineup .= 'WHERE DEL_FLG != 1 ';
$sqlLineup .= 'ORDER BY BOX_ID';

$resLineup = $comMng->mysql($sqlLineup,true);

$lineupContent = array();
foreach ($resLineup as $key => &$value) {

    $groupId = $value['GROUP_ID'];
    $boxDiv = $value['DIV'];

    if($boxDiv == 'h1'){
        $value['TITLE'] = array(
            'JP' => $value['TITLE_JP'],
            'EN' => $value['TITLE_EN'],
        );
        $lineupContent[$groupId] = $value;
    }elseif ($boxDiv == 'figure') {
        $lineupContent[$groupId]['FILE_PATH'] = $value['FILE_PATH'];
    }elseif ($boxDiv == 'h2') {
        $lineupContent[$groupId]['TITLE'] = array(
            'JP' => $value['TITLE_JP'],
            'EN' => $value['TITLE_EN'],
        );
    }elseif ($boxDiv == 'h3') {
        $lineupContent[$groupId]['PRICE'] = array(
            'JP' => $value['TITLE_JP'],
            'EN' => $value['TITLE_EN'],
        );
    }elseif ($boxDiv == 'li') {
        $value['DETAIL'] = array(
            'JP' => $value['DETAIL_JP'],
            'EN' => $value['DETAIL_EN'],
        );
        $lineupContent[$groupId]['LIST'][] = $value;
    }

}

$data['lineupContent'] = array_values($lineupContent);


// bodyColorのデータ取得
$sqlBodyColor = 'SELECT * ';
$sqlBodyColor .= 'FROM BODY_COLOR_MST ';
$sqlBodyColor .= 'WHERE DEL_FLG != 1 ';
$sqlBodyColor .= 'ORDER BY BOX_ID';

$resBodyColor = $comMng->mysql($sqlBodyColor,true);

$bodyColorContent = array();
foreach ($resBodyColor as $key => &$value) {
    $value['DETAIL'] = array(
        'JP' => $value['DETAIL_JP'],
        'EN' => $value['DETAIL_EN'],
    );
    $value['TITLE'] = array(
        'JP' => $value['TITLE_JP'],
        'EN' => $value['TITLE_EN'],
    );

    $groupId = $value['GROUP_ID'];

    if(!empty($bodyColorContent[$groupId])){
        $boxDiv = $value['DIV'];
        //listがない場合は、listを作成
        if(empty($bodyColorContent[$groupId]['LIST'])){
            $temporarilyValue = $bodyColorContent[$groupId];
            $bodyColorContent[$groupId] = array();
            $bodyColorContent[$groupId]['DIV'] = $boxDiv;
            $bodyColorContent[$groupId]['LIST'][] = $temporarilyValue;
            $bodyColorContent[$groupId]['LIST'][] = $value;

        }else {
            $bodyColorContent[$groupId]['LIST'][] = $value;
        }

    }else {
        $bodyColorContent[$groupId] = $value;
    }

}

$data['bodyColorContent'] = array_values($bodyColorContent);


// performanceのデータ取得
$sqlPerformance = 'SELECT * ';
$sqlPerformance .= 'FROM PERFORMANCE_MST ';
$sqlPerformance .= 'WHERE DEL_FLG != 1 ';
$sqlPerformance .= 'ORDER BY BOX_ID';

$resPerformance = $comMng->mysql($sqlPerformance,true);

$performanceContent = array();
foreach ($resPerformance as $key => &$value) {
    $value['DETAIL'] = array(
        'JP' => $value['DETAIL_JP'],
        'EN' => $value['DETAIL_EN'],
    );
    $value['TITLE'] = array(
        'JP' => $value['TITLE_JP'],
        'EN' => $value['TITLE_EN'],
    );

    $groupId = $value['GROUP_ID'];
    $boxDiv = $value['DIV'];

    if($boxDiv == 'h1'){
        $performanceContent[$groupId] = $value;
    }elseif ($boxDiv == 'h2') {
            $performanceContent[$groupId]['LIST_TITLE'] = $value['TITLE'];
    }elseif ($boxDiv == 'figure') {
        $performanceContent[$groupId]['FILE_PATH'] = $value['FILE_PATH'];
        $performanceContent[$groupId]['TITLE'] = $value['TITLE'];
    }elseif ($boxDiv == 'output') {
        $performanceContent[$groupId]['OUTPUT_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['OUTPUT_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'acceleration') {
        $performanceContent[$groupId]['ACCELERATION_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['ACCELERATION_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'system') {
        $performanceContent[$groupId]['SYSTEM_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['SYSTEM_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'totalHeight') {
        $performanceContent[$groupId]['TOTAL_HEIGHT_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['TOTAL_HEIGHT_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'wheelbase') {
        $performanceContent[$groupId]['WHEELBASE_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['WHEELBASE_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'fullLength') {
        $performanceContent[$groupId]['FULL_LENGTH_TITLE'] = $value['TITLE'];
        $performanceContent[$groupId]['FULL_LENGTH_DETAIL'] = $value['DETAIL'];
    }elseif ($boxDiv == 'li') {
        $performanceContent[$groupId]['LIST'][] = $value;
    }


}

$data['performanceContent'] = array_values($performanceContent);


// topのデータ取得
$sqlLanguage = 'SELECT * ';
$sqlLanguage .= 'FROM LANGUAGE_MST ';
$sqlLanguage .= 'WHERE DEL_FLG != 1 ';

$data['languageList'] = $comMng->mysql($sqlLanguage,true);



header('Content-Type: application/json');
echo json_encode( $data );
exit;
?>
