(function(){
	function bindEvent(){
		_app.click('.changeNum button',function(t,e){
			var addnum=parseInt(t.getAttribute('data-num'));
			var numdom=t.parentNode.querySelector('.txtNum');
			var num=parseInt(numdom.value)+addnum;
			numdom.value=num;
			var price=parseFloat(t.parentNode.querySelector('.salePirce').value);
			t.parentNode.parentNode.parentNode.querySelector('.list-totalPrice label').innerText='￥'+(num*price).toFixed(2);
			t.parentNode.parentNode.parentNode.querySelector('.list-totalPrice .saleTotalPrice').value=(num*price);
			changeNum(numdom.getAttribute('data-id'),addnum);
			changeGoods();
		});
		var allNumBox=document.querySelectorAll('.changeNum .txtNum');
		for(var i=0;i<allNumBox.length;i++){
			allNumBox[i].addEventListener('keyup',function(e){
				var t=this;
				var num=parseInt(t.value);
				var price=parseFloat(t.parentNode.querySelector('.salePirce').value);
				t.parentNode.parentNode.parentNode.querySelector('.list-totalPrice label').innerText='￥'+(num*price).toFixed(2);
			t.parentNode.parentNode.parentNode.querySelector('.list-totalPrice .saleTotalPrice').value=(num*price);
				changeGoods();
			});
		}



		_app.click('.car-list .list-head .checkbox>input',function(t,e){
			var checked=t.checked;
			var allcheck=document.querySelectorAll('#goodsList .checkbox>input');
			var allcheck2=document.querySelectorAll('#goodsList .shoppingCar-warehouse>input');
			for(var i=0;i<allcheck.length;i++){
				allcheck[i].checked=checked;
			}
			for(var i=0;i<allcheck2.length;i++){
				allcheck2[i].checked=checked;
			}
			changeGoods();
		});

		_app.click('.shoppingCar-warehouse>input',function(t,e){
			var checked=t.checked;
			var allcheck=t.parentNode.parentNode.querySelectorAll('.checkbox>input');
			for(var i=0;i<allcheck.length;i++){
				allcheck[i].checked=checked;
			}
			if(!checked){
				document.querySelector('.car-list .list-head .checkbox>input').checked=false;
			}
			changeGoods();
		});

		_app.click('.checkbox>input',function(t,e){
			var checked=t.checked;
			if(!checked){
				document.querySelector('.car-list .list-head .checkbox>input').checked=false;
				t.parentNode.parentNode.parentNode.parentNode.querySelector('.shoppingCar-warehouse>input').checked=false;
			}
			changeGoods();
		});

		_app.click('.delete-goods',function(t,e){
			if(confirm('确定要删除这件商品吗？')){
				var li=t.parentNode.parentNode.parentNode;
				li.parentNode.removeChild(li);
			}
			var id=t.getAttribute('data-id');
			_app.AJAX('/api/deleteShoppingCar','POST',{ids:[id]},function(data){

			});
			changeGoods();
		});

		_app.click('#buyNow',function(t,e){
			//{"buySkus":[{"skuId":372,"amount":1}]} 
			var form={};
			form.buySkus=[];
			changeGoods(function(str){
				console.log(str);
				location.href='/users/createorder?str='+str;
			});
		});

		function changeNum(id,num){
			var form={id:id,value:num};
			_app.AJAX('/api/shoppingCarInCrease','POST',form,function(data){});
		}
	}

	
	bindEvent();

	function changeGoods(callback){
		var priceDom=document.querySelectorAll('.car-list .saleTotalPrice');
		var totalPrice=0;
		var totalNum=0;
		var buyStr='';
		for(var i=0;i<priceDom.length;i++){
			if(priceDom[i].parentNode.parentNode.querySelector('.checkbox>input').checked){
				totalPrice+=parseFloat(priceDom[i].value);
				totalNum+=parseInt(priceDom[i].parentNode.parentNode.querySelector('.txtNum').value);
				//buySkus.push({skuId:parseInt(priceDom[i].parentNode.parentNode.querySelector('.skuId').value),amount:parseInt(priceDom[i].parentNode.parentNode.querySelector('.txtNum').value)});
				if(buyStr)
					buyStr+=',';
				buyStr+=priceDom[i].parentNode.parentNode.querySelector('.carId').value+'_';
				buyStr+=priceDom[i].parentNode.parentNode.querySelector('.skuId').value+'_';
				buyStr+=priceDom[i].parentNode.parentNode.querySelector('.txtNum').value;
				
			}
		}
		document.querySelector('.shoppingCar-buy strong').innerText='￥'+totalPrice.toFixed(2);
		chooseNum.innerText=totalNum;

		if(callback){
			callback(buyStr);
		}
	}
})()