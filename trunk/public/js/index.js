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

	_app.click('.list-filter-check>input',function(t,e){
		
		for(var i=0;i<allCheck.length;i++){
			if(allCheck[i]!=t)
				allCheck[i].checked=false;

		}
		//goodsList();
	});


	function goodsList(){
		var form={};
		if(document.querySelector('#orderBy')){
			form.ordername=document.querySelector('#orderBy').getAttribute('data-name');
			form.ordertype=document.querySelector('#orderBy').getAttribute('data-ordertype');
		}
		if(document.querySelector('#brandBox>.c').getAttribute('cid')!='-1')
			form.brandId=document.querySelector('#brandBox>.c').getAttribute('cid');

		if(document.querySelector('#catBox>.c').getAttribute('cid')!='-1')
			form.catId=document.querySelector('#catBox>.c').getAttribute('cid');
		
		var allCheck=document.querySelectorAll('.list-filter-check>input');
		for(var i=0;i<allCheck.length;i++){
			if(allCheck[i].checked){
				form.itemType=allCheck[i].getAttribute('data-name');
			}
		}
		form.page=pageNow.innerText;
		

		_app.AJAX('/api/goodsList','GET',form,function(data){
			
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