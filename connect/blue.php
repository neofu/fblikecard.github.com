<link rel="stylesheet" type="text/css" href="../css/common.css">
        <div id="card_blue" align="center">
<?php
require 'lib/db.php';
require 'lib/facebook.php';
require 'lib/fbconfig.php';
session_start();
$facebook=$_SESSION['facebook'];
$userdata=$_SESSION['userdata'];
$logoutUrl=$_SESSION['logout'];

//Facebook Access Token
$access_token_title='fb_'.$facebook_appid.'_access_token';
$access_token=$facebook[$access_token_title];


if(!empty($userdata))
{
echo '<div style="background-image:url(http://nari.be/facebook/mylikecard/image/card/like_blue.png); width:401px; height:262px;">';
echo '<table border="0" style="margin-left:21px">';
echo '<tr>';
echo '<td>';
echo '<div id="serial_number" style="margin-top:20px; margin-left:270px; width:90px; height:15px;">';
echo '<font color="#c4cde0"><b>No.</b>0000001</font>';
echo '</div>';
echo '</td>';
echo '</tr>';
echo '<tr>';
echo '<td height="200px" valign="bottom">';
echo '<div id="profile">';
echo '<table border="0">';
echo '<tr>';
echo '<td>';
echo '<img src="https://graph.facebook.com/'.$userdata['id'].'/picture" width="60px" height="60px">';
echo '</td>';
echo '<td width="4px">';
echo '</td>';
echo '<td>';
echo '<font color="#ffffff"><h2>';
echo  ''.$userdata['name'];
echo '</h2>';
echo '<h4>';
echo  ''.$userdata['email'];
echo "<br/>";
echo  'http://좋아요.kr/'.$userdata['username'];
echo '</h4>';
echo '</font>';
echo '</td>';
echo '</tr>';
echo '</table>';
echo  '</div>';
echo '</td>';
echo '</tr>';
echo '</table>';
echo  '</div>';

$facebook_id=$userdata['id'];
$name=$userdata['name'];
$email=$userdata['email'];
$username=$userdata['username'];
$gender=$userdata['gender'];
$birthday=$userdata['birthday'];

mysql_query("users (`facebook_id`, `name`, `email`,'username', `gender`, `birthday`, `access_token`) VALUES('$facebook_id','$name','$email',''$username,'$gender','$birthday','$access_token')");
}
?>
</div>
<div id="fb-root"></div>
<script>
	var oFBParam = {
		apikey : '445020752195462',
		tabUrl :'http://my.좋아요.kr',
		tabTricUrl : 'TRIC_TAB_URL',
		perms : 'publish_stream,email,user_photos',
		type : 'tab', 
		oauth : true,
		debug : false
	};	
</script>
<script type="text/javascript" src="../js/facebook.js"></script>
<script type="text/javascript" src="../js/tab.js"></script>
<script type="text/javascript" src="../js/post.js"></script>
<div class="sending" align="center">
<table align="center">
<tr>
<td width="50%">
<div class="send_fb" align="left">
					<a id="btn_fb" class="btnFace" href="javascript:TAB.setPost({snsType:'fb'});"><img src="../image/step/feed.png"></a>
</div>
</td>
<td width="50%"><img src="../image/step/picture.png">
</td>
</tr>
</table>
</div>