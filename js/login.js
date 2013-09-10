$(document).on("pageshow", "#login_page", function(e) {
	alert('login ready');
	if ( workingStatus.isLogin ) {
    	$.mobile.changePage("views/main.html");
    	return;
	}
	navigator.app.clearHistory();
	//get user pw
	if ( workingStatus.isFirst ) {
		workingStatus.user = window.localStorage.getItem("user");
		workingStatus.password = window.localStorage.getItem("password");
		workingStatus.isFirst = false;
	}
	
	alert('user:'+workingStatus.user + ' ,password:' + workingStatus.password);
	if ( workingStatus.user != null ) {
		alert('user exist, try to login...');
		$('#username').val(workingStatus.user);
		$('#password').val(workingStatus.password);
		tryLogin();
	} 
	
	$('#login_btn').click( function(e) {
		//check user 
		tryLogin();
	});
	
	$('#login_btn').click( function(e) {
		//check user 
		tryLogin();
	});
});


function tryLogin() {
	$.mobile.showPageLoadingMsg();
	var reqStr =  'user='+ $('#username').val()+'&password=' + $('#password').val();

	$.ajax({
		url: initOptions.webSite +"/test.php",
		data: reqStr,
		dataType: "json",
		cache: false,
		success: function( response ) {
			$.mobile.hidePageLoadingMsg();
			alert("response:"+response.id);
			if ( response.id > 0 ) {
				workingStatus.isLogin = true;
				workingStatus.uid = response.id;
				//save in local storage
				window.localStorage.setItem("user", $('#username').val() );
				window.localStorage.setItem("password", $('#password').val() );
				
				$.mobile.changePage('main.html');
			} else {
				alert(response.msg);
			}
		},
		timeout: initOptions.timeout,
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("Error, textStatus: " + textStatus + " errorThrown: "+ errorThrown);
			
			$.mobile.hidePageLoadingMsg();

			//show error message
			$( "<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+ $.mobile.pageLoadErrorMessage +"</h1></div>" )
				.css({ "display": "block", "opacity": 0.96, "top": 100 })
				.appendTo( $.mobile.pageContainer )
				.delay( 800 )
				.fadeOut( 1000, function() {
					$( this ).remove();
				});
		}
	});
	
}