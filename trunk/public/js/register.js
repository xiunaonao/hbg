(function(){
	var cooltime=0;
	_app.click('#yzmPic',function(t,e){
		getYZM();
	});
	getYZM();
	function getYZM(data){
		var xhr = new XMLHttpRequest();
        var _url = '/api/yzm';
        xhr.open('GET', _url, true);
        xhr.responseType = 'blob';
        if (data)
            xhr.send(JSON.stringify(data));
        else
            xhr.send();
        xhr.onload = function () {
        	var key=xhr.getResponseHeader('captchakey');
            if (xhr.status == 200) {
            	var reader = new FileReader();
                var data=(xhr.response);
                reader.readAsDataURL(data);
                reader.onload=function(e){
                	yzmPic.setAttribute('src',e.target.result);
                	yzmPic.setAttribute('key',key);
                }
                
            } else {
                if (error)
                    error(xhr);
            }
        }
	}


	_app.click('#postcodeBtn',function(t,e){
		if(cooltime>0)
			return;
		_app.AJAX('/api/getCode','POST',{mobile:username.value,type:'register'},function(data){
			var data=JSON.parse(data);
			if(data.code!=0){
				alert(data.msg);
				return;
			}
			cooltime=60;
			window.coolFunc=setInterval(function(){
				if(cooltime<=0){
					window.clearInterval(coolFunc);
					t.innerText='免费发送验证码';
					return;
				}
				cooltime--;
				t.innerText='重新发送('+cooltime+'s)';

			},1000);
			}
		);
	});


	_app.click('#regBtn',function(t,e){
		if(password.value!=password2.value){
			console.log('两次密码不一致');
			return;
		}
		if(!isagree.checked){
			alert('请先同意协议');
			return;
		}
		var form={
			mobile:username.value,
			captchaKey:yzmPic.getAttribute('key'),
			captcha:yzm.value,
			smsCode:postcode.value,
			pwd:password.value
		};
		_app.AJAX('/api/register','POST',form,function(data){
			var data=JSON.parse(data);
			if(data.code!=0){
				alert(data.code);
				return;
			}
			if(confirm('注册成功，是否去登录？')){	
				location.href='login';
			}
		})
	});

})();