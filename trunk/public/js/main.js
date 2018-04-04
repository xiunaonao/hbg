//(function(){
	var app=function(){
		var obj={
			_host:'http://localhost/',
			category:['|/|/index|','|/goods?type=1|','|/goods?type=2|'],
			init:function(){
				/*顶部加载*/
				var path=location.pathname.toLowerCase();
				var search=location.search.toLowerCase().replace('?','');
				for(var i=0;i<this.category.length;i++){
					document.querySelectorAll('.header-category .menus')[i].setAttribute('class','menus');


					if(this.category[i].indexOf("|"+path+"|")>-1){
						document.querySelectorAll('.header-category .menus')[i].setAttribute('class','menus c');
					}else if(this.category[i].indexOf("|"+path+"?")>-1){
						var _search=this.category[i].replace(path+'?','');
						for(var j=0;j<search.split('&').length;j++){

							if('|'+search.split('&')[j]+'|'==_search){
								document.querySelectorAll('.header-category .menus')[i].setAttribute('class','menus c');
								break;
							}
						}
					}

				}
				/*登录或注册隐藏顶部*/
				if(path=='/login' || path=='/register' ){
					
					document.querySelector('.header-category').style.display='none';
					//document.querySelector('.footer-box').setAttribute('class',document.querySelector('.footer-box').getAttribute('class')+' fixed-bottom');
				}

				this.event();
			},
			event:function(){
				var self=this;

				self.click('.close-btn',function(t,e){
					t.parentNode.parentNode.style.display='none';
					for(var i=0;i<t.parentNode.parentNode.children.length;i++){
						t.parentNode.parentNode.children[i].style.display='none';
					}
				});

				self.click('#searchBtn',function(t,e){
					location.href='/goods?ky='+searchTxt.value;
				});
			},
			click:function(cls,callback){
				var t=document.querySelectorAll(cls);

				if(t){
					for(var i=0;i<t.length;i++){
						t[i].addEventListener('click',function(e){
							callback(e.target,e);
						});
					}
				}
			},
			showAlert:function(cls){
				document.querySelector('.center-alert-box').style.display='block';
				document.querySelector(cls).style.display='block';
			},
			hideAlert:function(cls){
				document.querySelector('.center-alert-box').style.display='none';
				document.querySelector(cls).style.display='none';
			},
			AJAX: function (url, type, data, success, async,error) {
	            var xhr = new XMLHttpRequest();
	            var _url = url;
	            xhr.open(type, _url, async?false:true);
	            xhr.setRequestHeader('Content-Type', 'application/json');
	            console.log(data);
	            if (data)
	                xhr.send(JSON.stringify(data));
	            else
	                xhr.send();
	            xhr.onload = function () {
	                if (xhr.status == 200) {
	                    success((xhr.responseText));
	                } else {
	                    if (error)
	                        error(xhr);
	                }
	            }
	        },
	        pageTool:function(){

	        },
	        Alert:function(txt){
	        	alert(txt);
	        },
	        centerMenu:function(index){
	        	var list=[
	        		{name:'账户中心',url:'/users/'},
	        		{name:'我的订单',url:'/order/list'},
	        		{name:'修改密码',url:'/users/updatePwd'},
	        		{name:'我的优惠券',url:'/users/myCoupon'},
	        		{name:'我的收货地址',url:'/users/myAddress'}
	        	];
	        	var htm='';
	        	for(var i=0;i<list.length;i++){
	        		htm+='<li '+(i==index?'class="c"':'""')+'><a href="'+list[i].url+'">'+list[i].name+'</a></li>';
	        	}

	        	document.querySelector('.center-left').innerHTML=htm;
	        }
		};
		obj.init();
		return obj;
	};


	var _app=new app();


//})();