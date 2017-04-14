<?php
require_once 'medoo.php';
date_default_timezone_set("Asia/Shanghai");
/**
 * Created by PhpStorm.
 * User: haier
 * Date: 2017-4-12
 * Time: 13:39
 */
$database = new medoo(array(
    'database_name' => 'lizhi'
));
$table = "club_user";

//get_five_icon();

//公众号端
Class App
{
    private $appid = " ";
    private $appsecret = " ";
    private $access_token = " ";

    /**
     * @return string
     */
    public function getAppArray()
    {
        $app_ar = array($this->appid, $this->appsecret, $this->access_token);
        return $app_ar;
    }
}

//从数据库拿到五个用户头像
function get_five_user_icon()
{
    global $database;
    global $table;
    $icons = $database->select($table, [
        "headimgurl"
    ], [

        "visible" => 1,
        "ORDER" => [
            "time" => "DESC"
        ]
    ]);
    $icon5Array = array_slice($icons, 0, 5);
    foreach ($icon5Array as $ic){
        $icon5[]=$ic['headimgurl'];
    }
    return $icon5;
    //print_r($icon5);
}

function get_icon_by_schname($schname)
{
    switch ($schname) {
        case "南方科技大学":
            return "./images/uni_icon.jpg";
            break;
        case "深圳大学":
            return "./images/uni_icon.jpg";
            break;
        case "深职院":
            return "./images/uni_icon.jpg";
            break;
        case "港中大(深圳)":
            return "./images/uni_icon.jpg";
            break;
        case "深信院":
            return "./images/uni_icon.jpg";
            break;
    }
}

function followFlag($openid,$access_token){
    $subscribe_msg = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=$access_token&openid=$openid";
    $subscribe = json_decode(file_get_contents($subscribe_msg));
    $followFlag = $subscribe->subscribe;
//
    if($gzxx === 1){
        echo "已关注";
    }else{
        echo "未关注";

    }
}


//用code--获取Access Token和openid--获取用户信息
function getUserInfo($code)
{
    //安全考虑 将变量隐藏
    $app = new APP();
    $app_ar =$app->getAppArray();
    $appid =$app_ar[0] ;
    $appsecret = $app_ar[1];
    $access_token = $app_ar[2];

    //根据code获得Access Token 和openid
    $access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$appsecret&code=$code&grant_type=authorization_code";
    $access_token_json = https_request($access_token_url);
    $access_token_array = json_decode($access_token_json, true);
    $access_token = $access_token_array['access_token'];
    $openid = $access_token_array['openid'];
    //根据Access Token和OpenID获得用户信息
    $userinfo_url = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid ";
    $userinfo_json = https_request($userinfo_url);
    $userinfo_array = json_decode($userinfo_json, true);
    return $userinfo_array;
}

//url连接获取json数据包
function https_request($url)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);
    if (curl_errno($curl)) {
        return 'ERROR ' . curl_error($curl);
    }
    curl_close($curl);
    return $data;
}


//拿到openid
//判断是否关注 否 则跳二维码链接
//是 则已关注 检查库里是否存在
//否 则拉取用户信息 入库
//检查是否可投票 否 返回
//是 更新数据 返回
