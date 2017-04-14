<?php
require_once "medoo.php";
require_once "safe.php";
date_default_timezone_set("Asia/Shanghai");


function search_club($strSh)
{
    // 安全监测
    $strSh = safe_check($strSh);

    if ($strSh == null) {
        echo '<script language="JavaScript">;alert("请输入内容再搜索哦~");location.href="/ClubVote/main.html";</script>';
    } else {

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
                        "id[~]"=>"%$strSh%",
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
                $extraInfo = "......";
                $head = new Head($status,$extraInfo);
                $object=new Object($head,null);
                echo   json_encode($object);
//                echo "<p>&nbsp;&nbsp;&nbsp;好像..没有找到..你想要的社团哦...[委屈]</p>
//
//                      <p style=' display: block;
//	-webkit-margin-before: 1em;
//	-webkit-margin-after: 0.0em;
//	-webkit-margin-start: 8px;
//	-webkit-margin-end: 0px;
//	color: #808080;
//	height: 0.8rem;
//	font-size: 0.8rem;
//	width: 100%;'>温馨提示：</br>可以检查一下输入是否正确</br>
//                      如有任何意见或建议，可以及时反馈荔荔或者知知，</br>我们会努力做得更好。</br>
//                      </br>微信号：</br> 荔荔: helloszu </br>知知: meetszu </p>";
            }
            else {
                //确定头部
                $status = "success";
                $extraInfo = null;
                $head = new Head($status,$extraInfo);
                foreach ($msgs as $m) {
                    // 确定内容
                    $id = $m['id'];
                    $club_pic=$m['club_pic'];
                    $school_name = $m['school_name'];
                    $club_name = $m['club_name'];
                    $fav_num = $m['fav_num'];
                    $clubObject = new ClubObject($id, $club_pic, $school_name,null,$club_name,$fav_num,null);
                    // $clubObject是在json.php里运行的 类在这里面
                    $clubObjects[]=$clubObject;
                    //确定json
                    $object = new Object($head,$clubObjects);
                    echo   json_encode($object);
//                    print <<<Msg
//
//                    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">
//                        <!-- 社团展示 -->
//                          <div class="group">
//                                <div class="group-picture">
//                                    <img src="images/group_pic.png" alt="社团图片">
//                                </div>
//
//                                <div class="group-header">
//                                    <p class="order">$str_id</p>
//                                </div>
//
//                                <div class="group-mask">
//                                    <img src="images/white-heart.png">
//                                    <p class="fav-count">$fav_num</p>
//                                </div>
//
//                                <div class="group-footer">
//                                    <p class="text-center name">$club_name</p>
//                                </div>
//                         </div>
//                   </div>
//
//Msg;
               }
              /*  print <<<Msg

                <script> $('.search-content .group').on('clikc',groupHandler)</script>

Msg;*/
           }
        }
    }
}

?>
