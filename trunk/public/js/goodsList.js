(function(){
	_app.click('.orderBy',function(t,e){
		var old=document.querySelector('#orderBy');
		var cls=t.getAttribute('class');
		var type='desc';
		if(old){

			if(old==t){
				var ordertype=old.getAttribute('data-ordertype');
				if(ordertype=='desc'){
					type='asc';
				}else{
					type='desc';
				}
			}
			old.setAttribute('class',old.getAttribute('class').replace(' desc','').replace(' asc',''));
			old.setAttribute('id','');
		}
		t.setAttribute('id','orderBy');
		t.setAttribute('class',cls.replace(' desc','').replace(' asc','')+' '+type);
		t.setAttribute('data-ordertype',type);
		goodsList();

	});

	_app.click('.index-category-value>a',function(t,e){
		t.parentNode.querySelector('.c').setAttribute('class','');
		t.setAttribute('class','c');
		goodsList();
	});

	_app.click('.list-filter-check>input',function(t,e){
		
		var allCheck=document.querySelectorAll('.list-filter-check>input');
		for(var i=0;i<allCheck.length;i++){
			if(allCheck[i]!=t)
				allCheck[i].checked=false;
		}
		goodsList();
	});

	_app.click('.page-move',function(t,e){
		var num=t.getAttribute('data-page');
		pageNow.innerText=num;
		goodsList();
	});


	function goodsList(){
		var form={};
		if(document.querySelector('#orderBy')){
			form.orderName=document.querySelector('#orderBy').getAttribute('data-name');
			form.orderType=document.querySelector('#orderBy').getAttribute('data-ordertype');
		}
		if(document.querySelector('#brandBox>.c').getAttribute('cid')!='-1')
			form.brandId=document.querySelector('#brandBox>.c').getAttribute('cid');

		if(document.querySelector('#catBox>.c').getAttribute('cid')!='-1')
			form.catId=document.querySelector('#catBox>.c').getAttribute('cid');
		
		var allCheck=document.querySelectorAll('.list-filter-check>input');
		for(var i=0;i<allCheck.length;i++){
			console.log(allCheck[i].checked+' '+allCheck[i].getAttribute('data-name'));
			if(allCheck[i].checked){
				form.itemType=allCheck[i].getAttribute('data-name');
			}
		}
		if(__itemType){
			form.itemType=__itemType;
		}
		form.page=pageNow.innerText;
		form.itemName=__ky.value;

		console.log(form);

		_app.AJAX('/api/goodsList','POST',form,function(data){
			var ul=document.querySelector('.list-item');
			ul.innerHTML='';
			var data=JSON.parse(data);
			console.log(data);
			if(!data.obj.items)
				data.obj.items=[];
			for(var i=0;i<data.obj.items.length;i++){
				var item=data.obj.items[i];
				var li='<li class="item"><div class="goods"><a class="goods-img" href="/detail?id='+item.id+'">';
				li+='<img src="'+item.picUrls[0]+'"></a>';
				li+='<div class="goods-title"><a href="'+item.id+'"><span>'+item.name+'</span></a></div>';
				li+='<div class="goods-price"><div class="goods-price-right"><label>市场价</label><span>￥'+(item.marketPrice/100.0).toFixed(2)+'</span></div>';
				li+='<div class="goods-price-left"><strong>￥'+(item.sellPrice/100.0).toFixed(2)+'</strong></div></div></li>';
				ul.innerHTML+=li;
			}
			var page=data.pcPage;
			pageAll.innerText=page.pages;
			document.querySelectorAll('.page-move')[0].setAttribute('data-page',page.page-1>0?page.page-1:1);
			document.querySelectorAll('.page-move')[1].setAttribute('data-page',page.page>1<page.pages?page.page+1:page.pages);


		});
		/*
		{page:'当前页',
		itemName:'商品名称',
		catId:'一级分类id',
		brandId:'品牌id',
		itemType:'保税（bond）或一般贸易（common）',
		order:'排序字段 销量(sellNum)  价格(sellPrice)',
		orderType:'排序类型 asc desc'}
		 */
	}

})();