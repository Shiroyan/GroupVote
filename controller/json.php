<?php
require_once "all_list.php";
require_once "sch_list.php";
require "search.php";
require_once "safe.php";
require_once "icon.php";
date_default_timezone_set("Asia/Shanghai");

/**
 * Created by PhpStorm.
 * User: haier
 * Date: 2017-4-7
 * Time: 15:16
 */
Class Object
{
    public $head;
    public $data;
    public $uni_rank;
    public $all_rank;
    public $icon5;

    public function __construct($head, $data)
    {
        $this->head = $head;
        $this->data = $data;
    }

    public function intro_Object($head, $data, $uni_rank, $all_rank, $icon5)
    {
        $this->head = $head;
        $this->data = $data;
        $this->uni_rank = $uni_rank;
        $this->all_rank = $all_rank;
        $this->icon5 = $icon5;
    }
}

Class Head
{
    public $status;
    public $extraInfo;

    public function __construct($status, $extraInfo)
    {
        $this->status = $status;
        $this->extraInfo = $extraInfo;
//        echo  $this->$status;
//        echo  $this->$extraInfo;
    }
}

Class uniObject_1
{
    public $uni_name;
    public $clubObjectArray;

    function __construct($uni_name, $clubObjectArray)
    {
        $this->uni_name = $uni_name;
        $this->clubObjectArray = $clubObjectArray;
    }
}

Class ClubObject
{
    public $club_id;
    //社团id，编号
    public $club_pic;
    //图片的url（images/xxxx.jpg）
    public $club_from;
    //归属哪个学校
    public $uni_icon;
    //校徽图片的url（images/xxxx.jpg）
    public $club_name;
    //社团名字
    public $club_fav_count;
    //点赞次数
    public $club_detail;

    //社团详细信息

    public function __construct($id, $pic, $from, $icon, $name, $fav, $detail)
    {
        $this->club_id = $id;
        $this->club_pic = $pic;
        $this->club_from = $from;
        $this->uni_icon = $icon;
        $this->club_name = $name;
        $this->club_fav_count = $fav;
        $this->club_detail = $detail;

    }
}

$type = $_GET['type'];
//$type = "loadmore";
switch ($type) {
    case "search":
        $content = $_GET['content'];
        search_club($content);
        break;
    case "init": //主会场乱序取10个对象数组
        load();
        break;
    case "loadmore": //获取id数组 主会场动态加载多10个
        $ids = $_GET['ids'];
        loadmore($ids);
        break;
    case "uni_rank" :
        uni_rank();//校榜加载
        break;
    case "all_rank" ://全榜加载
        all_rank();
        break;
    case "intro": //进入introduction页面
        $id = $_GET['id'];
        intro($id);
    case "like": //点赞
        $code = $_GET['code'];
        like($code);
}

function uni_rank()
{
    $rank = get_rank(); // 在sch_list.php里
    //print_r($rank);
    $sch_lists = sch_lists_out($rank);
    //print_r($sch_lists);
    for ($i = 0; $i < sizeof($sch_lists); $i++) {
        $sch_name = $rank[$i][0];
        //得到该学校
        $clubs = get_clubs_by_name($sch_name);
        if ($clubs != null) {
            $num_onlist = 5;
            // 不足5个 改展示数量
            if (sizeof($clubs) > 0 && sizeof($clubs) < $num_onlist) {
                $num_onlist = sizeof($clubs);
            }
            for ($top = 0; $top < $num_onlist; $top++) {
                $id = $clubs[$top]['id'];
                $club_pic = $clubs[$top]['club_pic'];
                $club_name = $clubs[$top]['club_name'];
                $fav = $clubs[$top]['fav_num'];
                $uni_icon = get_icon_by_schname($sch_name);
                $clubObject = new ClubObject($id, $club_pic, $sch_name, $uni_icon, $club_name, $fav, null);
                $clubObjects[] = $clubObject;
            }
            $uniObject_1 = new uniObject_1($sch_name, $clubObjects);
            $uniObjects[] = $uniObject_1;
        }
    }//校名循环结束
    $status = "success";
    $extraInfo = null;
    $head = new Head($status, $extraInfo);
    $data = $uniObjects;
    $object = new Object($head, $data);
    echo json_encode($object);

}

function all_rank()
{
    $clubs = get_clubs();
    // print_r($clubs);
    foreach ($clubs as $c) {
        // 确定内容
        $id = $c['id'];
        $club_pic = $c['club_pic'];
        $school_name = $c['school_name'];
        $club_name = $c['club_name'];
        $fav_num = $c['fav_num'];
        $uni_icon = get_icon_by_schname($school_name);
        $clubObject = new ClubObject($id, $club_pic, $school_name, $uni_icon, $club_name, $fav_num, null);
        $clubObjects[] = $clubObject;
    }
    $status = "success";
    $extraInfo = null;
    $head = new Head($status, $extraInfo);
    $data = $clubObjects;
    $object = new Object($head, $data);
    echo json_encode($object);
}

function intro($id)
{
    /*
     * Object = {
			   head: headObject,
                data: clubObject,
                uni_rank: int
                all_rank: int
                icon5:  iconArray
	clubObject成员:
		  club_id: 社团id，编号
		  club_pic: 图片的url（images/xxxx.jpg）
		  club_from: 归属哪个学校
          uni_icon： 为校徽图片的url
		  club_name: 社团名字
		  club_fav_count: 点赞次数
		  club_detail : 社团介绍

     */
    $id = safe_check($id);
    if ($id == null) {
        echo '<script language="JavaScript">;alert("社团编号错误 无法进入哦~");location.href="/ClubVote/main.html";</script>';
    } else {
        //id有效 获取clubObject
        $club = get_club_by_id($id);

        $club_pic = $club[0]['club_pic'];
        $sch_name = $club[0]['school_name'];
        $uni_icon = get_icon_by_schname($sch_name);
        $club_name = $club[0]['club_name'];
        $club_fav_count = $club[0]['fav_num'];
        $club_detail = $club[0]['info'];

        $clubObject = new ClubObject($id, $club_pic, $sch_name, $uni_icon, $club_name, $club_fav_count, $club_detail);
        //获取排名int
        $uni_rank = id_schrank($id);
        $all_rank = id_allrank($id);
        $icon5 = get_five_user_icon();

        //存入object
        $status = "success";
        $extraInfo = null;
        $head = new Head($status, $extraInfo);
        $data = $clubObject;
        $intro_object = new Object(null, null);
        $intro_object->intro_Object($head, $data, $uni_rank, $all_rank, $icon5);
        echo json_encode($intro_object);

    }
}

function load()
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    // 查数据
    $msgs = $database->select($table, [
        "id",
        "school_name",
        "club_name",
        "club_pic",
        "fav_num",
        "info"
    ], [
        "visible" => 1
    ]);
    shuffle($msgs);
    //print_r($msgs);
    //取前10个
    $limit_clubshow = 10;
    for ($club_show = 0; $club_show < $limit_clubshow; $club_show++) {
        $id = $msgs[$club_show]['id'];
        $club_pic = $msgs[$club_show]['club_pic'];
        $sch_name = $msgs[$club_show]['school_name'];
        $uni_icon = get_icon_by_schname($sch_name);
        $club_name = $msgs[$club_show]['club_name'];
        $fav = $msgs[$club_show]['fav_num'];
        $info = $msgs[$club_show]['info'];
        $club = new ClubObject($id, $club_pic, $sch_name, $uni_icon, $club_name, $fav, $info);
        $clubs[] = $club;
    }
    //存入object
    $status = "success";
    $extraInfo = null;
    $head = new Head($status, $extraInfo);
    $data = $clubs;
    $object = new Object($head, $data);
    echo json_encode($object);
}

//基本与load函数相同 但加多一个筛别
function loadmore($ids)
{
    if ($ids == null) {
        load();
    } else {
        //ids数组要确认对方发来的形式
                $database = new medoo(array(
            'database_name' => 'lizhi'
        ));
        $table = "club";
        // 查数据
        $msgs = $database->select($table, [
            "id",
            "school_name",
            "club_name",
            "club_pic",
            "fav_num",
            "info"
        ], [
            "visible" => 1
        ]);
        shuffle($msgs);
        //取筛除后的10个
        $limit_clubshow = 10;
        for ($club_show = 0; $club_show < $limit_clubshow; $club_show++) {
            $id = $msgs[$club_show]['id'];
            if (in_array($id, $ids)) {
                continue;
            } else {
                $club_pic = $msgs[$club_show]['club_pic'];
                $sch_name = $msgs[$club_show]['school_name'];
                $uni_icon = get_icon_by_schname($sch_name);
                $club_name = $msgs[$club_show]['club_name'];
                $fav = $msgs[$club_show]['fav_num'];
                $info = $msgs[$club_show]['info'];
                $club = new ClubObject($id, $club_pic, $sch_name, $uni_icon, $club_name, $fav, $info);
                $clubs[] = $club;
            }
        }

        //存入object
        $status = "success";
        $extraInfo = null;
        $head = new Head($status, $extraInfo);
        $data = $clubs;
        $object = new Object($head, $data);
        echo json_encode($object);

    }
}

function like(){
    //在icon.phpl里写
}

//辅功能
function get_club_by_id($id)
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    if ($id == null) {
        echo '<script language="JavaScript">;alert("id错误");location.href="/ClubVote/main.html";</script>';
    } else {
        $club = $database->select($table, [
            "id",
            "club_pic",
            "school_name",
            "club_name",
            "fav_num",
            "info"
        ], [
            "AND" => [
                "visible" => 1,
                "id" => $id
            ]
        ]);

        //必然只会取到一个club
        if (sizeof($club) == 1) {
            //print_r($club);
            return $club;
        }
    }

}