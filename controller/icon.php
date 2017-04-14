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


//从数据库拿到五个用户头像
function get_five_user_icon()
{
    global $database;
    global $table;
    $icons = $database->select($table, [
        "id",
        "openid",
        "headimgurl"
    ], [

        "visible" => 1,
        "ORDER" => [
            "time"=>"DESC"
        ]
    ]);
    $icon5=array_slice($icons,0,5);
    return $icon5;
    //print_r($icon5);
}

function get_icon_by_schname($schname){
    switch ($schname){
        case "南方科技大学":
            return "/images/finger.png";
            break;
        case "深圳大学":
            return "/images/finger.png";
            break;
        case "深职院":
            return "/images/finger.png";
            break;
        case "港中大(深圳)":
            return "/images/finger.png";
            break;
    }
}

//拿到openid
//判断是否关注 否 则跳二维码链接
            //是 则已关注 检查库里是否存在
//否 则拉取用户信息 入库
//检查是否可投票 否 返回
//是 更新数据 返回
