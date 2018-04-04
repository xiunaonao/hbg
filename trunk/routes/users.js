var express = require('express');
var router = express.Router();
var homeApi=require('../controller/homeApi');
var userApi=require('../controller/userApi');
/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('center',{title:'用户中心',userName:res.locals._user.nickName,userMoney:res.locals._user.money});
});

router.get(['/createorder'],function(req,res,next){
	var str=req.query.str;
	var dataStr={};
	dataStr.buySkus=[];
	var ids=[];
	for(var i=0;i<str.split(',').length;i++){
		var str2=str.split(',')[i];
		var data=str2.split('_');
		dataStr.buySkus.push({skuId:data[1],amount:data[2]});
		ids.push(data[0]);
	}


	userApi.buyNow({data:JSON.stringify(dataStr)},function(data){
		console.log('创建订单返回');
		console.log(JSON.stringify(data));
		userApi.myAddress({},function(data2){
			userApi.getCoupon({},function(data3){
				res.render('createorder',{title:'订单创建',ids:ids,data:data,data2:data2,data3:data3});
			},{token:getToken(req)});
			
		},{token:getToken(req)});
	},{token:getToken(req)});
	//{"buySkus":[{"skuId":731,"amount":1},{"skuId":1743,"amount":1}]}
	
});

router.get('/shoppingCar',function(req,res,next){

	userApi.getShoppingCar({},function(data){
		//console.log(JSON.stringify(data));
		var number=0;
		var price=0;
		//console.log(data.list);
		if(!data || !data.list){
			res.render('shoppingCar',{title:'进货单',data:{list:[]},total_number:0,total_price:0});
			return;
		}
		for(var i=0;i<data.list.length;i++){
			var item=data.list[i].cartItems;
			for(var j=0;j<item.length;j++){
				console.log(item[j].amount+'*'+item[j].sellPrice);
				number+=item[j].amount;
				price+=item[j].amount*item[j].sellPrice;
			}
		}
		res.render('shoppingCar',{title:'进货单',data:data,total_number:number,total_price:price});
	},{token:getToken(req)});
});

router.get('/updatePwd',function(req,res,next){
	res.render('updatePwd',{title:'修改密码'});
});

router.get('/myCoupon',function(req,res,next){
	userApi.getCoupon({},function(data){
		res.render('myCoupon',{title:'我的优惠券',data:data});
	},{token:getToken(req)});
});

router.get('/myAddress',function(req,res,next){
	userApi.myAddress({},function(data){
		res.render('myAddress',{title:'我的收货地址',data:data});
	},{token:getToken(req)});
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
