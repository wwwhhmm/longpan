 var initOptions = {
	connectOnStartup : true,
    
	webSite : 'http://www.adyun.com',
	updateSite : 'http://www.adyun/mobile',
	// # The callback function to invoke in case application fails to connect to Worklight Server
	//onConnectionFailure: function (){},
	
	// # Worklight server connection timeout
	timeout: 6000,
	
};

 
var workingStatus = {
	isConnected : false,
	isLogin : false,
	
	isFirst : true,
	user : '',
	password : '',
	
	uid: 0,
	
};