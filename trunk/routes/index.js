var express = require('express');
var router = express.Router();
var homeApi=require('../controller/homeApi.js');
var userApi=require('../controller/userApi.js');
/* GET home page. */
router.get(['/','/web/','/index','/web/index'], function(req, res, next) {
	var ky='';
	if(req.body.ky)
		ky=req.body.ky;
	homeApi.getHome({data:"{'itemName':'"+ky+"'}"},function(data){
		res.render('index',{title:'首页',data:data,ky:ky,inGoodsList:true});
	});
  
});

router.get('/loginout',function(req,res,next){
	res.clearCookie('hbg_user');
	res.clearCookie('hbg_remember');
	res.redirect('/login');
});


router.get(['/goods'],function(req,res,next){
	var title='';

	var ky='';
	var type=0;
	if(req.query.ky)
		ky=req.query.ky;
	type=req.query.type;

	var str="";
	if(req.query.type==1){
		title='一般贸易';
		str='common';
	}
	else if(req.query.type==2){
		title='保税专区';
		str='bond';
	}
	else{
		title='所有商品';
		type=0;
	}
	console.log(ky);
	homeApi.getHome({data:"{'itemName':'"+ky+"','itemType':'"+str+"'}"},function(data){
		res.render('goods',{title:title,ky:ky,data:data,type:req.query.type,inGoodsList:true});
	});
});

router.get(['/login'],function(req,res,next){
	var url=req.query.url;
	if(!url)
		url='/users/';
	res.render('login',{title:'登录',url:url});
});

router.get(['/register'],function(req,res,next){
	res.render('register',{title:'注册'});
});

router.get(['/findPwd'],function(req,res,next){
	res.render('findPwd',{title:'找回密码'});
});

router.get(['/detail'],function(req,res,next){
	var id=req.query.id;
	homeApi.getGoodsDetail({data:"{id:'"+id+"'}"},function(data){
		res.render('detail',{title:'商品详情',data,data,id:id});
	},{token:getToken(req)});
});

function getToken(req,str){
	console.log(req.cookies['hbg_user']);
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
