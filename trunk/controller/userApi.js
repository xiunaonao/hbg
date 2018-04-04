var request=require('request');
var host='http://small.hibigoo.com/';
var api={
	login:function(data,callback){
		var url='/doc/api/user/login.json';
		this.post(url,data,callback);
	},
	getUser:function(callback,head){
		var url='/doc/api/user/info.json';
		console.log(head);
		this.get(url,callback,head);

	},
	register:function(data,callback){
		var url='/doc/api/user/reg.json';
		this.post(url,data,callback);
	},
	findPwd:function(data,callback){
		var url='/doc/api/user/findpwd.json';
		this.post(url,data,callback);
	},
	save:function(data,callback,head){
		var url='/doc/api/member/info/save.json';
		this.post(url,data,callback,head);
	},
	yzm:function(data,callback){
		var url='/doc/api/pc/imgCode/generateImg.json';
		this.get(url,callback);
	},
	loginout:function(callback){
		var url='/doc/api/user/logout.json';
		this.post(url,{},callback);
	},
	getCode:function(data,callback){
		var url='/doc/api/user/sendSms.json';
		this.post(url,data,callback);
	},
	recharge:function(data,callback,head){
		var url='/doc/api/pc/tradeRecord/recharge.json';
		this.post(url,data,callback,head);
	},
	getShoppingCar:function(data,callback,head){
		var url='/doc/api/pc/shoppingCart/query.json';
		this.post(url,data,callback,head);
	},
	addShoppingCar:function(data,callback,head){
		var url='/doc/api/pc/shoppingCart/save.json';
		this.post(url,data,callback,head);
	},
	shoppingCarInCrease:function(data,callback,head){
		var url='/doc/api/pc/shoppingCart/increase.json';
		this.post(url,data,callback,head);
	},
	deleteShoppingCar:function(data,callback,head){
		var url='/doc/api/pc/shoppingCart/remove.json';
		this.post(url,data,callback,head);
	},
	buyNow:function(data,callback,head){
		var url='/doc/api/pc/order/previewOrder.json';
		console.log(head);
		console.log(data);
		this.post(url,data,callback,head);
	},
	addAddress:function(data,callback,head){
		var url='/doc/api/pc/address/save.json';
		this.post(url,data,callback,head);
	},
	delAddress:function(data,callback,head){
		var url='/doc/api/pc/address/del.json';
		this.post(url,data,callback,head);
	},
	updatePwd:function(data,callback,head){
		var url='/doc/api/member/info/updatePwd.json';
		this.post(url,data,callback,head);
	},
	getCoupon:function(data,callback,head){
		var url='/doc/api/member/coupon/query.json';
		this.post(url,data,callback,head);
	},
	myAddress:function(data,callback,head){
		var url='/doc/api/pc/address/queryAll.json';
		this.post(url,data,callback,head);
	},
	get:function(url,success,head){

		var header={};
		if(head)
			header=head;
		//header['content-type']='application/json';
		request({
		    url: host+url,
		    method: "GET",
		    json: true,
		    headers: header,
		}, function(error, response, body) {
			console.log(error);
		    if (!error && response.statusCode == 200) {
		    	console.log('接口请求完毕');
		    	//res.render('index', { title: '首页' });
		    	success(body);
		    }
		}); 

		// request(host+url, function (error, response, body) {

		//   if (!error && response.statusCode == 200) {
		//     success(body,response); // Show the HTML for the baidu homepage.
		//   }
		// })
	},
	post:function(url,data,success,head){
		var header={};
		if(head)
			header=head;
		header['content-type']='application/json';
		request({
		    url: host+url,
		    method: "POST",
		    json: true,
		    headers: header,
		    formData: data
		}, function(error, response, body) {
			console.log(error);
		    if (!error && response.statusCode == 200) {
		    	console.log('接口请求完毕');
		    	//res.render('index', { title: '首页' });
		    	success(body);
		    }
		}); 

	}
}
module.exports=api;