var express = require('express');
var router = express.Router();
var orderApi=require('../controller/orderApi');

router.get('/list',function(req,res,next){
	var page=req.query.page;
	if(!page)
		page=1;
	var status=req.query.status;
	var str=JSON.stringify({page:page,status:status});
	orderApi.orderList({data:str},function(data){
		res.render('orderlist',{title:'订单列表',data:data,status:status,page:page});
	},{token:getToken(req)});
	
});

router.get('/pay',function(req,res,next){
	res.render('pay',{no:req.query.no,src:'http://www.gbtags.com/gb/qrcode?t='+req.query.src,type:req.query.type
	,name:req.query.name,price:req.query.price,title:'订单支付'});
});

router.get('/payConfirm',function(req,res,next){
	var no=req.query.no;
	orderApi.orderDetail({data:'{"orderNo":"'+no+'"}'},function(data){
		res.render('payConfirm',{title:'订单支付',data:data,no:no});
	},{token:getToken(req)});
});

router.get('/paySuccess',function(req,res,next){
	var no=req.query.no;
	res.render('paySuccess',{title:'支付成功',no:no});
});

router.get('/detail',function(req,res,next){
	var no=req.query.no;
	orderApi.orderDetail({data:'{"orderNo":"'+no+'"}'},function(data){
		if(data.code==99){
			res.redirect('/login?url=/order/detail?no='+no);
			return;
		}
		if(data.obj.orderStatus>=7){
			Express(data,0,function(dataList){
				res.render('orderdetail',{title:'订单详情',data:data,no:no,express:dataList});
			});
			
		}else{
			res.render('orderdetail',{title:'订单详情',data:data,no:no,express:null});
		}
	},{token:getToken(req)});
	
	function Express(data,index,callback,datas){
		if(!data || !data.obj || !data.obj.subOrderList || data.obj.subOrderList.length<1 || !data.obj.subOrderList[0].subOrderDO || 
			!data.obj.subOrderList[0].subOrderDO.orderItemSkuList || data.obj.subOrderList[0].subOrderDO.orderItemSkuList.length<1){
			callback([]);
			return;
		}
		
		if(data.obj.subOrderList[0].subOrderDO.orderItemSkuList.length<=index){
			callback(datas);
			return;
		}
		if(!datas)
			datas=[];
		var goods=data.obj.subOrderList[0].subOrderDO.orderItemSkuList[index];

		var form={subOrderNo:goods.subOrderNo,orderItemSkuId:goods.skuId};
		orderApi.express({data:JSON.stringify(form)},function(data2){
			if(data2.code==0)
				datas.push(data2);
			Express(data,index+1,callback,datas);
		},{token:getToken(req)});
	}

});



function getToken(req,str){
	if(!req.cookies || !req.cookies['hbg_user']){
		return false;
	}
	var user=JSON.parse(req.cookies['hbg_user']);
	if(!str){
		console.log(user.token);
		return user.token;
	}
	else{
		return user[str];
	}
}

module.exports = router;