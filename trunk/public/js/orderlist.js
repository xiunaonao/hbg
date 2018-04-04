
_app.click('.order-filter-status a',function(t,e){
	document.querySelector('.order-filter-status .c').setAttribute('class','');
	t.setAttribute('class','c');
	nowPage.innerText=1;
	dataBind();
})

_app.click('.page-box>a',function(t,e){
	var page=t.getAttribute('data-page');
	console.log(page);
	if(page){
		nowPage.innerText=page;
	}
	dataBind();
});

function dataBind(){
	//startDate：开始时间 字符串类型的，endDate：结束日期 字符串类型，consigneeName：收货人姓名，consigneeTele：收货人电话
	var form={};
	form.page=nowPage.innerText;
	if(nowStatus.querySelector('.c').getAttribute('data-status')!='0')
		form.status=nowStatus.querySelector('.c').getAttribute('data-status');
	var url='/api/orderList';
	if(postMan.value){
		form.consigneeName=postMan.value;
	}
	if(startDate.value){
		form.startDate=startDate.value;
	}
	if(endDate.value){
		form.endDate=endDate.value;
	}

	if(form.status=='98'){
		delete form.status;
		dataRefundBind();
		return;
		//url='/api/refundOrderList';
	}
	_app.AJAX(url,'POST',form,function(data){
		var li='<li class="list-head"><span>商品</span><span>贸易类型</span><span>交易时间</span><span>状态</span><span>总价</span>'
			+'<span class="list-option">操作</span>';
		var data=JSON.parse(data);
		document.querySelector('.order-list').innerHTML='';
		if(!data.list)
			return;
		for(var i=0;i<data.list.length;i++){
			var obj=data.list[i];
			var index=0;
			for(var k=0;k<obj.subOrderList.length;k++){
				var goods=obj.subOrderList[k].subOrderDO.orderItemSkuList;
				index+=goods.length;
			}
			li+='<li class="list-content" style="height:'+(80*(index)+20)+'px">';
			li+='<h5>订单编号:'+obj.orderNo+'</h5>';
			li+='<span style="height:'+(80*index)+'px" class="list-goods">';
			for(var k=0;k<obj.subOrderList.length;k++){
				var goods=obj.subOrderList[k].subOrderDO.orderItemSkuList;
				if(!goods)
					goods=[];
				for(var j=0;j<goods.length;j++){
					var obj2=goods[j];
					li+='<img onclick="location.href=\'/detail?id='+obj2.itemId+'\'"  src="'+obj2.picUrl+'" data-id="'+obj2.skuId+'" data-num="'+obj2.quantity+'"/>';
					li+='<strong><b>'+obj2.itemName+'</b><label>规格：'+obj2.skuValue+'</label></strong>';
				}
			}
			li+='</span>';
			li+='<span style="height:'+(80*index)+'px" class="list-type"><label>'+(obj.orderType=='bond'?'保税':'')+(obj.orderType=='mix'?'混合':'')+(obj.orderType=='common'?'一般贸易':'')+'</label></span>';
			var date=new Date(obj.createTime);
			var stu=obj.orderStatus;
			console.log(stu)
			li+='<span style="height:'+(80*index)+'px" class="list-date"><label>'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-status"><label>'+(stu==4?'已关闭':'')+(stu==0?'已取消':'')+(stu==1?'待支付':'')+(stu==3?'待发货':'')+(stu==7?'待收货':'')+(stu==15?'已收货':'')+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-allprice"> <label>￥'+(obj.payPrice/100).toFixed(2)+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-option"><i>';
			var str='<a href="/order/detail?no='+obj.orderNo+'">详情</a><br/>';
			if(stu==1){str+='<a href="/order/detail?no='+obj.orderNo+'#pay_type">去付款</a><br><a class="cancelOrder" data-id="'+obj.orderNo+'">取消订单</a>'}
			if(stu==3 || stu==7){
				if(obj.orderReturnStatus==0)
					str+='<a class="refundOrder" data-id="'+obj.orderNo+'">申请退款</a>';
				else if(obj.orderReturnStatus==-1)
					str+='<a class="refundOrder" data-id='+obj.orderNo+'>申请退款</a>';
				else if(obj.orderReturnStatus==1)
					str+='<a class="gray cancelRefundOrder" data-id='+obj.orderNo+'>退单已申请</a>';
				else if(obj.orderReturnStatus==3)
					str+='<a class="gray" data-id='+obj.orderNo+'>退单审核中</a>';
				else if(obj.orderReturnStatus==7)
					str+='<a class="gray" data-id='+obj.orderNo+'>退款已完成</a>';
				else if(obj.orderReturnStatus==8)
					str+='<a class="gray" data-id='+obj.orderNo+'>退款已完成</a>';
				str+='<br/>';
			}
			/*-if(stu==1)
									a(href='/order/detail?no=#{obj.orderNo}#pay_type')  去付款
									br
									a.cancelOrder(data-id='#{obj.orderNo}') 取消订单
								-if(stu==3 || stu==7)
									-if(obj.orderReturnStatus==0)
										a.refundOrder(data-id='#{obj.orderNo}') 申请退款
									-else if(obj.orderReturnStatus==-1)
										//a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退单被拒
										a.refundOrder(data-id='#{obj.orderNo}') 申请退款
									-else if(obj.orderReturnStatus==1)
										a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退单已申请
										//a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 正在处理退款
									-else if(obj.orderReturnStatus==3)
										a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退单审核中
										//a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退款已通过
									-else if(obj.orderReturnStatus==7)
										a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退款已完成
										//a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 已提交支付宝退款
									-else if(obj.orderReturnStatus==8)
										a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 退款已完成
										//a.gray.cancelRefundOrder(data-id='#{obj.orderNo}') 已提交微信退款
									br*/
			

			if(stu==7){str+='<a class="confirmOrder" data-id="'+obj.orderNo+'">确认收货</a>';}
			li+=str;
			li+='</i></span>';
			li+='</li>';
		}
		document.querySelector('.order-list').innerHTML=li;
		bindDataEvent();
		var _page=[];
		nowPage.innerText=data.page.page<=data.page.pages?data.page.page:data.page.pages;
		allPage.innerText=data.page.pages;
		allPage.setAttribute('data-page',allPage.innerText);
		pageLeft.setAttribute('data-page',data.page.page>1?data.page.page-1:1);
		pageRight.setAttribute('data-page',data.page.page<data.page.pages?data.page.page+1:data.page.pages);


	});
}

function dataRefundBind(form){
	var url='/api/refundOrderList';
	_app.AJAX(url,'POST',form,function(data){
		var li='<li class="list-head"><span>商品</span><span>退款类型</span><span>申请时间</span><span>状态</span><span>总价</span>'
			+'<span class="list-option">操作</span>';
		var data=JSON.parse(data);
		document.querySelector('.order-list').innerHTML='';
		if(!data.list)
			return;
		for(var i=0;i<data.list.length;i++){
			var obj=data.list[i];
			var index=obj.orderReturnDetailList.length;
			if(index==0)
				continue;
			li+='<li class="list-content" style="height:'+(80*(index)+20)+'px">';
			li+='<h5>订单编号:'+obj.orderNo+'</h5>';
			li+='<span style="height:'+(80*index)+'px" class="list-goods">';
			for(var k=0;k<obj.orderReturnDetailList.length;k++){
				var obj2=obj.orderReturnDetailList[k];
				li+='<img onclick="location.href=\'/detail?id='+obj2.itemId+'\'"  src="'+obj2.picUrl+'" data-id="'+obj2.skuId+'" data-num="'+obj2.quantity+'"/>';
				li+='<strong><b>'+obj2.itemName+'</b><label>规格：'+obj2.skuValue+'</label></strong>';
			}
			
			li+='</span>';
			li+='<span style="height:'+(80*index)+'px" class="list-type"><label>'+(obj.returnType=='2'?'退款退货':'')+(obj.orderType=='1'?'仅退款':'')+'</label></span>';
			var date=new Date(obj.createTime);
			var stu=obj.orderStatus;
			console.log(stu)
			li+='<span style="height:'+(80*index)+'px" class="list-date"><label>'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-status"><label>'+(stu==4?'已关闭':'')+(stu==0?'已取消':'')+(stu==1?'待支付':'')+(stu==3?'待发货':'')+(stu==7?'待收货':'')+(stu==15?'已收货':'')+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-allprice"> <label>￥'+(obj.itemPrice/100).toFixed(2)+'</label></span>';
			li+='<span style="height:'+(80*index)+'px" class="list-option"><i>';
			var str='<a href="/order/detail?no='+obj.orderNo+'">详情</a><br/>';
			if(obj.returnStatus==0){
				str+='<a class="refundOrder" data-id="'+obj.orderNo+'">申请退款</a>';
			}
			// else if(obj.returnStatus==-1)
			// 	str+='<a class="gray cancelRefundOrder" data-id='+obj.orderNo+'>退款被拒</a>';
			// else if(obj.returnStatus==1)
			// 	str+='<a class="gray cancelRefundOrder" data-id='+obj.orderNo+'>正在处理退款</a>';
			// else if(obj.returnStatus==3)
			// 	str+='<a class="gray" data-id='+obj.orderNo+'>退款已通过</a>';
			// else if(obj.returnStatus==7)
			// 	str+='<a class="gray" data-id='+obj.orderNo+'>已提交支付宝退款</a>';
			// else if(obj.returnStatus==8)
			// 	str+='<a class="gray" data-id='+obj.orderNo+'>已提交微信退款</a>';
			// else if(obj.returnStatus==9)
			// 	str+='<a class="gray" data-id='+obj.orderNo+'>退款完成</a>';			
			// str+='<br/>';

			if(obj.returnStatus==0)
				str+='<a class="refundOrder" data-id="'+obj.orderNo+'">申请退款</a>';
			else if(obj.returnStatus==-1)
				str+='<a class="refundOrder" data-id='+obj.orderNo+'>申请退款</a>';
			else if(obj.returnStatus==1)
				str+='<a class="gray cancelRefundOrder" data-id='+obj.orderNo+'>退单已申请</a>';
			else if(obj.returnStatus==3)
				str+='<a class="gray" data-id='+obj.orderNo+'>退单审核中</a>';
			else if(obj.returnStatus==7)
				str+='<a class="gray" data-id='+obj.orderNo+'>退款已完成</a>';
			else if(obj.returnStatus==8)
				str+='<a class="gray" data-id='+obj.orderNo+'>退款已完成</a>';
			str+='<br/>';

			if(stu==7){str+='<a class="confirmOrder" data-id="'+obj.orderNo+'">确认收货</a>';}
			li+=str;
			li+='</i></span>';
			li+='</li>';
		}

		document.querySelector('.order-list').innerHTML=li;
		bindDataEvent();
		var _page=[];
		nowPage.innerText=data.page.page<=data.page.pages?data.page.page:data.page.pages;
		allPage.innerText=data.page.pages;
		allPage.setAttribute('data-page',allPage.innerText);
		pageLeft.setAttribute('data-page',data.page.page>1?data.page.page-1:1);
		pageRight.setAttribute('data-page',data.page.page<data.page.pages?data.page.page+1:data.page.pages);

	});
}

function bindDataEvent(){
	_app.click('.cancelOrder',function(t,e){
		if(!confirm('确定要取消订单吗?'))
			return;
		var form={};
		form.orderNo=t.getAttribute('data-id');
		_app.AJAX('/api/cancelOrder','POST',form,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				alert('订单已成功取消');
				t.parentNode.parentNode.parentNode.remove();
			}
			//t.parentNode.parentNode.parentNode.remove();
		});
	});

	_app.click('.confirmOrder',function(t,e){
		if(!confirm('现在要确认收货吗？'))
			return;
		var form={};
		form.orderNo=t.getAttribute('data-id');
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

	_app.click('.refundOrder',function(t,e){
		_app.showAlert('.refund-box');
		var form={};
		//{orderNo: 'ae3ca364ce8ba6f6', returnType:1, pics:[], reason:'买错了' ,skuList: [{skuId:'1743', quantity: 1}] }
		orderNo=t.getAttribute('data-id');
		refundNo.value=orderNo;
		var goodsDom=t.parentNode.parentNode.parentNode.querySelector('.list-goods');
		var imgs=goodsDom.querySelectorAll('img');
		document.querySelector('.refund-goods').innerHTML='';
		for(var i=0;i<imgs.length;i++){
			var li=document.createElement('li');
			li.innerHTML='<input class="checkbox" type="checkbox" data-id="'+imgs[i].getAttribute('data-id')+'" checked="checked"/>';
			li.innerHTML+='<span><img src="'+imgs[i].getAttribute('src')+'" height="50"/></span>';
			li.innerHTML+='<label>'+goodsDom.querySelectorAll('strong>b')[i].innerText+'x'+imgs[i].getAttribute('data-num')+'</label>';
			li.innerHTML+='<div>退款<input type="text" class="refund-num" data-max="'+imgs[i].getAttribute('data-num')+'" value="'+imgs[i].getAttribute('data-num')+'"/>件';
			document.querySelector('.refund-goods').appendChild(li);
		}

		_app.click('.refund-goods .checkbox',function(t,e){
			var ck=document.querySelectorAll('.refund-goods .checkbox');

			for(var i=0;i<ck.length;i++){
				console.log(ck[i].checked);
				if(!ck[i].checked){
					allchecked.checked=false;
					return;
				}
			}
			allchecked.checked=true;
		});
		//_app.AJAX('/api/refundOrder',)
	});

	_app.click('.cancelRefundOrder',function(t,e){
		if(confirm('确定要取消退款申请吗?')){
			var no=t.getAttribute('data-id');
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

}
bindDataEvent();
_app.AJAX('/api/getOrderNum','GET',{},function(data){
	var data=JSON.parse(data);
	for(var i=0;i<data.list.length;i++){
		var dom=document.querySelector('#order_'+data.list[i].orderStatus);
		if(dom){
			dom.innerText='('+data.list[i].count+')';
		}
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
			dataBind();
		}else{
			
		}
	});
});


_app.click('#allchecked',function(t,e){
	var ck=document.querySelectorAll('.refund-goods .checkbox');
	for(var i=0;i<ck.length;i++){
		ck[i].checked=t.checked;
	}
});

