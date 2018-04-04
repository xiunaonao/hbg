(function(){

	_app.click('.center-username>b>a',function(t,e){
		_app.showAlert('.center-userupdate');
	});


	_app.click('#recharge',function(t,e){
		_app.showAlert('.center-userrecharge');
	});

	_app.click('#updateInfo',function(t,e){
		var form={avatar:'',nickName:yourNewName.value,sex:yourNewSex.value};
		_app.AJAX('/api/updateInfo','POST',form,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				alert('修改成功');
				yourName.querySelector('label').innerText=data.obj.nickName;
				_app.hideAlert('.center-userupdate');
			}
		});
	});

	_app.click('.center-3rd-list>li',function(t,e){
		document.querySelector('.center-3rd-list>.c').setAttribute('class','');
		var _t=t;
		if(t.nodeName!='LI'){
			_t=t.parentNode;
		}
		_t.setAttribute('class','c');
	});

	_app.click('#rechargeSubmit',function(t,e){

		var form={};
		form.tradeAmount=parseFloat(rechargeMoney.value)*100;
		form.tradeWay=document.querySelector('.center-3rd-list>.c').getAttribute('data-id');
		_app.AJAX('/api/recharge','POST',form,function(data){
			var data=JSON.parse(data);
			if(form.tradeWay==3){
				location.href='/order/pay?no='+data.obj.orderNo+'&type=3&src='+data.obj.payString+'&name=账号充值&price='+form.tradeAmount/100;
			}
			else if(form.tradeWay==2){
				alipay_box.innerHTML=data.obj.payString;
				document.forms[0].submit();
			}
		});

	});

	_app.AJAX('/api/getOrderNum','GET',{},function(data){
		var data=JSON.parse(data);
		for(var i=0;i<data.list.length;i++){
			var dom=document.querySelector('#order_'+data.list[i].orderStatus);
			if(dom){
				dom.innerText=data.list[i].count;
				dom.setAttribute('onclick','location.href="/order/list?status='+data.list[i].orderStatus+'"');
			}
		}
	});

	//_app.click('')
})();