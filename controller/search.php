<?php
require_once "medoo.php";
require_once "safe.php";
date_default_timezone_set("Asia/Shanghai");


function search_club($strSh)
{
    // 安全监测
    $strSh = safe_check($strSh);

    if ($strSh == null) {
        echo '<script language="JavaScript">;alert("请输入内容再搜索哦~");location.href="../index.html";</script>';
    } else {
        //echo $strSh . '</br>';
        $database = new medoo(array(
            'database_name' => 'lizhi'
        ));
        $table = "club";

        if (!$strSh == "") {
            // 用数据库查询 模糊
            $msgs = $database->select($table, [
                "id",
                "school_name",
                "club_name",
                "fav_num",
                "info",
                "club_pic"
            ], [
                "AND" => [
                    "visible" => 1,
                    "OR" => [
                        "id[~]" => "%$strSh%",
                        "school_name[~]" => "%$strSh%",
                        "club_name[~]" => "%$strSh%",
                        "info[~]" => "%$strSh%"
                    ]
                ]
            ]);
            // print_r($msgs);
            // 根据返回的结果集里的id 展示结果（复制代码）
            if (empty($msgs)) {
                //确定json
                $status = "fail";
                $extraInfo = '<p>&nbsp;&nbsp;&nbsp;好像..没有找到..你想要的东西哦...[委屈]</p>
     
<p>温馨提示：</br>可以检查一下输入是否正确</br>
如有任何意见或建议，可以及时反馈西西或知知，</br>我们会努力做得更好。</br>
</br>微信号：</br> &nbsp;&nbsp;西西: niceszu </br>&nbsp;&nbsp;知知: meetszu </p>';
                $head = new Head($status, $extraInfo);
                $object = new Object($head, null);
                echo json_encode($object);

            } else {
                //确定头部
                $status = "success";
                $extraInfo = null;
                $head = new Head($status, $extraInfo);
                foreach ($msgs as $m) {
                    // 确定内容
                    $id = $m['id'];
                    $club_pic = $m['club_pic'];
                    $school_name = $m['school_name'];
                    $club_name = $m['club_name'];
                    $fav_num = $m['fav_num'];
                    $clubObject = new ClubObject($id, $club_pic, $school_name, null, $club_name, $fav_num, null);
                    // $clubObject是在json.php里运行的 类在这里面
                    $clubObjects[] = $clubObject;
                }
                //确定json
                $object = new Object($head, $clubObjects);
                echo json_encode($object);


           }
        }
    }
}

?>
