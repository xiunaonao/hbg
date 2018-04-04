var express = require('express');
var router = express.Router();
var userApi=require('../controller/userApi.js');
var homeApi=require('../controller/homeApi.js');
var orderApi=require('../controller/orderApi.js');
var fs = require("fs");
var http=require('http');
/*************************商品***************************/
router.post('/goodsList',function(req,res,next){
	var datas={data:JSON.stringify(req.body)};
	homeApi.getHome(datas,function(data){
		res.json(data);
	});
});
router.post('/recharge',function(req,res,next){
	var datas={data:JSON.stringify(req.body)};
	console.log(datas);
	userApi.recharge(datas,function(data){
		res.json(data);
	},{token:getToken(req)});

});
router.post('/addShoppingCar',function(req,res,next){
	var datas={data:JSON.stringify(req.body)};
	userApi.addShoppingCar(datas,function(data){
		res.json(data);
	},{token:getToken(req)});
});
router.post('/shoppingCarInCrease',function(req,res,next){
	var datas={data:JSON.stringify(req.body)};
	userApi.shoppingCarInCrease(datas,function(data){
		res.json(data);
	},{token:getToken(req)});
});
router.post('/deleteShoppingCar',function(req,res,next){
	var datas={data:JSON.stringify(req.body)};
	userApi.deleteShoppingCar(datas,function(data){
		res.json(data);
	},{token:getToken(req)});
});
router.post('/buyNow',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.buyNow({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});
router.post('/payStatus',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	console.log(dataStr);
	orderApi.payStatus({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/pay',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.pay({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});


/************************用户****************************/
router.get('/users',function(req,res,next){
	userApi.getUser(function(data){
		if(data.code=='0'){
			var d=new Date();
			d.setDate(d.getDate()+7);
			res.cookie('hbg_remember', '1', { expires: d, httpOnly: true });
			//res.cookie('hbg_tel', req.body.mobile, { maxAge: 900000, httpOnly: true });
			var obj2=data.obj;
			obj2.token=getToken(req);
			res.cookie('hbg_user',JSON.stringify(obj2), { expires: d, httpOnly: true });
			/*
			{"code":0,"msg":"登录成功",
			"obj":
				{"createTime":1517386484000,
				"editTime":1517386484000,
				"enabled":true,
				"id":4,
				"level":0,"mobile":"18314898769","money":0,"nickName":"海彼购8769","password":"******","token":"9664dce6bde4419e8275474914"},"token":"9664dce6bde4419e8275474914"}

			 */

			//res.cookie('hbg_name');
		}
		delete data.obj.token;
		delete data.obj.password;
		res.json(data);
	},{token:getToken(req)});
});

router.post('/addAddress',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.addAddress({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/delAddress',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.delAddress({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.get('/myAddress',function(req,res,next){
	userApi.myAddress({},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/updatePwd',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.updatePwd({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});	
});

router.get('/getCoupon',function(req,res,next){
	var dataStr=JSON.stringify({page:req.query.page,status:req.query.status});
	userApi.getCoupon({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});

});

router.get('/getOrderNum',function(req,res,next){
	orderApi.getOrderNum({},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/updateInfo',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.save({data:dataStr},function(data){
		userApi.getUser(function(data){
			if(data.code=='0'){
				var d=new Date();
				d.setDate(d.getDate()+7);
				res.cookie('hbg_remember', '1', { expires: d, httpOnly: true });
				//res.cookie('hbg_tel', req.body.mobile, { maxAge: 900000, httpOnly: true });
				var obj2=data.obj;
				obj2.token=getToken(req);
				res.cookie('hbg_user',JSON.stringify(obj2), { expires: d, httpOnly: true });
			}
			delete data.obj.token;
			delete data.obj.password;
			res.json(data);
		},{token:getToken(req)});
	},{token:getToken(req)});
});

router.get('/yzm',function(req,res,next){
	var url='http://small.hibigoo.com//doc/api/pc/imgCode/generateImg.json';
	 http.get(url, function (response) {
	 	//console.log(response);
        response.setEncoding('binary');  //二进制binary
        var type = response.headers["content-type"];
        var captchakey=response.headers["captchakey"];
        var Data = '';
        response.on('data', function (data) {    //加载到内存
            Data += data;
        }).on('end', function () {          //加载完
            res.writeHead(200, { 'Access-Control-Allow-Origin': '*', "Content-Type": type,"captchakey":captchakey });   //设置头，允许跨域
            res.write(Data , "binary");
            res.end();
        });
    })

});
router.post('/getCode',function(req,res,next){
	var dataStr="{mobile:"+req.body.mobile+", type:'"+req.body.type+"'}";
	console.log(dataStr);
	userApi.getCode({data:dataStr},function(data){
		res.json(data);
	});
})
router.post('/register',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.register({data:dataStr},function(data){
		res.json(data);
	});
});
router.post('/findPwd',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.findPwd({data:dataStr},function(data){
		res.json(data);
	});
});

router.post('/login',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	userApi.login({data:dataStr},function(data){
		if(data.code=='0'){
			var d=new Date();
			d.setDate(d.getDate()+7);
			res.cookie('hbg_remember', '1', { expires: d, httpOnly: true });
			//res.cookie('hbg_tel', req.body.mobile, { maxAge: 900000, httpOnly: true });
			res.cookie('hbg_user',JSON.stringify(data.obj), { expires: d, httpOnly: true });
			/*
			{"code":0,"msg":"登录成功",
			"obj":
				{"createTime":1517386484000,
				"editTime":1517386484000,
				"enabled":true,
				"id":4,
				"level":0,"mobile":"18314898769","money":0,"nickName":"海彼购8769","password":"******","token":"9664dce6bde4419e8275474914"},"token":"9664dce6bde4419e8275474914"}

			 */
			delete data.obj.password;

			//res.cookie('hbg_name');
		}
		res.json(data);
	});
})

/*****************订单*******************/

router.post('/submitOrder',function(req,res,next){
	//console.log(req.cookies['hbg_user']);
	var dataStr=JSON.stringify(req.body);
	orderApi.submitOrder({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/orderStatus',function(req,res,next){
	var no=req.query.no;
	orderApi.orderDetail({data:'{orderNo:'+no+'}'},function(data){
		res.json({status:data.obj.orderStatus});
	},{token:getToken(req)});
});

router.post('/orderListStatus',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.orderList({data:dataStr},function(data){
		res.json({status:data.obj.orderStatus});
	},{token:getToken(req)});
});

router.post('/orderList',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.orderList({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/changePay',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.changePay({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/cancelOrder',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.cancel({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/confirmOrder',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.confirm({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/refundOrder',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.refund({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/cancelRefundOrder',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.cancelRefund({data:dataStr},function(data){
		res.json(data);
	},{token:getToken(req)});
});

router.post('/refundOrderList',function(req,res,next){
	var dataStr=JSON.stringify(req.body);
	orderApi.refundList({data:dataStr},function(data){
		res.json(data);
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

module.exports=router;