

<?php
include 'lib/db.php';
require 'lib/facebook.php';
require 'lib/fbconfig.php';

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
header("Location: http://www.facebook.com/test.like/app_445020752195462");
}
else
{ 
$loginUrl = $facebook->getLoginUrl(array( 'scope' => 'email,user_birthday,status_update,offline_access'));
echo '<a href="'.$loginUrl.'"><img src="../image/step/next.png" title="Login with Facebook" /></a>';
 }
 ?>
