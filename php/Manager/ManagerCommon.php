<?php

//Ajax通信ではなく、直接URLを叩かれた場合はエラーメッセージを表示
if (
    !(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    && (!empty($_SERVER['SCRIPT_FILENAME']) && 'json.php' === basename($_SERVER['SCRIPT_FILENAME']))
    )
{
    die ('このページは直接ロードしないでください。');
}

class CommonManager
{

    //接続文字列 (PHP5.3.6から文字コードが指定できるようになりました)
    private  $dsn = 'mysql:dbname=dummy_car;host=localhost;charset=utf8';

    //ユーザ名
    private  $user = 'carMyGuide';

    //パスワード
    private  $password = 'pu23hBWZuoTlDBYW';

    public function mysql($sql,$isArray = null)
    {
        try
        {

            //nullで初期化
            $res = null;

            //DBに接続
            $dbh = new PDO($this->dsn, $this->user, $this->password);

            //'users' テーブルのデータを取得する
            if(empty($sql)){
                return fales;
            }
            $stmt = $dbh->query($sql);

            //取得したデータを配列に格納
            while ($row = $stmt->fetchObject())
            {
                $res[] = (array) $row;
            }

            //一件だったら配列にしない
            if( ($isArray == null ) && (count($res) == 1) ){
                $res = $res[0];
            }

            return $res;
        }
        catch (PDOException $e)
        {
            //例外処理
            die('Error:' . $e->getMessage());

            return fales;
        }


    }

}
// print('aaaaaaaa');
// $fetchManager = new FetchManager();
//
// $data = $fetchManager->mysql('USER_MST');


?>
