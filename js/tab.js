var TAB = (function(oFBParam, oFB) {
	function _ajax(oParam, fnCallback) {
		if( typeof oParam === 'string') {
			oParam = jQuery.parseJSON(oParam);
		}
		$.ajax({
			url : oParam.url,
			data : oParam.data,
			type : "POST",
			success : function(res) {
				if( typeof res === 'string') {
					res = jQuery.parseJSON(res);
				}
				fnCallback(res);
			},
			error : function(res) {
				if( typeof res === 'string') {
					res = jQuery.parseJSON(res);
				}
				fnCallback(res);
			}
		});
	}
	return {
		setPost : function(param) {
			
			try {
				if( typeof param.snsType !== 'string') {
					throw "옳바른 파라메터가 아닙니다.";
				}
				switch(param.snsType) {
					case 'fb':
					case 'F':
					case 'facebook':
						oFB.post(post.fb, function(res) {
						});
						break;
					default :
						throw "snsType 파라메터를 확인 하세요. : " + param.snsType;
				}
			} catch(e) {
				console.log(e);
			}
		}
	}
})(oFBParam, oFB);

