var app_id = "445020752195462";
var app_secert_code = "b9024a11294ca3a87939570428aaaa2c";
var friendIdArr = new Array();
var friendNameArr = new Array();
var accessToken = "";

FB.init({
	appId  : app_id,
	status : true, // check login status
	cookie : true, // enable cookies to allow the server to access the session
	oauth  : true,  //enable OAuth 2.0
	xfbml  : true, // parse XFBML
	frictionlessRequests : true
});
window.fbAsyncInit = function() {
	FB.Canvas.setSize({ width: 1000, height: 898});
}
FB.Canvas.setAutoGrow();

function loginBtn(v, like)
{ //로그인 함수 <로그인 버튼이 누를때 동작>
	$.ajax ( {
		type	:	"GET"	,
		url		:	"save.asp",
		data	: {	command				: "button"
					,btnType				: v
					,pageType				: "main"
			   },
		success	:	function (msg) {
				},
		error	:	function (msg)	{
				}
	});

	if (like == 'no')
	{
		alert("좋아요와 팝업 해제를 클릭해주세요!!");
		return;
	}

	FB.getLoginStatus(function(response){
		//alert(response.status);
		//alert(response.authResponse);
		//not_authorized 권한 False, 로그인 True
		//unknown 로그인 False
		//connected 권한 및 로그인 True

		var status = response.status;
		if (status == "unknown") {
			sLogin(v);
			return;
		}
		else if (status == "not_authorized") {
			sLogin(v);
			return;
		}
		else if (status == "connected") {
			var accessToken = response.authResponse.accessToken;

			FB.api('/me/permissions', function(response) {
				if (response["data"][0]["publish_stream"]) {
					LoginSuccessGo(v);  //로그인 성공후에 실행되는 함수
				}
				else {
					FB.login(function(response) {},{scope:'publish_stream, email, user_photos'});
				}
			});

			return;
		}
	});
}

function sLogin(v)
{ //로그인 함수 <로그인 버튼이 누를때 동작>
	FB.getLoginStatus(function(response){
		if (response.authResponse)
		{   //로그인 되어 있는 상태
			LoginSuccessGo(v);  //로그인 성공후에 실행되는 함수
		}
		else
		{   //로그인이 안되어 있는 상태
			FB.login(function(response) {},{scope:'publish_stream, email, user_photos'});
		}
	});
}

function LoginSuccessGo(v)
{
	FB.api (
	{
		method: 'fql.query',
		query: 'select uid,name,email,pic_square from user where uid  = me()'
	},
		function(response) {
			$("#f_img").val(response[0].pic_square);
			$("#f_uid").val(response[0].uid);
			$("#f_name").val(response[0].name);
			$("#f_email").val(response[0].email);
		}
	);

	FB.getLoginStatus(function(response){
		//alert(response.status);
		//alert(response.authResponse);
		//not_authorized 권한 False, 로그인 True
		//unknown 로그인 False
		//connected 권한 및 로그인 True

		var status = response.status;

		 if (status == "connected") {
			var accessToken = response.authResponse.accessToken;

			FB.api('/me/permissions', function(response) {
				if (response["data"][0]["publish_stream"]) {
					success(v);
				}
			});

			return;
		}
	});
}

function sLoginPop()
{ //로그인 함수 <로그인 버튼이 누를때 동작>
	layerOpen("loading");
	FB.getLoginStatus(function(response){

		if (response.authResponse)
		{   //로그인 되어 있는 상태
			LoginSuccessGoPop();  //로그인 성공후에 실행되는 함수
		}
		else
		{   //로그인이 안되어 있는 상태
			FB.login(function(response)
			{
				if(response.authResponse){
					LoginSuccessGoPop();
				}else{
					location.href = "index.asp";
				}
			},
			{
				scope:'publish_stream, email, user_photos'
			});
		}
	});
}

function layerOpen(layer) {
    $("#bg2").show();
    $("#bg2").css("height", $(document).height());
	$("#bg2").css("z-index", 10000);
    var left = $(window).scrollLeft() + ($(window).width() - $("#" + layer).width()) / 2;
    var top = $(window).scrollTop() + ($(window).height() - $("#" + layer).height()) / 2;
    $("#" + layer).css("left", left);

	if (layer == "photo") {
		$("#" + layer).css("top", top + 700);
	}
	else {
		$("#" + layer).css("top", top);
	}

    $("#" + layer).fadeIn();
}

function LoginSuccessGoPop()
{
	FB.api (
	{
		method: 'fql.query',
		query: 'select uid,name,email,pic_square from user where uid  = me()'
	},
		function(response) {
			$("#f_img").val(response[0].pic_square);
			$("#f_uid").val(response[0].uid);
			$("#f_name").val(response[0].name);
			$("#f_email").val(response[0].email);
		}
	);

	friendSearch('');
}

function randomNum() {
    return Math.floor(Math.random() * 1000000) + 1;
}

function friendList() {
	FB.api (
	{
		method: 'fql.query',
		query: 'select uid,name,email,pic_square from user where uid in (select uid2 from friend where uid1 = me()) order by name'
	},
		function(response) {
			var j = 1;
			var friendList = "";
			var friendInfo = "<label for=\"chk$num\">";
			friendInfo += "<input type=\"checkbox\" id=\"chk$num\" name=\"chk$num\" value=\"$id\" onclick=\"friendSelect('$img', '$id', '$name', '$email', '$num', $cnt);\"> <img src=\"$img\" class=\"thumb\" alt=\"$name\"> $name";
			friendInfo += "</label>";

			var friendCnt = response.length;
			$("#friend_cnt").val(response.length);

			if (friendCnt == 0) {
				$(".rolling").html("<div style=\"margin-top:150px;\"><b>현재 페이스북 친구가 없습니다.</b></div>");
				layerClose("loading");
				return;
			}

			for (i =0; i< response.length; i++)
			{
				if (j == 1) {
					friendList += "<div class=\"list\">";
				}

				response[i].name = response[i].name.replace(/'/g,"");
				friendList += friendInfo.replace("$img", response[i].pic_square)
										.replace("$img", response[i].pic_square)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$id", response[i].uid)
										.replace("$id", response[i].uid)
										.replace("$name", response[i].name)
										.replace("$name", response[i].name)
										.replace("$name", response[i].name)
										.replace("$cnt", friendCnt);

				if (j != 1 && j % 16 == 0) {
					friendList += "</div><div class=\"list\">";	
				}

				if (friendCnt == j){
					if (friendCnt % 16 != 0) {
						friendList += "</div>";
					}

					$(".rolling").html(friendList);

					layerClose("loading");

					var slideCnt = $('.message .rolling')
					var direct = 'next';
					var timeGap = 5000;
					var speed =300;
					var max = $('.message .list').length;
					var listW = 635;

					if (1<max) {

						$('.message .m_select .cont').prepend('<span class="prev">이전</span>');
						$('.message .m_select .cont').append('<span class="next">다음</span>')
					}
					slideCnt.css({'width' : max* listW})

					$('.message span.prev').bind('click', function() {

						slideCnt.prepend(slideCnt.contents('.list').last().clone(true));
						slideCnt.css({'marginLeft': -listW})
						slideCnt.stop().animate({'marginLeft': 0}, speed, function(){
							slideCnt.contents('.list').last().remove();
						})
						return false;
					});

					$('.message span.next').bind('click', function() {
						slideCnt.stop().animate({'marginLeft': -(listW)}, speed, function() {
							slideCnt.append(slideCnt.contents('.list').first().clone(true));
							slideCnt.contents('.list').first().remove();
							slideCnt.css('marginLeft', '0');
						})
						return false;
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$('.bt_recomm').click(function(){
						var activeLayer = $(this).attr("href");
						$(activeLayer).show();
					});

					$('.bt_close').click(function(){
						$(this).parents('.wrap').hide();
					});
				}

				j++;
			}
		}
	);
}

function friendSearch(txt) {
	if (txt == '')
	{
		fBQuery = 'select uid,name,email,pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) order by name'
	} else {
		fBQuery = 'select uid,name,email,pic_square FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=me()) AND strpos(lower(name),"'+txt+'") >=0 order by name'
	}
	FB.api (
	{
		method: 'fql.query',
		query: fBQuery
	},
		function(response) {
			var j = 1;
			var friendList = "";
			var friendInfo = "<label for=\"chk$num\">";
			friendInfo += "<input type=\"checkbox\" id=\"chk$num\" name=\"chk$num\" value=\"$id\" onclick=\"friendSelect('$img', '$id', '$name', '$email', '$num', $cnt);\"> <img src=\"$img\" class=\"thumb\" alt=\"$name\"> $name";
			friendInfo += "</label>";

			var friendCnt = response.length;
			$("#friend_cnt").val(response.length);

			if (friendCnt == 0) {
				$(".rolling").html("");

				$('.message .m_select .cont .prev').remove();
				$('.message .m_select .cont .next').remove();

				layerClose("loading");
				return;
			}

			for (i =0; i< response.length; i++)
			{
				if (j == 1) {
					friendList += "<div class=\"list\">";
				}

				response[i].name = response[i].name.replace(/'/g,"");
				friendList += friendInfo.replace("$img", response[i].pic_square)
										.replace("$img", response[i].pic_square)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$num", i)
										.replace("$id", response[i].uid)
										.replace("$id", response[i].uid)
										.replace("$name", response[i].name)
										.replace("$name", response[i].name)
										.replace("$name", response[i].name)
										.replace("$cnt", friendCnt);

				if (j != 1 && j % 16 == 0) {
					friendList += "</div><div class=\"list\">";	
				}

				if (friendCnt == j){
					if (friendCnt % 16 != 0) {
						friendList += "</div>";
					}

					$(".rolling").html(friendList);

					layerClose("loading");

					var slideCnt = $('.message .rolling')
					var direct = 'next';
					var timeGap = 5000;
					var speed =300;
					var max = $('.message .list').length;
					var listW = 635;

					if (1<max) {

						$('.message .m_select .cont').prepend('<span class="prev">이전</span>');
						$('.message .m_select .cont').append('<span class="next">다음</span>')
					} else {
						$('.message .m_select .cont .prev').remove();
						$('.message .m_select .cont .next').remove();
					}
					slideCnt.css({'width' : max* listW})

					$('.message span.prev').bind('click', function() {

						slideCnt.prepend(slideCnt.contents('.list').last().clone(true));
						slideCnt.css({'marginLeft': -listW})
						slideCnt.stop().animate({'marginLeft': 0}, speed, function(){
							slideCnt.contents('.list').last().remove();
						})
						return false;
					});

					$('.message span.next').bind('click', function() {
						slideCnt.stop().animate({'marginLeft': -(listW)}, speed, function() {
							slideCnt.append(slideCnt.contents('.list').first().clone(true));
							slideCnt.contents('.list').first().remove();
							slideCnt.css('marginLeft', '0');
						})
						return false;
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$('.bt_recomm').click(function(){
						var activeLayer = $(this).attr("href");
						$(activeLayer).show();
					});

					$('.bt_close').click(function(){
						$(this).parents('.wrap').hide();
					});
				}

				j++;
			}
		}
	);
}

function friendResult(response) {
	var j = 1;
	var friendList = "";
	var friendInfo = "<label for=\"chk$num\">";
	friendInfo += "<input type=\"checkbox\" id=\"chk$num\" name=\"chk$num\" value=\"$id\" onclick=\"friendSelect('$img', '$id', '$name', '$email', '$num', $cnt);\"> <img src=\"$img\" class=\"thumb\" alt=\"$name\" width=\"50\" height=\"50\"> $name";
	friendInfo += "</label>";

	var friendCnt = response.length;
	$("#friend_cnt").val(response.length);

	if (friendCnt == 0) {
		$(".rolling").html("<div style=\"margin-top:150px;\"><b>현재 페이스북 친구가 없습니다.</b></div>");
		layerClose("loading");
		return;
	}

	for(var i = 0; i < response.length; i++) {
		var fUrl = "https://graph.facebook.com/" + response[i].uid2;
		
		FB.api (
		{
			method: 'fql.query',
			query: 'select uid,name,email,pic_square from user where uid  = "' + response[i].uid2 + '"'
		},
			function(response) {
				if (j == 1) {
					friendList += "<div class=\"list\">";
				}


				friendList += friendInfo.replace("$img", response[0].pic_square)
										.replace("$img", response[0].pic_square)
										.replace("$num", j)
										.replace("$num", j)
										.replace("$num", j)
										.replace("$id", response[0].uid)
										.replace("$id", response[0].uid)
										.replace("$name", response[0].name)
										.replace("$name", response[0].name)
										.replace("$name", response[0].name)
										.replace("$cnt", friendCnt);

				if (j != 1 && j % 16 == 0) {
					friendList += "</div><div class=\"list\">";	
				}

				if (friendCnt == j){
					if (friendCnt % 16 != 0) {
						friendList += "</div>";
					}

					$(".rolling").html(friendList);

					layerClose("loading");

					var slideCnt = $('.message .rolling')
					var direct = 'next';
					var timeGap = 5000;
					var speed =300;
					var max = $('.message .list').length;
					var listW = 635;

					if (1<max) {

						$('.message .m_select .cont').prepend('<span class="prev">이전</span>');
						$('.message .m_select .cont').append('<span class="next">다음</span>')
					}
					slideCnt.css({'width' : max* listW})

					$('.message span.prev').bind('click', function() {

						slideCnt.prepend(slideCnt.contents('.list').last().clone(true));
						slideCnt.css({'marginLeft': -listW})
						slideCnt.stop().animate({'marginLeft': 0}, speed, function(){
							slideCnt.contents('.list').last().remove();
						})
						return false;
					});

					$('.message span.next').bind('click', function() {
						slideCnt.stop().animate({'marginLeft': -(listW)}, speed, function() {
							slideCnt.append(slideCnt.contents('.list').first().clone(true));
							slideCnt.contents('.list').first().remove();
							slideCnt.css('marginLeft', '0');
						})
						return false;
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$(".bt_confc").click(function(){
						$(this).parents('p').next('.term').toggle();
					});

					$('.bt_recomm').click(function(){
						var activeLayer = $(this).attr("href");
						$(activeLayer).show();
					});

					$('.bt_close').click(function(){
						$(this).parents('.wrap').hide();
					});
				}

				j++;
			}
		);
	}
}

function layerClose(layer) {
    $("#bg2").hide();
	$("#bg2").css("z-index", 0);
    $("#" + layer).fadeOut();
}

function friendSelect(img, id, name, email, num, cnt) {
	var chk = false;

	for (var i = 0; i < friendIdArr.length; i++) {
		if (id == friendIdArr[i]) {
			chk = true;
		}
	}

	if (chk) {
		$('#chk' + num).parents('label').removeClass('checked');
		var friendIdArrTemp = new Array();
		var friendNameArrTemp = new Array();

		for (var i = 0; i < friendIdArr.length; i++) {
			if (id != friendIdArr[i]) {
				friendIdArrTemp.push(friendIdArr[i]);
			}
		}

		for (var i = 0; i < friendNameArr.length; i++) {
			if (img != friendNameArr[i]) {
				friendNameArrTemp.push(friendNameArr[i]);
			}
		}

		friendIdArr = new Array();
		friendNameArr = new Array();

		for (var i = 0; i < friendIdArrTemp.length; i++) {
			friendIdArr.push(friendIdArrTemp[i]);
		}

		for (var i = 0; i < friendNameArrTemp.length; i++) {
			friendNameArr.push(friendNameArrTemp[i]);
		}
	}
	else {
		if (friendIdArr.length >= 5) {
			alert("친구는5명까지만 선택하실 수 있습니다.");
			$('#chk' + num).parents('label').removeClass('checked');
			return;
		} else {
			$('#chk' + num).parents('label').addClass('checked');
		}

		friendIdArr.push(id);
		friendNameArr.push(name);
	}

	$("#to_f_name").val(friendNameArr);
	$("#to_f_uid").val(friendIdArr);
}

// 담벼락 글 올리기
function FBPost(num)
{
	layerOpen("process");
	var str = "";
	var des = "";
	var tagging = "";
	var name = $("#f_name").val();
	
	var to_f_uid = $("#to_f_uid").val().split(",");
	var to_f_name = $("#to_f_name").val().split(",");
	var imgUrl = "http://simple.itsdl.co.kr/images/case"+num+".jpg";
//	for(var i = 0; i < to_f_uid.length; i++)
//	{
//		FBPost2(i, to_f_uid[i], imgUrl);
//	}

		FB.api("/me/photos", "post",
		{
			message : $("#postMsg").val() + "\n\n좋아요 놀이공간에서 세상에 단 하나뿐인 나만의 좋아요 카드를 만들어 보세요 \n http://my.좋아요.kr"
			, url : imgUrl
		},
			function(response)
			{
				if (!response || response.error)
				{
					//alert(response.error.message);
				}
				else
				{
					if ($("#to_f_uid").val() != "")
					{
						for(var i = 0; i < to_f_uid.length; i++)
						{
							
							tagFriend(i, response.id, to_f_uid[i]);
						}

					}
				}
			}
		);
}

function test(i) {
$("#mesFrm").submit();
					$('#feedLayer').css({top: '0', left:'0'});
					$('#feedLayer iframe', parent.document).height('456');
					layerClose("process");
}
function tagFriend(i, id, fid) {
	FB.api("/" + id +"/tags/" + fid, "post",
		{
		},
		function(response) {
			if (!response || response.error)
			{
				//alert("error : " + response.error.message);
			}
			else
			{
				if ((i + 1) == $("#to_f_uid").val().split(",").length) {
					$("#mesFrm").submit();
					$('#feedLayer').css({top: '0', left:'0'});
					$('#feedLayer iframe', parent.document).height('456');
					layerClose("process");
				}
			}
		}
	);
}

function tagReg(id) {
	var to_f_uid = $("#to_f_uid").val().split(",");

	for (var i = 0; i < to_f_uid.length; i++) {

		FB.api("/" + id +"/tags", "post",
			{
				tag_uid: to_f_uid[i]
			},
			function(response) {
				if (!response || response.error) {
					alert(response.error.message);
				}
			}
		);
	}

	$("#mesFrm").submit();
}

function FBPost2(i, id, imgUrl) {
	FB.api("/" + id + "/feed", "post",
	{
		message : $("#postMsg").val()
		, name : "My Like Card"
		, picture : "http://nari.be/facebook/mylikecard/image/card/like_blue.png"
		, description : "좋아요 놀이공간에서 세상에 단 하나뿐인 나만의 좋아요 카드를 만들어 보세요 \n http://my.좋아요.kr "
		//, link : imgUrl
	},
		function(response)
		{
			if (!response || response.error)
			{
				alert("error : " + response.error.message);
			}
			else
			{
				if ((i + 1) == $("#to_f_uid").val().split(",").length) {
					$("#mesFrm").submit();
				}
			}
		}
	);
}
