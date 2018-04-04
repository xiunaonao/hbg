var request=require('request');
var host='http://small.hibigoo.com/';
var api={
	submitOrder:function(data,callback,head){
		var url='/doc/api/pc/order/submitOrder.json';
		this.post(url,data,callback,head);
	},
	orderDetail:function(data,callback,head){
		var url='/doc/api/pc/order/detail.json';
		this.post(url,data,callback,head);
	},
	orderList:function(data,callback,head){
		var url='/doc/api/pc/order/query.json';
		this.post(url,data,callback,head);
	},
	payStatus:function(data,callback,head){
		var url='/doc/api/pc/tradeRecord/weixinPayInfo.json';
		this.post(url,data,callback,head);
	},
	pay:function(data,callback,head){
		var url='/doc/api/pc/order/balancePayment.json';
		this.post(url,data,callback,head);
	},
	changePay:function(data,callback,head){
		console.log(data);
		var url='doc/api/pc/order/createPayString';
		this.post(url,data,callback,head);
	},
	getOrderNum:function(data,callback,head){
		var url='/doc/api/pc/order/orderStatusNum.json';
		this.post(url,data,callback,head);
	},
	cancel:function(data,callback,head){
		var url='/doc/api/pc/order/cancel.json';
		this.post(url,data,callback,head);
	},
	confirm:function(data,callback,head){
		var url='/doc/api/pc/order/confirm.json';
		this.post(url,data,callback,head);
	},
	refund:function(data,callback,head){
		var url='/doc/api/pc/order/refunds.json';
		console.log(data);
		this.post(url,data,callback,head);
	},
	express:function(data,callback,head){
		var url='/doc/api/pc/order/express.json';
		this.post(url,data,callback,head);
	},
	cancelRefund:function(data,callback,head){
		var url='/doc/api/pc/order/cancelReturnOrder.json';
		this.post(url,data,callback,head);
	},
	refundList:function(data,callback,head){
		var url='doc/api/pc/order/queryReturnOrder.json';
		this.post(url,data,callback,head);
	},
	get:function(url,success){
		request(host+url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    success(body,response); // Show the HTML for the baidu homepage.
		  }
		});
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
		    	console.log(body);
		    	success(body);
		    }
		}); 

	}
}
module.exports=api;


//