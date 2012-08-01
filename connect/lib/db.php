<?php
$mysql_hostname = "localhost";
$mysql_user = "neofu";
$mysql_password = "jinho636";
$mysql_database = "neofu";
$bd = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $bd) or die("Could not select database");
?>