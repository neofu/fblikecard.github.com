

<?php
include 'connect/lib/db.php';
require 'connect/lib/facebook.php';
require 'connect/lib/fbconfig.php';

// Connection...
$user = $facebook->getUser();
if ($user)
 {
 $logoutUrl = $facebook->getLogoutUrl();
 try {
 $userdata = $facebook->api('/me');
 } catch (FacebookApiException $e) {
error_log($e);
$user = null;
 }
$_SESSION['facebook']=$_SESSION;
$_SESSION['userdata'] = $userdata;
$_SESSION['logout'] =  $logoutUrl;
 }
 ?>


<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="expires" content="-1" />


<script src="http://nari.be/js/jquery-1.7.2.min.js" type="text/javascript"></script> 
<link rel="stylesheet" type="text/css" href="css/common.css">
    <script src="./js/mask.js"></script>
    <style>
	    #mask {  
      position:absolute;  
      z-index:9;  
      background-color:#000;  
      display:none;  
      left:0;
      top:0;
    } 
    .window{
		left:105px;
		top:105px;;
      display: none;
      position:absolute;
	  background-color:none;  
      z-index:10000;
    }
	</style>
</head><body>
<div id="fb-root"></div>
<script src="http://connect.facebook.net/ko_KR/all.js#xfbml=1" type="text/javascript"></script><!-- 이놈이 원인 -->
<script type="text/javascript">
//window.fbAsyncInit = function() { (비동기식)
        FB.init({
            appId: '445020752195462',
            status: true, // check login status
            cookie: true, // enable cookies 
            xfbml: true, // parse XFBML
            oauth: true
        });
// };
		 // Load the SDK Asynchronously
	  (function(d){
		 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		 if (d.getElementById(id)) {return;}
		 js = d.createElement('script'); js.id = id; js.async = true;
		 js.src = "http://connect.facebook.net/ko_KR/all.js";
		 ref.parentNode.insertBefore(js, ref);
	   }(document));


        FB.Event.subscribe('auth.login', function (response) {
            window.location.reload();
        });



		FB.getLoginStatus(function (response) {
			if (response.status == "connected") {
			    
				//me/likes/227619837263655 로 수정할것
				FB.api('/me/likes/131330303621696', function(response) {
					if(response.data == null || response.data == "")
					{
						window.location.href = 'unlike.html';
					}
					FB.Canvas.setAutoResize(); // iframe 리사이즈

				});
            }
            else {
               
                var oauth_url = 'https://www.facebook.com/dialog/oauth/';
                oauth_url += '?client_id=445020752195462';
                oauth_url += '&redirect_uri=' + encodeURIComponent('http://www.facebook.com/test.like?sk=app_445020752195462');
                oauth_url += '&scope=publish_stream, email, user_photos'

                window.top.location = oauth_url;

            }
        });

</script>
<div id="wrapper">
<table border="0" width="100%" height="686">
<tr>
<td height="656" align="center" valign="bottom">

<div class="login">
    <a href="#" class="openMask"><img src="image/facebook.png" title="" /></a>
</div>
</td>
</tr>
<tr>
<td height="120px" valign="bottom" align="left">
<div id="fb-root"></div>
</td>
</tr>
</table>
</div>

<!-- 모달 팝업 -->
 <div id="mask"></div> 
    <div class="window" align="center" style="width:600px; height:430px"> 
    <div style="background-image:url(image/step/top.png); width:600px; height:21px"></div>
<div class="over" align="right" style="background-color:#FFF"><input type="image" href="#" class="close" src="image/close.png"  value="닫기(.window .close)"/> &nbsp;&nbsp;
        </div>
<div id="iframe" style="background-color:#FFF">
<iframe src="connect_app.php"  scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:600px; height:410px;" allowTransparency="true"></iframe></div>
<div style="background-image:url(image/step/under.png); width:600px; height:18px"></div>
</div>
</body>
</html>