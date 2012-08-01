<?php
require 'connect/lib/db.php';
require 'connect/lib/facebook.php';
require 'connect/lib/fbconfig.php';
session_start();
$facebook=$_SESSION['facebook'];
$userdata=$_SESSION['userdata'];
$logoutUrl=$_SESSION['logout'];

//Facebook Access Token
$access_token_title='fb_'.$facebook_appid.'_access_token';
$access_token=$facebook[$access_token_title];
?>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="css/common.css">
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="./js/mask.js"></script>
    <script src="./js/radio.js"></script>
</head>

<body bgcolor="#FFFFFF">

        <div id="card_sel" align="center">
                    <img src="image/step/step1.png"><br><br><br>
        <br>

<div class="check" align="center">
<table border="0" align="center">
<tr align="center">
<td><img src="image/step/select_blue.png">
</td>
<td width="20px">
</td>
<td><img src="image/step/select_white.png">
</td>
</tr>
<tr align="center">
<td><br>
<input type="radio" name="button" id="chk_blue" value="blue" onClick="b()">&nbsp;Like Card Blue
</td>
<td width="20px">
</td>
<td><br>
<input type="radio" name="button" id="chk_white" value="white" onClick="w()">&nbsp;Like Card White
</td>
</tr>
</table>
</div>
<br>
<div class="next" align="center">
</div>
<br>
<img src="image/step/warning.png"></div>
        </div>
        <!-- 모달 팝업 끝 -->
</body>
</html>