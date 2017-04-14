<?php
require_once "medoo.php";
require_once 'Club.php';

date_default_timezone_set("Asia/Shanghai");
$database = new medoo(array(
    'database_name' => 'lizhi'
));
$table = "club";

//得到最高票数排好的各个学校数组（不含club）
function get_rank()
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    $sch_names = get_all_school_name();
    //print_r($sch_names);
    // 根据校名取的top5给rank
    foreach ($sch_names as $n) {
        $c = get_clubs_by_name((string)$n);
        $top = count_top5_inschool($c);
        $rank[] = rank_sch($n, $top);
    }
    // 根据top票数由大到小排序
    $rank = sch_sort($rank);
    //print_r($rank);
    return $rank;
}

function sch_lists_out($rank)
{
    // 排好序之后重新取top5
    foreach ($rank as $n) {
        // print_r($n);
        $name = $n[0];
        $c = get_clubs_by_name($n);
        $top5 = count_top5_inschool($c);

        $sch_lists[] = array(
            $name => $top5
        );
    }
    //print_r($sch_lists);
    return $sch_lists;
}

// 根据fav做出学校数组用于下一步排序
function rank_sch($sch_name, $top)
{
    $fav = $top['fav'];
    $ar[0] = $sch_name;
    $ar[1] = $fav;
    return $ar;
}

// 冒泡法对学校top数组 排序 ar[0]是名字 ar[1]是数值
function sch_sort($ar)
{
    for ($i = 0; $i < count($ar); $i++) { // 从数组末尾取一个值；
        for ($k = count($ar) - 2; $k >= $i; $k--) { // 将这个值向前冒泡；
            if ($ar[$k + 1][1] > $ar[$k][1]) { // 大于号降序排列；
                $tmp = $ar[$k + 1];
                $ar[$k + 1] = $ar[$k];
                $ar[$k] = $tmp;
            }
        }
    }
    return $ar;
}

// 返回一个含所有学校名字的数组
function get_all_school_name()
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    $sch_names = $database->select($table, "school_name", [
        "visible" => 1,
        "GROUP" => "school_name"
    ]);
    //print_r($sch_names);
    return $sch_names;
}

// 返回5个或以下Club对象组成的数组
function get_clubs_by_name($sch_name)
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    // 降序获得 数据 取前5个
    $clubs = $database->select($table, [
        "id",
        "club_name",
        "fav_num",
        "club_pic"
    ], [
        "AND" => [
            "visible" => 1,
            "school_name" => $sch_name
        ],
        "ORDER" => [
            "fav_num" => "DESC"
        ]
    ]);
    //print_r($clubs);
    if ($clubs == null) {
        echo "以社团名获取社团数据为空";
    } else {
        return $clubs;
    }

}

function count_top5_inschool($clubs)
{
    $num_onlist = 5;

    // 不足5个 改展示数量
    if (sizeof($clubs) > 0 && sizeof($clubs) < $num_onlist) {
        $num_onlist = sizeof($clubs);
    }


    // 获取前5社团与最高计票数
    $fav_max = 0;
    for ($top = 0; $top < $num_onlist; $top++) {
        $id = $clubs[$top]['id'];
        $club_name = $clubs[$top]['club_name'];
        $fav_num = $clubs[$top]['fav_num'];
        $club_pic = $clubs[$top]['club_pic'];
        $topclubs[$top] = new Club($id, $club_name, $fav_num, $club_pic);

        $fav_max = ($fav_max > $fav_num) ? $fav_max : $fav_num;
    }
    $topclubs['fav'] = $fav_max;
    // print_r($topclubs);
    return $topclubs;
}

//由id查出校榜排名
function id_schrank($id)
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    // 获取id所属的学校


    if ($id == null) {
        echo "id为空";
    } else {
        $sch_name = $database->select($table, [
            "school_name"
        ], [
            "AND" => [
                "id" => $id,
                "visible" => 1
            ]
        ]);
        if ($sch_name == null) {
            echo "无法获取校名";
        } else {
            $sch_name = $sch_name[0]['school_name'];

            // 降序获得 数据
            $clubs = $database->select($table, [
                "id",
                "club_name",
                "fav_num"
            ], [
                "AND" => [
                    "visible" => 1,
                    "school_name" => $sch_name,
                ],
                "ORDER" => ["fav_num" => "DESC"]


            ]);
            //print_r($clubs);
            if ($clubs == null) {
                echo "校名获取社团组数据为空";
            }

            // 获取排名
            for ($i = 0; $i < sizeof($clubs); $i++) {
                if ($id == $clubs[$i]['id']) {
                    $rank = $i + 1;
                }
            }
            return $rank;
        }
    }
}


?>

