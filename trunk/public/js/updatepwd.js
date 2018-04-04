	var cooltime=0;
	_app.click('#postcodeBtn',function(t,e){
		if(cooltime>0)
			return;
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

		_app.AJAX('/api/getCode','POST',{mobile:tel,type:'updatePwd'},function(data){
				console.log(data);
			}
		);
	});

	_app.click('#updatePwd',function(t,e){
		if(newPassword.value!=newPassword2.value){
			alert('两次密码不一样');
			return;
		}
		var form={};
		form={smsCode:postcodeTxt.value,pwd:newPassword.value};
		_app.AJAX('/api/updatePwd','POST',form,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				alert('修改成功');
				location.href='/login';
			}
		});
	});