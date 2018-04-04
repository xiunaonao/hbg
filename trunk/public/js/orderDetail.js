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


_app.click('#payNow',function(t,e){
	var inputs=pay_type.querySelectorAll('input');
	var form={};
	var price=parseFloat(document.querySelector('.order-allprice label').innerText);
	form.orderNo=no;
	// for(var i=0;i<inputs.length;i++){
	// 	if(inputs[i].checked){
	// 		form.type=i+1;
	// 		break;
	// 	}
	// }
	if(pay_type.querySelectorAll('.checkbox')[0].checked){
		form.payType=document.querySelector('.center-3rd-list .c').getAttribute('data-id');
	}else{
		form.payType=1;
	}
	if(form.payType==2){
		form.returnUrl='http://47.96.177.247:3000/order/paySuccess?no='+no;
	}
	_app.AJAX('/api/changePay','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code==0){
			if(form.payType==3){
					location.href='/order/pay?no='+form.orderNo+'&type='+form.payType+'&src='+data.url+'&name='+name+'&price='+price;
				}
				else if(form.payType==2){
					alipay_box.innerHTML=data.url;
					document.forms[0].submit();
				}
		}
	});
});

_app.click('#cancelOrder',function(t,e){
	if(!confirm('确定要取消订单吗?'))
		return;
	var form={};
	form.orderNo=no;
	_app.AJAX('/api/cancelOrder','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code==0){
			alert('订单已成功取消');
			location.href='/order/list';
			//t.parentNode.parentNode.parentNode.remove();
		}
		//t.parentNode.parentNode.parentNode.remove();
	});
});

_app.click('#confirmOrder',function(t,e){
	if(!confirm('现在要确认收货吗？'))
		return;
	var form={};
	form.orderNo=no;
	_app.AJAX('/api/confirmOrder','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code==-1){
			alert(data.msg);
		}else{
			alert('已确认收货');
			dataBind();
		}
		//t.parentNode.parentNode.parentNode.remove();
	});
});

_app.click('#cancelRefundOrder',function(t,e){
	if(confirm('确定要取消退款申请吗?')){
		var form={orderNo:no};
		_app.AJAX('/api/cancelRefundOrder','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code==0){
			alert('你已成功取消退款');
			location.reload();
		}
	});
	}
});

_app.click('#refundOrder',function(t,e){
	_app.showAlert('.refund-box');
	var form={};
	//{orderNo: 'ae3ca364ce8ba6f6', returnType:1, pics:[], reason:'买错了' ,skuList: [{skuId:'1743', quantity: 1}] }
	orderNo=no;
	refundNo.value=orderNo;
	document.querySelector('.refund-goods').innerHTML='';
	for(var i=0;i<goodsData.length;i++){
		var li=document.createElement('li');
		li.innerHTML='<input class="checkbox" type="checkbox" data-id="'+goodsData[i].skuId+'" checked="checked"/>';
		li.innerHTML+='<span><img src="'+goodsData[i].img+'" height="50"/></span>';
		li.innerHTML+='<label>'+goodsData[i].name+'x'+goodsData[i].num+'</label>';
		li.innerHTML+='<div>退款<input type="text" class="refund-num" data-max="'+goodsData[i].num+'" value="'+goodsData[i].num+'"/>件';
		document.querySelector('.refund-goods').appendChild(li);
	}
	_app.click('.refund-goods .checkbox',function(t,e){
		var ck=document.querySelectorAll('.refund-goods .checkbox');
		for(var i=0;i<ck.length;i++){
			if(!ck[i].checked){
				allchecked.checked=false;
				return;
			}
		}
		allchecked.checked=true;
	});
});

_app.click('#allchecked',function(t,e){
	var ck=document.querySelectorAll('.refund-goods .checkbox');
	for(var i=0;i<ck.length;i++){
		ck[i].checked=t.checked;
	}
});



_app.click('#confirmRefund',function(t,e){
	var form={};
	form.orderNo=refundNo.value;
	form.returnType=refundType.value;
	form.pics=[],
	form.reason=yourReason.value;
	//if(form.reason=='其他')
	form.reason+=' '+moreReason.value;
	form.skuList=[];
	var dom=document.querySelectorAll('.refund-goods .checkbox');
	for(var i=0;i<dom.length;i++){
		if(!dom[i].checked){
			continue;
		}
		var numDom=dom[i].parentNode.querySelector('.refund-num');
		var num=parseInt(numDom.value);
		var maxNum=parseInt(numDom.getAttribute('data-max'));
		if(num<=0){
			alert("退款数量不得少于1");
			return;
		}
		if(maxNum<num){
			alert('退款数量应不大于购买数量');
			return;
		}


		var obj={skuId:dom[i].getAttribute('data-id'),quantity:num};
		form.skuList.push(obj);


	}
	_app.AJAX('/api/refundOrder','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code==0){
			alert('你的退货请求已受理，请关注后续进展');
			_app.hideAlert('.refund-box');
			location.reload();
		}
	});
});