var oFB = (function(param) {
	var fbApiInitialized = false;
	var options = {
		apikey : param.apikey || null
		,tabUrl : param.tabUrl ||null
		,appsUrl : param.appsUrl || null
		,perms : param.perms || null
		,type : param.type || 'tab'
		,debug : param.debug || false
		
		,status : param.status || true 
		,cookie : param.cookie || true 
		,xfbml : param.xfbml || true 
		,oauth : param.oauth || false 
		,channelUrl : param.channelUrl || document.location.protocol + '//' + document.location.hostname + '/channel.html'
	};
	
	function _fbEnsureInit(callback) {
	    if (!fbApiInitialized) {
	        setTimeout(function() { _fbEnsureInit(callback); }, 100);
	    } else {
	        if (callback) {  callback(); }
	    }
	}

	function fbConnect() {
		
		window.fbAsyncInit = function() {
			FB.Event.subscribe('auth.login', function(response) {
				fbApiInitialized = true;
				FB.Canvas.setAutoGrow();
				// console.log(response);
			});
			FB.init({
				appId      : options.apikey, // App ID
				channelURL : options.channelUrl, // Channel File
				status     : options.status, // check login status
				cookie     : options.cookie, // enable cookies to allow the server to access the session
				oauth      : options.oauth, // enable OAuth 2.0
				xfbml      : options.xfbml  // parse XFBML
			});
			FB.Canvas.setAutoGrow();
			
			
			
		
			
			
		};
	};

	(function(d) {
		var js, id = 'facebook-jssdk';if(d.getElementById(id)) {return;}
		js = d.createElement('script');js.id = id;js.async = true;js.src = "//connect.facebook.net/ko_KR/all.js";
		d.getElementsByTagName('head')[0].appendChild(js);
		if(js.readyState){
			//IE용 script 레디 상태 체크
			js.onreadystatechange = function() {
				if(this.readyState == 'complete' || this.readyState == 'loaded') {
					fbConnect();
				}
			};
		}else{
			js.onload = function(){
				fbConnect();
			} 
		}
	}(document));
	
	function _getStatus(cb){
		FB.getLoginStatus( function(res) {
			return cb(res);
		},'perms');
	}
	function _login(cb){
		if(options.oauth || options.type == 'apps'){	//oAuth 2.0
			top.location.href='https://www.facebook.com/dialog/oauth/?'
							  +'scope='+options.perms+'&'
							  +'client_id='+options.apikey+'&'
							  +'redirect_uri='+options.tabUrl+'&'
							  +'response_type=token';
			// FB.login(function(response) {
				// if (response.authResponse) {
					// cb(true);
				// }else {
					// cb(false);
				// }
			// }, {
				// scope : options.perms
			// });
		}else{
			var opts = FB.copy({
				method : 'auth.login',
				display : 'dialog'
			}, {
				perms : options.perms
			});
			FB.ui(opts, function(response) {
				if(response.session){
					if(options.perms !== null){
						var perms = (response.perms);
						try{
							if(perms.extended.length == 0) {
								cb(false);
							} else {
								cb(true);
							}
						}catch(e){
							if(perms) {
								cb(true);
							} else {
								cb(false);
							}
						}
					}
				}else{
					cb(false);
				}
			});
		}
	}
	/**
	 * 퍼블리싱 하기
	 * @param param  {
	 title : String
	 imgSrc : String
	 imglink : String
	 publishMsg : String
	 promptMsg : String
	 msg : String
	 actionLinkText : String
	 actionLinkSrc : String
	 auto : bool
	 pause : bool
	 target : UserID
	 connect : bool
	 fnCallback : Object
	 }

	 */
	function _setPost(param, fnCallback) {
		if(typeof param == 'string') {
			param = jQuery.parseJSON(param);
		}
		var oReturn = {};

		var aAttachment = null;
		var aActionLinks = null;
		var sTargetId = null;
		var user_message_prompt = "Add a message";
		var bAutoPublish = false;

		switch(param.mediaType) {
			case 'image':
				aAttachment = {
					'name' : param.title,
					'href' : param.imgLink,
					'description' : param.publishMsg,
					'caption' : param.caption,
					'media' : [{
						'type' : 'image',
						'src' : param.imgSrc,
						'href' : param.imgLink
					} ]
				};
				break;
			case 'flash':
				aAttachment = {
					'name' : param.title,
					'description' : param.publishMsg,
					'caption' : param.caption,
					'href' : param.imgLink,
					'media' : [{
						'type' : 'flash',
						'swfsrc' : param.playerUrl,
						'imgsrc' : param.imgSrc,
						'width' : '130',
						'expanded_width' : '398',
						'expanded_height' : '272'
					} ]
				};
				break;
			default : 
				aAttachment = {
					'name' : param.title,
					'href' : param.imgLink,
					'description' : param.publishMsg,
					'caption' : param.caption
				};
				break;
		}

		if (param.actionLinkText != undefined && param.actionLinkText != ''
		&& param.actionLinkSrc != undefined && param.actionLinkSrc != '') {
			aActionLinks = [{
				'text' : param.actionLinkText,
				'href' : param.actionLinkSrc
			} ];
		}

		if (param.promptMsg != undefined && param.promptMsg != '') {
			user_message_prompt = param.promptMsg;
		}

		if (param.target != undefined && param.target != '') {
			sTargetId = param.target;
		}

		if (param.auto != undefined
		&& (param.auto == '1' || param.auto == true || param.auto == "true")) {
			bAutoPublish = true;
		}

		if (bAutoPublish) {
			FB.api({
				method : 'stream.publish',
				message : param.msg,
				attachment : aAttachment,
				action_links : aActionLinks,
				user_message_prompt : user_message_prompt,
				auto_publish : bAutoPublish,
				display : 'dialog',
				target_id : sTargetId
			}, function(res) {
				fnCallback(res);
			});
		} else {
			try {
				FB.ui({
					method : 'stream.publish',
					message : param.msg,
					attachment : aAttachment,
					action_links : aActionLinks,
					user_message_prompt : user_message_prompt,
					auto_publish : bAutoPublish,
					display : 'dialog',
					target_id : sTargetId
				}, function(res) {
					fnCallback(res);
				});
			} catch (err) {
				alert('Error on calling fbFeed!!\r\n' + err);
			}
		}
	}
	
	function _appsRequset(param, cb){
		FB.ui({
			method: 'apprequests'
			,message: param.message || ''
			,to : param.to || null
			,exclude_ids : param.exclude_ids || null
			,title : param.title || null
			,data : param.data || null
			,filters : param.filters || null
		}, cb);
	}
	
	return {
		fbEnsureInit : function(callback){
			_fbEnsureInit(callback);
		},
		login : function(cb) {
			_getStatus(function(res){
				switch (res.status) {
				case 'unknown':
					window.open('https://www.facebook.com/login.php?api_key='
							+ options.apikey
							+ '&skip_api_login=1&display=popup&locale=ko_KR'
							+ '&next=' + encodeURIComponent(options.appsUrl), '_top');
					break;
				case 'notConnected':
				case 'not_authorized':
					_login(cb);
					break;
				case 'connected':
					cb(true);
					break;
				}
			});
		}
		,getStatus : function(cb){
			_getStatus(function(res){
				cb(res.status);
			});
		}
		,post : function(param, cb){
			_setPost({
				mediaType : param.mediaType || 'image',
				title : param.title || '',
				imgSrc : param.imgSrc || '',
				swfSrc : param.swfSrc || '',
				imgLink : param.imgLink || '',
				caption : param.caption || '',
				publishMsg : param.publishMsg || '',
				promptMsg : param.promptMsg || '',
				msg: param.msg || '',
				actionLinkText : param.actionLinkText || '',
				actionLinkSrc : param.actionLinkSrc || '',
				target : param.targetUid || '',
				auto : param.auto || false
			}, cb);
		}
		,invite : function(param, cb){
			_appsRequset({
				message : param.message || null
				,to : param.to || null
				,exclude_ids : param.exclude_ids || null
				,title : param.title || null
				,data : param.data || null
				,filters : param.filters || null
			},cb);
		}
	};
})(oFBParam);




