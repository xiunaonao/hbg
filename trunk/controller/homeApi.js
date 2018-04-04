var request=require('request');
var host='http://small.hibigoo.com/';
var api={
	getHome:function(data,callback){
		var url='/doc/api/pc/hbg/home.json';
		this.post(url,data,callback);
	},
	getGoodsDetail:function(data,callback,head){
		var url='/doc/api/pc/item/detail.json';
		console.log(data);
		this.post(url,data,callback,head);
	},
	get:function(url,success){
		request(host+url, function (error, response, body) {

		  if (!error && response.statusCode == 200) {
		    success(body); // Show the HTML for the baidu homepage.
		  }
		})
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