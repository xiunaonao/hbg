
_app.click('#add_address',function(t,e){
	//updateId.value=0;
	writeAddr({});
	_app.showAlert('.center-alertaddress');
});

bindAddressEvent();
function bindAddressEvent(){
	_app.click('.address-info .update-address',function(t,e){
		var id=t.getAttribute('data-id');
		var bs=t.parentNode.querySelectorAll('b');
		//updateId.value=id;
		writeAddr({
			id:id,
			province:bs[0].innerText,
			city:bs[1].innerText,
			area:bs[2].innerText,
			address:bs[3].innerText,
			postName:bs[4].innerText,
			telephone:bs[5].innerText,
			IDCard:bs[6].innerText
		});

		_app.showAlert('.center-alertaddress');
	});

	_app.click('.address-info .delete-address',function(t,e){
		var id=t.getAttribute('data-id');
		if(confirm('确定要删除这个地址吗')){
			var form={id:id};
			_app.AJAX('/api/delAddress','POST',form,function(data){
				var data=JSON.parse(data);
				if(data.code==0){
					alert('删除成功');
					t.parentNode.parentNode.remove();
				}
			});
		}
	});
}

function writeAddr(obj){
	updateId.value=obj.id?obj.id:'';
	telephone.value=obj.telephone?obj.telephone:'';
	postName.value=obj.postName?obj.postName:'';
	IDCard.value=obj.IDCard?obj.IDCard:'';
	var _province=obj.province?obj.province:'浙江省';
	var _city=obj.city?obj.city:'杭州市';
	var _area=obj.area?obj.area:'下城区';
	detailAddress.value=obj.address?obj.address:'';

	_Addr.bind('#province','#city','#area',_province,_city,_area);


}

_app.click('#confirmUpdate',function(t,e){
		var addForm={contactor:postName.value,
			mobile:telephone.value,
			idnum:IDCard.value,
			province:province.value,
			city:city.value,
			area:area.value,
			address:detailAddress.value};
		if(updateId.value){
			addForm.id=updateId.value;
		}
		_app.AJAX('/api/addAddress','POST',addForm,function(data){
			var data=JSON.parse(data);
			if(data.code==0){
				alert('操作成功');
				var dom=document.querySelector('.address-info');
				_app.AJAX('/api/myAddress','GET',{},function(data2){
					var data2=JSON.parse(data2);
					if(data2.code==0){
						dom.innerHTML='';
						var ul='';
						for(var i=0;i<data2.list.length;i++){
							var li='<p>';
							var obj=data2.list[i];
							li+='<label>';
							li+='<b>'+obj.province+'</b>';
							li+='<b>'+obj.city+'</b>';
							li+='<b>'+obj.area+'</b>';
							li+='<b>'+obj.address+' </b>';
							li+='<b>'+obj.name+' </b>';
							li+='<b>'+obj.mobile+' </b>';
							li+='<b>'+obj.identityCard+'</b>';
							li+='<a data-id="'+obj.id+'" class="update-address">[修改]</a>';
							li+='<a data-id="'+obj.id+'" class="delete-address">[删除]</a>';
							li+='</label>';
							li+='</p>';
							ul+=li;
						}
						dom.innerHTML=ul;
						bindAddressEvent();
					}
				});
			}
		})
});