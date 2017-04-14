<?php

//PHP整站防注入程序，需要在公共文件中require_once本文件
//摘自  http://www.jb51.net/article/30079.htm
//判断magic_quotes_gpc状态
if (@get_magic_quotes_gpc ()) {
    $_GET = sec ( $_GET );
    $_POST = sec ( $_POST );
    $_COOKIE = sec ( $_COOKIE );
    $_FILES = sec ( $_FILES );
}
$_SERVER = sec ( $_SERVER );

function safe_check($str){
    $str =trim($str);
    $str =strip_tags($str);
    $str = search_check(str_check($str));
    $str = preg_replace("/\r\n/", "", $str);
    $str = str_replace("<", "", $str);
    $str = str_replace(">", "", $str);
    return $str;
    
}

function sec(&$array) {
    //如果是数组，遍历数组，递归调用
    if (is_array ( $array )) {
        foreach ( $array as $k => $v ) {
            $array [$k] = sec ( $v );
        }
    } else if (is_string ( $array )) {
        //使用addslashes函数来处理
        $array = addslashes ( $array );
    } else if (is_numeric ( $array )) {
        $array = intval ( $array );
    }
    return $array;
}
//整型过滤函数
function num_check($id) {
    if (! $id) {
        die ( '参数不能为空！' );
    } //是否为空的判断
    else if (inject_check ( $id )) {
        echo "非法参数";
        //die ( '非法参数' );
    } //注入判断
    else if (! is_numeric( $id )) {
        echo "非法参数";
        die ( '非法参数' );
    }
    //数字判断
    $id = intval ( $id );
    //整型化
    return $id;
}
//字符过滤函数
function str_check($str) {
    if (inject_check ( $str )) {
        echo "非法参数";
        die ( '非法参数' );
    }
    //注入判断
    $str = htmlspecialchars ( $str );
    //转换html
    return $str;
}
function search_check($str) {
    $str = str_replace ( "_", "\_", $str );
    //把"_"过滤掉
    $str = str_replace ( "%", "\%", $str );
    //把"%"过滤掉
    $str = htmlspecialchars ( $str );
    //转换html
    return $str;
}
//表单过滤函数
function post_check($str, $min, $max) {
    if (isset ( $min ) && mb_strlen ( $str ) < $min) {
        die ( "最少$min 字节" );
    } else if (isset ( $max ) && mb_strlen ( $str ) > $max) {
        die ( "最多$max 字节" );
    }
    return stripslashes_array ( $str );
}
//防注入函数
function inject_check($sql_str) {
    return preg_match( '/select|inert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|UNION|into|load_file|outfile/', $sql_str );
    // 进行过滤，防注入
}
function stripslashes_array(&$array) {
    if (is_array ( $array )) {
        foreach ( $array as $k => $v ) {
            $array [$k] = stripslashes_array ( $v );
        }
    } else if (is_string ( $array )) {
        $array = stripslashes ( $array );
    }
    return $array;
}
?>