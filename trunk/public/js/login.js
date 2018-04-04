(function(){
	_app.click('#login',function(t,e){
		var form={
			mobile:username.value,
			pwd:password.value
		};
		
		_app.AJAX('/api/login','POST',form,function(data){
			//console.log('登录成功');
			var data=JSON.parse(data);
			if(data.code==0)
				location.href='/users';
			else{
				alert(data.msg);
			}
		});
	});
})();