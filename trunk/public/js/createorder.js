_app.click('.detail-num>button',function(t,e){
	var num=parseInt(t.getAttribute('data-num'));
	var amount=t.parentNode.querySelector('.amount');
	amount.value=parseInt(amount.value)+num;
});

_app.click('.address-box .checkbox',function(t,e){
	var check=document.querySelectorAll('.address-box .checkbox');
	for(var i=0;i<check.length;i++){
		check[i].checked=false;
	}
	t.checked=true;
});

_app.click('#pay_type .checkbox',function(t,e){
	var inputs=pay_type.querySelectorAll('input');
	for(var i=0;i<inputs.length;i++){
		inputs[i].checked=false;
	}
	t.checked=true;
});

var cooltime=0;
setInterval(function(){

	if(cooltime>0){
		if(cooltime==1){
			payCodeBtn.style.background='#a71f23';
			payCodeBtn.innerText='获取短信验证码';
			cooltime--;
		}else{
			cooltime--;
			payCodeBtn.innerText='重新发送('+cooltime+'s)';
		}
		
		
	}
},1000);

_app.click('#payCodeBtn',function(t,e){
	if(cooltime>0)
		return;
	
	_app.AJAX('/api/getCode','POST',{mobile:username.value,type:'payment'},function(data){
		cooltime=60;
		t.innerText='重新发送('+cooltime+'s)';
		t.style.background='#CCC';
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

_app.click('.buynow',function(t,e){
	var form={};
	form.buySkus=[];
	var amounts=document.querySelectorAll('.amount');
	var skuId=document.querySelectorAll('.skuId');
	for(var i=0;i<amounts.length;i++){
		form.buySkus.push({skuId:skuId[i].value,amount:amounts[i].value});
	}
	form.message=message.value;
	if(coupon.value!=-1)
		form.couponId=coupon.value;
	if(newAddress.checked){
		form.consigneeTele=telephone.value;
		form.consigneeName=postName.value;
		form.consigneeProvince=province.value;
		form.consigneeCity=city.value;
		form.consigneeArea=area.value;
		form.consigneeAddress=detailAddress.value;
		form.identityCard=IDCard.value;

		form.couponId='';
		var addForm={contactor:form.consigneeName,
			mobile:form.consigneeTele,
			idnum:form.identityCard,
			province:form.consigneeProvince,
			city:form.consigneeCity,
			area:form.consigneeArea,
			address:form.consigneeAddress};
		_app.AJAX('/api/addAddress','POST',addForm,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				submit();
			}else{
				alert(data.msg);
			}
		});
	}else{
		var check=document.querySelectorAll('.address-box .checkbox');
		var label=null;
		for(var i=0;i<check.length;i++){
			if(check[i].checked){
				label=check[i].parentNode.parentNode.querySelector('label');
			}
		}
		if(!label){
			alert('请先选择收货地址');
			return;
		}

		var b=label.querySelectorAll('b');
		form.consigneeProvince=b[0].innerText;
		form.consigneeCity=b[1].innerText;
		form.consigneeArea=b[2].innerText;
		form.consigneeAddress=b[3].innerText;
		form.consigneeName=b[4].innerText;
		form.consigneeTele=b[5].innerText;
		form.identityCard=b[6].innerText;

		submit();
	}
	// form.payType=3;


	// // for(var i=0;i<3;i++){
	// // 	if(pay_type.querySelectorAll('input')[i].checked){
	// // 		form.payType=i+1;
	// // 	}
	// // }

	// if(pay_type.querySelectorAll('.checkbox')[0].checked){
	// 	form.payType=document.querySelector('.center-3rd-list .c').getAttribute('data-id');
	// }else{
	// 	form.payType=1;
	// }

	// if(form.payType==2){
	// 	form.returnUrl='/order/paySuccess?no='+no;
	// }
	 
	function submit(){
		//var newWindows=window.open();
		_app.AJAX('/api/submitOrder','POST',form,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				var orderNo=data.obj.orderNo;
				var payString=data.obj.payString;
				var name=data.obj.mainOrder.orderAbstract;
				var price=(data.obj.mainOrder.payPrice/100).toFixed(2);
				//newWindows.location.href='/order/payConfirm?no='+orderNo;
				// var a = document.createElement("a");
				// a.setAttribute("href", '/order/payConfirm?no='+orderNo);
				// a.setAttribute("target", "testNewWindow");
				// a.setAttribute("id", "camnpr");
				// document.body.appendChild(a);
				// a.click(); 
				location.href='/order/payConfirm?no='+orderNo;
				
				//console.log(form.payType);
				//
				// if(form.payType==3){
				// 	location.href='/order/pay?no='+orderNo+'&type='+form.payType+'&src='+payString+'&name='+name+'&price='+price;
				// }
				// else if(form.payType==2){
				// 	alipay_box.innerHTML=payString;
				// 	document.forms[0].submit();
				// }else if(form.payType==1){
				// 	var payform={orderNo:orderNo,smsCode:payCodeTxt.value};
				// 	_app.AJAX('/api/pay','POST',payform,function(data2){
				// 		var data2=JSON.parse(data2);
				// 		if(data2.code=='0'){
				// 			alert('支付成功');
				// 			location.href='/order/detail?no='+orderNo;
				// 		}else{
				// 			alert(data2.msg);
				// 		}
				// 	});
				// }
			}else{
				newWindows.close();
				alert(data.msg);
			}
		});		
	}


});