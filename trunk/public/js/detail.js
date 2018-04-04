_app.click('#addShoppingCar',function(t,e){
	var form={};
	//{itemSkuId:4267,amount:1}
	//
	var numDom=document.querySelector('.number-list .c');
	var min=0;
	var max=0;
	if(numDom){
		min=parseInt(numDom.getAttribute('data-min'));
		max=parseInt(numDom.getAttribute('data-max'));
	}
	if(!min==max && (parseInt(amount.value)<min || parseInt(amount.value)>max)){
		alert('请根据所选数量规格输入购买数量');
		return;
	}
	if(parseInt(amount.value)>storgeNum){
		alert('库存不足');
		return;
	}
	form.itemSkuId=document.querySelector('.format-list>.c').getAttribute('skuId');
	form.amount=amount.value;
	_app.AJAX('/api/addShoppingCar','POST',form,function(data){
		var data=JSON.parse(data);
		if(data.code!=0){
			location.href='/login?url=/detail'+location.search;
			return;
		}
		if(confirm('已经成功加入购物车，现在去要去查看吗？')){
			location.href='/users/ShoppingCar';
		}
	});
});


_app.click('.detail-num>button',function(t,e){
	var num=parseInt(t.getAttribute('data-num'));
	amount.value=parseInt(amount.value)+num;
});

_app.click('#buyNow',function(t,e){

	var buyStr='0_';
	var numDom=document.querySelector('.number-list .c');
	var min=0;
	var max=0;
	if(numDom){
		min=parseInt(numDom.getAttribute('data-min'));
		max=parseInt(numDom.getAttribute('data-max'));
	}
	if(!min==max && (parseInt(amount.value)<min || parseInt(amount.value)>max)){
		alert('请根据所选数量规格输入购买数量');
		return;
	}
	if(parseInt(amount.value)>storgeNum){
		alert('库存不足');
		return;
	}
	buyStr+=document.querySelector('.format-list>.c').getAttribute('skuId')+'_';
	buyStr+=amount.value;
	location.href='/users/createorder?str='+buyStr;
});


_app.click('.number-list li',function(t,e){
	document.querySelector('.number-list .c').setAttribute('class','');
	var tt=null;
	if(t.tagName!='div'){
		tt=t.parentNode;
		tt.setAttribute('class','c');
	}
	else{
		tt=t;
		t.setAttribute('class','c');
	}
	sellPrice.innerText='￥'+parseInt(tt.getAttribute('data-price'))/100;
	amount.value=tt.getAttribute('data-max');

});

_app.click('.detail-head-list li',function(t,e){
	document.querySelector('.detail-head-list .c').setAttribute('class','');
	var tt=null;
	if(t.tagName!='li')
		tt=t.parentNode;
	else
		tt=t;
	tt.setAttribute('class','c');
	chooseImg.setAttribute('src',tt.querySelector('img').getAttribute('src'));

});