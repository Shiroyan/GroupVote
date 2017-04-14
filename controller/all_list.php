<?php
require_once 'medoo.php';
require_once 'Club.php';
date_default_timezone_set("Asia/Shanghai");

function get_clubs()
{
    $database = new medoo(array(
        'database_name' => 'lizhi'
    ));
    $table = "club";
    
    // 根据降序拿到数据存入club对象里 得到数组clubs
    $clubs = $database->select($table, [
        "id",
        "school_name",
        "club_name",
        "fav_num",
        "club_pic"
    ], [
        "AND" => [
            "visible" => 1
        ],
        "ORDER" => [
            "fav_num" => "DESC"
        ]
    ]);
    return $clubs;
}

function id_allrank($id)
{
    $clubs=get_clubs();
    // 记录各id社团的排名
    for ($i = 0; $i < sizeof($clubs); $i ++) {
        if ($id == $clubs[$i]['id']) {
            $rank = $i + 1;
            return $rank;
        }
    }
}

//print_r($id_allrank);
//print_r($clubs);
